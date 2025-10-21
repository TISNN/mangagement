import { v4 as uuidv4 } from 'uuid';

export interface Training {
  id: string;
  title: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  maxStudents: string;
  type: 'online' | 'offline';
  materials: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// 从本地存储获取培训列表
export const getTrainings = (): Training[] => {
  const trainings = localStorage.getItem('trainings');
  return trainings ? JSON.parse(trainings) : [];
};

// 保存培训到本地存储
export const saveTraining = (training: Omit<Training, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Training => {
  const trainings = getTrainings();
  
  const newTraining: Training = {
    ...training,
    id: uuidv4(),
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  trainings.push(newTraining);
  localStorage.setItem('trainings', JSON.stringify(trainings));
  
  return newTraining;
};

// 更新培训信息
export const updateTraining = (id: string, updates: Partial<Training>): Training | null => {
  const trainings = getTrainings();
  const index = trainings.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  trainings[index] = {
    ...trainings[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem('trainings', JSON.stringify(trainings));
  return trainings[index];
};

// 删除培训
export const deleteTraining = (id: string): boolean => {
  const trainings = getTrainings();
  const filteredTrainings = trainings.filter(t => t.id !== id);
  
  if (filteredTrainings.length === trainings.length) return false;
  
  localStorage.setItem('trainings', JSON.stringify(filteredTrainings));
  return true;
};

// 获取单个培训详情
export const getTraining = (id: string): Training | null => {
  const trainings = getTrainings();
  return trainings.find(t => t.id === id) || null;
}; 