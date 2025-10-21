/**
 * 数据库视图对应的TypeScript类型定义
 */

/**
 * student_view视图类型
 * 基于SQL:
 * CREATE VIEW student_view AS
 * SELECT 
 *     p.id AS person_id,
 *     p.name,
 *     p.email,
 *     p.phone,
 *     p.gender,
 *     p.birth_date,
 *     sp.id AS student_profile_id,
 *     sp.student_number,
 *     sp.education_level,
 *     sp.school,
 *     sp.major,
 *     sp.graduation_year,
 *     sp.target_countries
 * FROM 
 *     people p
 * JOIN student_profiles sp ON p.id = sp.person_id
 * WHERE 
 *     'student' = ANY(p.roles);
 */
export interface StudentView {
  person_id: number;
  name: string;
  email?: string;
  phone?: string;
  gender?: string;
  birth_date?: string;
  student_profile_id: number;
  student_number?: string;
  education_level?: string;
  school?: string;
  major?: string;
  graduation_year?: number;
  target_countries?: string[];
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
}

/**
 * student_services_view视图类型
 * 基于SQL:
 * CREATE VIEW student_services_view AS
 * SELECT 
 *     ss.id AS service_id,
 *     p.name AS student_name,
 *     sp.student_number,
 *     fst.name AS service_type,
 *     ss.status,
 *     ss.enrollment_date,
 *     ss.end_date,
 *     ss.progress,
 *     mp.id AS mentor_profile_id,
 *     mp_person.name AS mentor_name
 * FROM 
 *     student_services ss
 * JOIN student_profiles sp ON ss.student_id = sp.id
 * JOIN people p ON sp.person_id = p.id
 * JOIN finance_service_types fst ON ss.service_type_id = fst.id
 * LEFT JOIN mentor_profiles mp ON ss.mentor_id = mp.id
 * LEFT JOIN people mp_person ON mp.person_id = mp_person.id;
 */
export interface StudentServiceView {
  service_id: number;
  student_name: string;
  student_number?: string;
  service_type: string;
  status: string;
  enrollment_date: string;
  end_date?: string;
  progress?: number;
  mentor_profile_id?: number;
  mentor_name?: string;
} 