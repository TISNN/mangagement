/**
 * 当前用户信息 Hook
 */

import { useState, useEffect } from 'react';
import { CurrentUser } from '../types/dashboard.types';

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    // 从 localStorage 获取当前登录用户信息
    const userType = localStorage.getItem('userType');
    
    if (userType === 'admin') {
      const employeeData = localStorage.getItem('currentEmployee');
      if (employeeData) {
        const employee = JSON.parse(employeeData);
        setCurrentUser({
          id: employee.id,
          name: employee.name,
          position: employee.position,
          email: employee.email,
          avatar_url: employee.avatar_url,
          department: employee.department,
        });
      }
    } else if (userType === 'student') {
      const studentData = localStorage.getItem('currentStudent');
      if (studentData) {
        const student = JSON.parse(studentData);
        setCurrentUser({
          id: student.id,
          name: student.name,
          email: student.email,
          avatar_url: student.avatar_url,
        });
      }
    }
  }, []);

  return { currentUser };
}

