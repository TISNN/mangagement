#!/usr/bin/env node

/**
 * Supabase MCP Server
 * 为 Cursor 提供 Supabase 数据库访问能力
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// MCP 服务器实现
class SupabaseMCPServer {
  constructor() {
    this.tools = {
      'query_table': this.queryTable.bind(this),
      'get_table_schema': this.getTableSchema.bind(this),
      'list_tables': this.listTables.bind(this),
      'insert_record': this.insertRecord.bind(this),
      'update_record': this.updateRecord.bind(this),
      'delete_record': this.deleteRecord.bind(this),
      'count_records': this.countRecords.bind(this),
    };
  }

  // 查询表数据
  async queryTable({ table, select = '*', filters = {}, limit = 100, offset = 0 }) {
    try {
      let query = supabase.from(table).select(select);

      // 应用过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      // 分页
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        success: true,
        data,
        count: data?.length || 0,
        message: `成功查询 ${table} 表，返回 ${data?.length || 0} 条记录`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `查询失败: ${error.message}`
      };
    }
  }

  // 获取表结构
  async getTableSchema({ table }) {
    try {
      // 查询一条记录来获取字段结构
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          success: true,
          schema: [],
          message: `表 ${table} 为空，无法获取结构`
        };
      }

      const schema = Object.entries(data[0]).map(([key, value]) => ({
        field: key,
        type: value === null ? 'unknown' : 
              Array.isArray(value) ? 'array' :
              typeof value,
        sample: value
      }));

      return {
        success: true,
        schema,
        message: `成功获取 ${table} 表结构，共 ${schema.length} 个字段`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `获取表结构失败: ${error.message}`
      };
    }
  }

  // 列出所有表
  async listTables() {
    // 常用表列表（因为 Supabase API 无法直接列出所有表）
    const tables = [
      'students',
      'employees',
      'tasks',
      'task_comments',
      'leads',
      'meetings',
      'schools',
      'programs',
      'applications',
      'mentors'
    ];

    return {
      success: true,
      tables,
      message: `系统中有 ${tables.length} 个主要表`
    };
  }

  // 插入记录
  async insertRecord({ table, data }) {
    try {
      const { data: inserted, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (error) throw error;

      return {
        success: true,
        data: inserted,
        message: `成功插入 ${inserted?.length || 1} 条记录到 ${table} 表`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `插入失败: ${error.message}`
      };
    }
  }

  // 更新记录
  async updateRecord({ table, id, data }) {
    try {
      const { data: updated, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();

      if (error) throw error;

      return {
        success: true,
        data: updated,
        message: `成功更新 ${table} 表中 ID=${id} 的记录`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `更新失败: ${error.message}`
      };
    }
  }

  // 删除记录
  async deleteRecord({ table, id }) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true,
        message: `成功删除 ${table} 表中 ID=${id} 的记录`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `删除失败: ${error.message}`
      };
    }
  }

  // 统计记录数
  async countRecords({ table, filters = {} }) {
    try {
      let query = supabase.from(table).select('*', { count: 'exact', head: true });

      // 应用过滤条件
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { count, error } = await query;

      if (error) throw error;

      return {
        success: true,
        count,
        message: `${table} 表共有 ${count} 条记录`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: `统计失败: ${error.message}`
      };
    }
  }

  // 处理请求
  async handleRequest(request) {
    const { tool, params } = request;

    if (!this.tools[tool]) {
      return {
        success: false,
        error: `未知的工具: ${tool}`,
        availableTools: Object.keys(this.tools)
      };
    }

    return await this.tools[tool](params);
  }

  // 启动服务器
  start() {
    console.error('[Supabase MCP] 服务器已启动');
    console.error(`[Supabase MCP] 连接到: ${SUPABASE_URL}`);
    console.error('[Supabase MCP] 可用工具:', Object.keys(this.tools).join(', '));

    // 监听标准输入
    let buffer = '';
    process.stdin.on('data', async (chunk) => {
      buffer += chunk.toString();
      
      // 尝试解析 JSON
      try {
        const request = JSON.parse(buffer);
        buffer = '';
        
        const response = await this.handleRequest(request);
        console.log(JSON.stringify(response));
      } catch (e) {
        // JSON 不完整，继续等待
      }
    });

    process.stdin.on('end', () => {
      console.error('[Supabase MCP] 服务器关闭');
      process.exit(0);
    });
  }
}

// 启动服务器
const server = new SupabaseMCPServer();
server.start();

