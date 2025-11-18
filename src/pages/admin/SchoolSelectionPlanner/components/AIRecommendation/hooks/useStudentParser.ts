/**
 * 学生数据解析工具Hook
 */

import { useMemo } from 'react';
import type { StudentProfile, AIMatchCriteria } from '../../../types';

/**
 * 解析GPA分数
 */
export const parseGPA = (gpaStr?: string): number | undefined => {
  if (!gpaStr) return undefined;
  const match = gpaStr.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : undefined;
};

/**
 * 解析语言成绩
 */
export const parseLanguageScores = (student: StudentProfile): AIMatchCriteria['languageScores'] => {
  const scores: AIMatchCriteria['languageScores'] = {};
  
  if (student.languageScore) {
    // 解析TOEFL
    const toeflMatch = student.languageScore.match(/TOEFL[:\s]*(\d+)/i);
    if (toeflMatch) scores.toefl = parseInt(toeflMatch[1]);

    // 解析IELTS
    const ieltsMatch = student.languageScore.match(/IELTS[:\s]*(\d+\.?\d*)/i);
    if (ieltsMatch) scores.ielts = parseFloat(ieltsMatch[1]);
  }
  
  if (student.standardizedTests) {
    const testStr = student.standardizedTests.join(' ');
    // 解析GRE
    const greMatch = testStr.match(/GRE[:\s]*(\d+)/i);
    if (greMatch) scores.gre = parseInt(greMatch[1]);

    // 解析GMAT
    const gmatMatch = testStr.match(/GMAT[:\s]*(\d+)/i);
    if (gmatMatch) scores.gmat = parseInt(gmatMatch[1]);
  }
  
  return scores;
};

/**
 * 从学生信息生成匹配条件
 */
export const useStudentCriteria = (student: StudentProfile): AIMatchCriteria => {
  return useMemo(() => ({
    mode: 'quick',
    targetCountries: student.preferedCountries || [],
    targetPrograms: student.targetPrograms || [],
    currentSchool: student.undergraduate?.split('·')[0]?.trim(),
    gpa: parseGPA(student.gpa),
    gpaScale: student.gpa?.includes('4.0') ? '4.0' : '100',
    languageScores: parseLanguageScores(student),
  }), [student]);
};
