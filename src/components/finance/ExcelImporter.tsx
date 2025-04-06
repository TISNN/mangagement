import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ExcelImporterProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

interface ImportStatus {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

const ExcelImporter: React.FC<ExcelImporterProps> = ({ onSuccess, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [progress, setProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus({ message: '文件已选择，请点击导入按钮开始导入', type: 'info' });
    }
  };

  const handleImportData = async () => {
    if (!file) {
      setStatus({ message: '请先选择Excel文件', type: 'error' });
      return;
    }

    try {
      setIsImporting(true);
      setProgress(5);
      setStatus({ message: '正在读取Excel文件...', type: 'info' });

      // 读取文件
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          if (!e.target?.result) {
            throw new Error('文件读取失败');
          }

          setProgress(10);
          setStatus({ message: '正在解析Excel数据...', type: 'info' });

          // 解析Excel文件
          const data = new Uint8Array(e.target.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // 获取第一个工作表
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          setProgress(20);
          setStatus({ message: `已解析 ${jsonData.length} 条记录，正在准备导入...`, type: 'info' });

          if (jsonData.length === 0) {
            throw new Error('Excel文件中没有数据');
          }

          // 准备导入的数据
          // 1. 获取现有人员、项目、服务类型、分类、账户数据
          setProgress(30);
          setStatus({ message: '正在获取系统数据...', type: 'info' });

          const [peopleResult, projectsResult, serviceTypesResult, categoriesResult, accountsResult] = 
            await Promise.all([
              supabase.from('people').select('id, name'),
              supabase.from('projects').select('id, name'),
              supabase.from('service_types').select('id, name'),
              supabase.from('finance_categories').select('id, name, direction'),
              supabase.from('finance_accounts').select('id, name')
            ]);

          // 验证数据获取是否成功
          if (peopleResult.error || projectsResult.error || serviceTypesResult.error || 
              categoriesResult.error || accountsResult.error) {
            throw new Error('获取系统数据失败');
          }

          const people = peopleResult.data;
          const projects = projectsResult.data;
          const serviceTypes = serviceTypesResult.data;
          const categories = categoriesResult.data;
          const accounts = accountsResult.data;

          setProgress(40);
          setStatus({ message: '正在处理导入数据...', type: 'info' });

          // 2. 准备交易数据并创建不存在的关联数据
          const transactions = [];
          const personMap = new Map(people.map(p => [p.name, p.id]));
          const projectMap = new Map(projects.map(p => [p.name, p.id]));
          const serviceTypeMap = new Map(serviceTypes.map(s => [s.name, s.id]));
          const categoryMap = new Map(categories.map(c => [c.name, c.id]));
          const accountMap = new Map(accounts.map(a => [a.name, a.id]));

          // 新增的数据缓存
          const newPeople = new Map();
          const newProjects = new Map();
          const newServiceTypes = new Map();
          const newCategories = new Map();

          // 处理每条Excel记录
          for (let i = 0; i < jsonData.length; i++) {
            const record = jsonData[i] as any;
            
            // 验证必要字段
            if (!record.amount || !record.direction || !record.status || !record.transaction_date) {
              console.warn(`第 ${i+1} 行记录缺少必要字段，已跳过`, record);
              continue;
            }
            
            // 处理人员
            let personId = null;
            if (record.person_name) {
              if (personMap.has(record.person_name)) {
                personId = personMap.get(record.person_name);
              } else if (newPeople.has(record.person_name)) {
                personId = newPeople.get(record.person_name);
              } else {
                // 创建新人员
                const { data, error } = await supabase
                  .from('people')
                  .insert({ name: record.person_name })
                  .select('id')
                  .single();
                
                if (error) {
                  console.error('创建人员失败:', error);
                } else {
                  personId = data.id;
                  newPeople.set(record.person_name, personId);
                  personMap.set(record.person_name, personId);
                }
              }
            }
            
            // 处理项目
            let projectId = null;
            if (record.project_name) {
              if (projectMap.has(record.project_name)) {
                projectId = projectMap.get(record.project_name);
              } else if (newProjects.has(record.project_name)) {
                projectId = newProjects.get(record.project_name);
              } else {
                // 创建新项目
                const { data, error } = await supabase
                  .from('projects')
                  .insert({ name: record.project_name, status: 'active' })
                  .select('id')
                  .single();
                
                if (error) {
                  console.error('创建项目失败:', error);
                } else {
                  projectId = data.id;
                  newProjects.set(record.project_name, projectId);
                  projectMap.set(record.project_name, projectId);
                }
              }
            }
            
            // 处理服务类型
            let serviceTypeId = null;
            if (record.service_type_name) {
              if (serviceTypeMap.has(record.service_type_name)) {
                serviceTypeId = serviceTypeMap.get(record.service_type_name);
              } else if (newServiceTypes.has(record.service_type_name)) {
                serviceTypeId = newServiceTypes.get(record.service_type_name);
              } else {
                // 创建新服务类型
                const { data, error } = await supabase
                  .from('service_types')
                  .insert({ name: record.service_type_name, is_active: true })
                  .select('id')
                  .single();
                
                if (error) {
                  console.error('创建服务类型失败:', error);
                } else {
                  serviceTypeId = data.id;
                  newServiceTypes.set(record.service_type_name, serviceTypeId);
                  serviceTypeMap.set(record.service_type_name, serviceTypeId);
                }
              }
            }
            
            // 验证分类和账户（这两个是必须的）
            const categoryName = record.category_name;
            const accountName = record.account_name;
            
            if (!categoryName || !accountName) {
              console.warn(`第 ${i+1} 行记录缺少分类或账户信息，已跳过`, record);
              continue;
            }
            
            let categoryId = null;
            if (categoryMap.has(categoryName)) {
              categoryId = categoryMap.get(categoryName);
            } else if (newCategories.has(categoryName)) {
              categoryId = newCategories.get(categoryName);
            } else {
              // 创建新分类
              const { data, error } = await supabase
                .from('finance_categories')
                .insert({ 
                  name: categoryName,
                  direction: record.direction,
                  active: true
                })
                .select('id')
                .single();
              
              if (error) {
                console.error('创建分类失败:', error);
                continue; // 没有分类就跳过这条记录
              } else {
                categoryId = data.id;
                newCategories.set(categoryName, categoryId);
                categoryMap.set(categoryName, categoryId);
              }
            }
            
            let accountId = null;
            if (accountMap.has(accountName)) {
              accountId = accountMap.get(accountName);
            } else {
              console.warn(`账户 "${accountName}" 不存在，该记录将被跳过`);
              continue; // 没有账户就跳过这条记录
            }
            
            // 添加到待导入的交易数组
            transactions.push({
              amount: parseFloat(record.amount.toString().replace(/[^\d.-]/g, '')),
              direction: record.direction,
              status: record.status,
              transaction_date: record.transaction_date,
              notes: record.notes || null,
              category_id: categoryId,
              account_id: accountId,
              person_id: personId,
              project_id: projectId,
              service_type_id: serviceTypeId
            });
            
            // 更新进度
            const currentProgress = 40 + Math.floor((i / jsonData.length) * 30);
            setProgress(currentProgress);
            if (i % 10 === 0) {
              setStatus({ message: `正在处理数据: ${i + 1}/${jsonData.length}...`, type: 'info' });
            }
          }
          
          setProgress(70);
          setStatus({ message: `共有 ${transactions.length} 条记录准备导入...`, type: 'info' });
          
          // 3. 批量导入交易数据
          const batchSize = 50;
          let insertedCount = 0;
          
          for (let i = 0; i < transactions.length; i += batchSize) {
            const batch = transactions.slice(i, i + batchSize);
            
            const { data, error } = await supabase
              .from('finance_transactions')
              .insert(batch);
            
            if (error) {
              console.error(`批量导入第 ${i/batchSize + 1} 批数据失败:`, error);
              setStatus({ 
                message: `导入过程中出现错误，已导入 ${insertedCount} 条数据`,
                type: 'warning'
              });
            } else {
              insertedCount += batch.length;
            }
            
            const currentProgress = 70 + Math.floor((i / transactions.length) * 30);
            setProgress(currentProgress);
            setStatus({ message: `已导入: ${insertedCount}/${transactions.length}...`, type: 'info' });
          }
          
          setProgress(100);
          setStatus({ 
            message: `导入完成！成功导入 ${insertedCount} 条交易记录，新增 ${newPeople.size} 个人员，${newProjects.size} 个项目，${newServiceTypes.size} 个服务类型，${newCategories.size} 个分类。`,
            type: 'success'
          });
          
          // 导入完成，重置文件
          setFile(null);
          
          // 调用成功回调
          if (onSuccess) {
            setTimeout(onSuccess, 2000);
          }
        } catch (error) {
          console.error('Excel导入过程中出错:', error);
          setStatus({ 
            message: `导入失败: ${error instanceof Error ? error.message : '未知错误'}`, 
            type: 'error' 
          });
        } finally {
          setIsImporting(false);
        }
      };

      reader.onerror = () => {
        setStatus({ message: '读取文件时出错', type: 'error' });
        setIsImporting(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Excel导入过程发生异常:', error);
      setStatus({ 
        message: `导入出错: ${error instanceof Error ? error.message : '未知错误'}`, 
        type: 'error' 
      });
      setIsImporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto bg-white rounded-lg shadow-sm border">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        {!file ? (
          <>
            <Upload size={48} className="text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 mb-4">
              选择Excel文件或拖放到这里
            </p>
            <Label 
              htmlFor="excel-file" 
              className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              选择文件
              <Input
                id="excel-file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
            </Label>
          </>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-md">
                  <Upload size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setFile(null);
                  setProgress(0);
                  setStatus(null);
                }}
                disabled={isImporting}
              >
                <X size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {status && (
        <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
          {status.type === 'error' && <AlertCircle className="h-4 w-4" />}
          {status.type === 'success' && <CheckCircle className="h-4 w-4" />}
          <AlertDescription>
            {status.message}
          </AlertDescription>
        </Alert>
      )}

      {progress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>导入进度</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={onClose} 
          disabled={isImporting}
        >
          取消
        </Button>
        <Button 
          onClick={handleImportData} 
          disabled={!file || isImporting}
        >
          {isImporting ? '导入中...' : '开始导入'}
        </Button>
      </div>

      <div className="text-sm text-gray-500 border-t pt-4 mt-4">
        <p className="font-medium">Excel格式要求：</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Excel文件第一行需要包含标题行</li>
          <li>必须包含以下列：amount(金额)、direction(收支方向)、status(状态)、transaction_date(交易日期)、category_name(分类名称)、account_name(账户名称)</li>
          <li>可选列：person_name(人员)、project_name(项目)、service_type_name(服务类型)、notes(备注)</li>
        </ul>
      </div>
    </div>
  );
};

export default ExcelImporter;