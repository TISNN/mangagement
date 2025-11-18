import { useState } from 'react';
import * as XLSX from 'xlsx';

import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Upload,
  X,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { financeService } from '@/services/finance/financeService';

interface SocialSecurityImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ImportStatus {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export const SocialSecurityImportDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: SocialSecurityImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setStatus(null);
      setPreviewData([]);
      
      // 预览文件内容
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          if (!event.target?.result) return;
          
          const data = new Uint8Array(event.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // 尝试找到表头行
          const range = XLSX.utils.decode_range(firstSheet['!ref'] || 'A1:Z1');
          let headerRow = 0;
          for (let row = 0; row <= Math.min(5, range.e.r); row++) {
            const rowData: any = {};
            for (let col = range.s.c; col <= range.e.c; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
              const cell = firstSheet[cellAddress];
              if (cell && cell.v) {
                const colName = XLSX.utils.encode_col(col);
                rowData[colName] = String(cell.v);
              }
            }
            const rowText = Object.values(rowData).join('').toLowerCase();
            if (rowText.includes('姓名') || rowText.includes('序号') || rowText.includes('证件')) {
              headerRow = row;
              break;
            }
          }
          
          // 读取表头
          const headerRowData: any = {};
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
            const cell = firstSheet[cellAddress];
            if (cell && cell.v) {
              const colName = XLSX.utils.encode_col(col);
              headerRowData[colName] = String(cell.v).trim();
            }
          }
          
          // 合并第二行表头（如果有）
          if (headerRow + 1 <= range.e.r) {
            for (let col = range.s.c; col <= range.e.c; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: headerRow + 1, c: col });
              const cell = firstSheet[cellAddress];
              if (cell && cell.v) {
                const colName = XLSX.utils.encode_col(col);
                const firstHeader = headerRowData[colName] || '';
                const secondHeader = String(cell.v).trim();
                headerRowData[colName] = firstHeader && secondHeader 
                  ? `${firstHeader}.${secondHeader}` 
                  : (firstHeader || secondHeader);
              }
            }
          }
          
          // 读取数据
          const dataStartRow = headerRow + (headerRowData[Object.keys(headerRowData)[0]]?.includes('.') ? 2 : 1);
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
            defval: '',
            range: dataStartRow,
            raw: false,
            header: 1
          });
          
          // 手动映射
          const mappedData = (jsonData as any[][]).map((row: any[]) => {
            const mappedRow: any = {};
            for (let col = 0; col < row.length && col <= range.e.c; col++) {
              const colName = XLSX.utils.encode_col(col);
              const header = headerRowData[colName];
              if (header) {
                mappedRow[header] = row[col];
              }
            }
            return mappedRow;
          }).filter((row: any) => Object.keys(row).length > 0);
          
          // 只预览前5条
          setPreviewData(mappedData.slice(0, 5));
          setStatus({
            message: `已读取 ${mappedData.length} 条记录，预览前 5 条`,
            type: 'info',
          });
        } catch (error) {
          setStatus({
            message: '文件预览失败，请检查文件格式',
            type: 'error',
          });
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  // 格式化期间（转换为 YYYY-MM 格式）
  const formatPeriod = (value: any): string => {
    if (!value) return '';
    
    // 如果是日期对象
    if (value instanceof Date) {
      return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`;
    }
    
    // 如果是字符串
    if (typeof value === 'string') {
      const trimmed = value.trim();
      // 已经是 YYYY-MM 格式
      if (/^\d{4}-\d{2}$/.test(trimmed)) return trimmed;
      // 尝试解析日期字符串
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      // 处理 Excel 日期序列号（如 45292）
      const serialNum = parseFloat(trimmed);
      if (!isNaN(serialNum) && serialNum > 25569) {
        // Excel 日期从 1900-01-01 开始，需要转换
        const excelEpoch = new Date(1900, 0, 1);
        const date = new Date(excelEpoch.getTime() + (serialNum - 2) * 24 * 60 * 60 * 1000);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
    }
    
    return String(value);
  };

  // 映射 Excel 列名到数据库字段
  const mapExcelRowToRecord = (row: any): any => {
    // 获取所有可能的列名（不区分大小写）
    const rowKeys = Object.keys(row);
    const getValueCaseInsensitive = (possibleKeys: string[], defaultValue: any = '') => {
      for (const key of possibleKeys) {
        // 精确匹配
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
          return row[key];
        }
        // 不区分大小写匹配
        const foundKey = rowKeys.find(k => k.toLowerCase() === key.toLowerCase());
        if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null && row[foundKey] !== '') {
          return row[foundKey];
        }
      }
      return defaultValue;
    };

    const getNumberCaseInsensitive = (possibleKeys: string[]) => {
      for (const key of possibleKeys) {
        const value = row[key];
        if (value !== undefined && value !== null && value !== '') {
          const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
          if (!isNaN(num)) return num;
        }
        // 不区分大小写匹配
        const foundKey = rowKeys.find(k => k.toLowerCase() === key.toLowerCase());
        if (foundKey) {
          const value = row[foundKey];
          if (value !== undefined && value !== null && value !== '') {
            const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/,/g, ''));
            if (!isNaN(num)) return num;
          }
        }
      }
      return 0;
    };

    return {
      name: getValueCaseInsensitive(['姓名', 'name', '员工姓名', '员工', '员工名称'], ''),
      id_number: getValueCaseInsensitive(['证件号码', '证件号', 'id_number', '身份证号', '身份证号码'], ''),
      id_type: getValueCaseInsensitive(['证件类型', 'id_type', '身份证类型'], '居民身份证'),
      personal_social_security_number: getValueCaseInsensitive(['个人社保号', '社保号', 'personal_social_security_number', '社保编号'], ''),
      period_start: formatPeriod(getValueCaseInsensitive(['费款所属期起', 'period_start', '期间起', '开始期间', '所属期起', '缴费期间起'], '')),
      period_end: formatPeriod(getValueCaseInsensitive(['费款所属期止', 'period_end', '期间止', '结束期间', '所属期止', '缴费期间止'], '')),
      // 基本养老保险(单位缴纳) - 支持多种列名格式
      endowment_insurance_employer_base: getNumberCaseInsensitive([
        '基本养老保险(单位缴纳).缴费基数',
        '基本养老保险(单位缴纳)缴费基数',
        '基本养老保险(单位缴纳).基数',
        '基本养老保险(单位缴纳)基数',
        '养老(单位)缴费基数',
        '养老(单位).缴费基数',
        '养老(单位).基数',
        '养老保险单位缴费基数',
        '养老保险单位.缴费基数',
        'endowment_insurance_employer_base'
      ]),
      endowment_insurance_employer_amount: getNumberCaseInsensitive([
        '基本养老保险(单位缴纳).应缴金额',
        '基本养老保险(单位缴纳)应缴金额',
        '基本养老保险(单位缴纳).金额',
        '基本养老保险(单位缴纳)金额',
        '养老(单位)应缴金额',
        '养老(单位).应缴金额',
        '养老(单位).金额',
        '养老保险单位应缴金额',
        '养老保险单位.应缴金额',
        'endowment_insurance_employer_amount'
      ]),
      // 基本养老保险(个人缴纳)
      endowment_insurance_individual_base: getNumberCaseInsensitive([
        '基本养老保险(个人缴纳).缴费基数',
        '基本养老保险(个人缴纳)缴费基数',
        '基本养老保险(个人缴纳).基数',
        '基本养老保险(个人缴纳)基数',
        '养老(个人)缴费基数',
        '养老(个人).缴费基数',
        '养老(个人).基数',
        '养老保险个人缴费基数',
        '养老保险个人.缴费基数',
        'endowment_insurance_individual_base'
      ]),
      endowment_insurance_individual_amount: getNumberCaseInsensitive([
        '基本养老保险(个人缴纳).应缴金额',
        '基本养老保险(个人缴纳)应缴金额',
        '基本养老保险(个人缴纳).金额',
        '基本养老保险(个人缴纳)金额',
        '养老(个人)应缴金额',
        '养老(个人).应缴金额',
        '养老(个人).金额',
        '养老保险个人应缴金额',
        '养老保险个人.应缴金额',
        'endowment_insurance_individual_amount'
      ]),
      // 农民工失业保险(单位缴纳)
      migrant_unemployment_employer_base: getNumberCaseInsensitive([
        '农民工失业保险(单位缴纳).缴费基数',
        '农民工失业保险(单位缴纳)缴费基数',
        '农工失业(单位)缴费基数',
        'migrant_unemployment_employer_base'
      ]),
      migrant_unemployment_employer_amount: getNumberCaseInsensitive([
        '农民工失业保险(单位缴纳).应缴金额',
        '农民工失业保险(单位缴纳)应缴金额',
        '农工失业(单位)应缴金额',
        'migrant_unemployment_employer_amount'
      ]),
      // 农民工失业保险(个人缴纳)
      migrant_unemployment_individual_base: getNumberCaseInsensitive([
        '农民工失业保险(个人缴纳).缴费基数',
        '农民工失业保险(个人缴纳)缴费基数',
        '农工失业(个人)缴费基数',
        'migrant_unemployment_individual_base'
      ]),
      migrant_unemployment_individual_amount: getNumberCaseInsensitive([
        '农民工失业保险(个人缴纳).应缴金额',
        '农民工失业保险(个人缴纳)应缴金额',
        '农工失业(个人)应缴金额',
        'migrant_unemployment_individual_amount'
      ]),
      // 城镇工失业保险(单位缴纳)
      urban_unemployment_employer_base: getNumberCaseInsensitive([
        '城镇工失业保险(单位缴纳).缴费基数',
        '城镇工失业保险(单位缴纳)缴费基数',
        '城镇失业(单位)缴费基数',
        'urban_unemployment_employer_base'
      ]),
      urban_unemployment_employer_amount: getNumberCaseInsensitive([
        '城镇工失业保险(单位缴纳).应缴金额',
        '城镇工失业保险(单位缴纳)应缴金额',
        '城镇失业(单位)应缴金额',
        'urban_unemployment_employer_amount'
      ]),
      // 城镇工失业保险(个人缴纳)
      urban_unemployment_individual_base: getNumberCaseInsensitive([
        '城镇工失业保险(个人缴纳).缴费基数',
        '城镇工失业保险(个人缴纳)缴费基数',
        '城镇失业(个人)缴费基数',
        'urban_unemployment_individual_base'
      ]),
      urban_unemployment_individual_amount: getNumberCaseInsensitive([
        '城镇工失业保险(个人缴纳).应缴金额',
        '城镇工失业保险(个人缴纳)应缴金额',
        '城镇失业(个人)应缴金额',
        'urban_unemployment_individual_amount'
      ]),
      // 基本医疗保险(含生育)(单位缴纳)
      medical_insurance_employer_base: getNumberCaseInsensitive([
        '基本医疗保险(含生育)(单位缴纳).缴费基数',
        '基本医疗保险(含生育)(单位缴纳)缴费基数',
        '基本医疗保险(含生育)(单位缴纳).基数',
        '基本医疗保险(含生育)(单位缴纳)基数',
        '医疗(单位)缴费基数',
        '医疗(单位).缴费基数',
        '医疗(单位).基数',
        '医疗保险单位缴费基数',
        'medical_insurance_employer_base'
      ]),
      medical_insurance_employer_amount: getNumberCaseInsensitive([
        '基本医疗保险(含生育)(单位缴纳).应缴金额',
        '基本医疗保险(含生育)(单位缴纳)应缴金额',
        '基本医疗保险(含生育)(单位缴纳).金额',
        '基本医疗保险(含生育)(单位缴纳)金额',
        '医疗(单位)应缴金额',
        '医疗(单位).应缴金额',
        '医疗(单位).金额',
        '医疗保险单位应缴金额',
        'medical_insurance_employer_amount'
      ]),
      // 基本医疗保险(含生育)(个人缴纳)
      medical_insurance_individual_base: getNumberCaseInsensitive([
        '基本医疗保险(含生育)(个人缴纳).缴费基数',
        '基本医疗保险(含生育)(个人缴纳)缴费基数',
        '基本医疗保险(含生育)(个人缴纳).基数',
        '基本医疗保险(含生育)(个人缴纳)基数',
        '医疗(个人)缴费基数',
        '医疗(个人).缴费基数',
        '医疗(个人).基数',
        '医疗保险个人缴费基数',
        'medical_insurance_individual_base'
      ]),
      medical_insurance_individual_amount: getNumberCaseInsensitive([
        '基本医疗保险(含生育)(个人缴纳).应缴金额',
        '基本医疗保险(含生育)(个人缴纳)应缴金额',
        '基本医疗保险(含生育)(个人缴纳).金额',
        '基本医疗保险(含生育)(个人缴纳)金额',
        '医疗(个人)应缴金额',
        '医疗(个人).应缴金额',
        '医疗(个人).金额',
        '医疗保险个人应缴金额',
        'medical_insurance_individual_amount'
      ]),
      // 工伤保险
      work_injury_base: getNumberCaseInsensitive([
        '工伤保险.缴费基数',
        '工伤保险缴费基数',
        '工伤缴费基数',
        'work_injury_base'
      ]),
      work_injury_amount: getNumberCaseInsensitive([
        '工伤保险.应缴金额',
        '工伤保险应缴金额',
        '工伤应缴金额',
        'work_injury_amount'
      ]),
    };
  };

  const handleImport = async () => {
    if (!file) {
      setStatus({
        message: '请先选择 Excel 文件',
        type: 'error',
      });
      return;
    }

    try {
      setIsImporting(true);
      setProgress(5);
      setStatus({ message: '开始读取文件...', type: 'info' });

      // 读取文件
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (!event.target?.result) {
            throw new Error('文件读取失败');
          }

          setProgress(15);
          setStatus({ message: '正在解析 Excel 数据...', type: 'info' });

          // 解析 Excel 文件
          const data = new Uint8Array(event.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });
          
          // 获取第一个工作表
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // 尝试从第2行开始读取（跳过可能的表头行）
          // 先读取前几行判断表头位置
          const range = XLSX.utils.decode_range(firstSheet['!ref'] || 'A1:Z1');
          let headerRow = 0;
          
          // 尝试找到包含"姓名"或"序号"的行作为表头
          for (let row = 0; row <= Math.min(5, range.e.r); row++) {
            const rowData: any = {};
            for (let col = range.s.c; col <= range.e.c; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
              const cell = firstSheet[cellAddress];
              if (cell && cell.v) {
                const colName = XLSX.utils.encode_col(col);
                rowData[colName] = String(cell.v);
              }
            }
            const rowText = Object.values(rowData).join('').toLowerCase();
            if (rowText.includes('姓名') || rowText.includes('序号') || rowText.includes('证件')) {
              headerRow = row;
              break;
            }
          }
          
          // 读取表头，构建列名映射
          const headerRowData: any = {};
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
            const cell = firstSheet[cellAddress];
            if (cell && cell.v) {
              const colName = XLSX.utils.encode_col(col);
              headerRowData[colName] = String(cell.v).trim();
            }
          }
          
          // 如果有第二行表头，合并列名
          if (headerRow + 1 <= range.e.r) {
            for (let col = range.s.c; col <= range.e.c; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: headerRow + 1, c: col });
              const cell = firstSheet[cellAddress];
              if (cell && cell.v) {
                const colName = XLSX.utils.encode_col(col);
                const firstHeader = headerRowData[colName] || '';
                const secondHeader = String(cell.v).trim();
                // 合并表头，如 "基本养老保险(单位缴纳).缴费基数"
                headerRowData[colName] = firstHeader && secondHeader 
                  ? `${firstHeader}.${secondHeader}` 
                  : (firstHeader || secondHeader);
              }
            }
          }
          
          // 读取数据，从表头行的下一行（或多行表头的最后一行）开始
          const dataStartRow = headerRow + (headerRowData[Object.keys(headerRowData)[0]]?.includes('.') ? 2 : 1);
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
            defval: '',
            range: dataStartRow,
            raw: false,
            header: 1 // 使用数字作为列索引，然后手动映射
          });
          
          // 手动映射列名
          const mappedData = (jsonData as any[][]).map((row: any[]) => {
            const mappedRow: any = {};
            for (let col = 0; col < row.length && col <= range.e.c; col++) {
              const colName = XLSX.utils.encode_col(col);
              const header = headerRowData[colName];
              if (header) {
                mappedRow[header] = row[col];
              }
            }
            return mappedRow;
          }).filter((row: any) => Object.keys(row).length > 0);

          setProgress(30);
          setStatus({ message: `已解析 ${mappedData.length} 条记录，正在转换数据格式...`, type: 'info' });

          if (mappedData.length === 0) {
            throw new Error('Excel 文件中没有数据');
          }

          // 转换数据
          const records = mappedData.map((row: any) => mapExcelRowToRecord(row));

          // 验证必填字段
          const invalidRecords = records.filter((r: any) => !r.name || !r.id_number || !r.period_start || !r.period_end);
          if (invalidRecords.length > 0) {
            throw new Error(`有 ${invalidRecords.length} 条记录缺少必填字段（姓名、证件号码、费款所属期）`);
          }

          setProgress(50);
          setStatus({ message: `正在导入 ${records.length} 条记录...`, type: 'info' });

          // 批量导入（每次 50 条）
          const batchSize = 50;
          let successCount = 0;
          let errorCount = 0;

          for (let i = 0; i < records.length; i += batchSize) {
            const batch = records.slice(i, i + batchSize);
            
            try {
              // 使用 Promise.all 并行插入，但限制并发
              const insertPromises = batch.map((record: any) =>
                financeService.addSocialSecurityRecord(record).catch((err) => {
                  console.error('插入记录失败:', err);
                  return null;
                })
              );
              
              const results = await Promise.all(insertPromises);
              const batchSuccess = results.filter(r => r !== null).length;
              successCount += batchSuccess;
              errorCount += (batch.length - batchSuccess);
              
              setProgress(50 + Math.floor((i + batch.length) / records.length * 40));
              setStatus({
                message: `已导入 ${i + batch.length}/${records.length} 条记录...`,
                type: 'info',
              });
            } catch (error) {
              console.error('批量导入失败:', error);
              errorCount += batch.length;
            }
          }

          setProgress(100);
          setStatus({
            message: `导入完成！成功：${successCount} 条，失败：${errorCount} 条`,
            type: successCount > 0 ? 'success' : 'error',
          });

          if (successCount > 0 && onSuccess) {
            setTimeout(() => {
              onSuccess();
              onOpenChange(false);
            }, 1500);
          }
        } catch (error: any) {
          setStatus({
            message: error.message || '导入失败，请检查文件格式',
            type: 'error',
          });
          setProgress(0);
        } finally {
          setIsImporting(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      setStatus({
        message: error.message || '文件读取失败',
        type: 'error',
      });
      setIsImporting(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      setFile(null);
      setStatus(null);
      setProgress(0);
      setPreviewData([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>导入社保数据</DialogTitle>
          <DialogDescription>
            上传 Excel 文件（.xls, .xlsx）自动导入社保缴费记录
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 文件选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              选择 Excel 文件
            </label>
            <div className="flex items-center gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".xls,.xlsx,.csv"
                  onChange={handleFileChange}
                  disabled={isImporting}
                  className="hidden"
                />
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500">
                  <Upload className="h-4 w-4" />
                  <span>{file ? file.name : '点击选择文件'}</span>
                </div>
              </label>
              {file && !isImporting && (
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewData([]);
                    setStatus(null);
                  }}
                  className="rounded-lg p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* 预览数据 */}
          {previewData.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                数据预览（前 5 条）
              </label>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left">姓名</th>
                      <th className="px-3 py-2 text-left">证件号</th>
                      <th className="px-3 py-2 text-left">期间起</th>
                      <th className="px-3 py-2 text-left">期间止</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                    {previewData.map((row, index) => {
                      const mapped = mapExcelRowToRecord(row);
                      return (
                        <tr key={index}>
                          <td className="px-3 py-2">{mapped.name || '-'}</td>
                          <td className="px-3 py-2">{mapped.id_number || '-'}</td>
                          <td className="px-3 py-2">{mapped.period_start || '-'}</td>
                          <td className="px-3 py-2">{mapped.period_end || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 状态提示 */}
          {status && (
            <div
              className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                status.type === 'error'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
                  : status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                    : status.type === 'warning'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
              }`}
            >
              {status.type === 'error' && <AlertCircle className="h-4 w-4" />}
              {status.type === 'success' && <CheckCircle className="h-4 w-4" />}
              {status.type === 'info' && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{status.message}</span>
            </div>
          )}

          {/* 进度条 */}
          {progress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>导入进度</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* 格式说明 */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <p className="font-medium mb-2">Excel 格式要求：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>第一行必须包含标题行</li>
              <li>必须包含列：姓名、证件号码、费款所属期起、费款所属期止</li>
              <li>可选列：证件类型、个人社保号、各类保险的缴费基数和应缴金额</li>
              <li>支持多种列名格式，如"姓名"/"name"、"证件号码"/"证件号"等</li>
              <li>期间格式：YYYY-MM（如：2025-10）</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              disabled={isImporting}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500"
            >
              取消
            </button>
            <button
              onClick={handleImport}
              disabled={!file || isImporting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  开始导入
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

