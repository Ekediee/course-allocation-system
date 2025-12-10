// Types for our data
export interface Course {
  id: string;
  code: string;
  title: string;
  unit: number;
  class_option: string;
  specialization: string;
  isAllocated: boolean;
  allocatedTo?: string;
  programCourseId?: string;
  is_pushed_to_umis: boolean;
  pushed_to_umis_by?: string;
}
  
export interface Level {
  id: string;
  name: string;
  courses?: Course[];
}

export interface Program {
  id: string;
  name: string;
  levels: Level[];
}

export interface Semester {
  sessionId: string;
  sessionName: string;
  id: string;
  name: string;
  programs: Program[];
}

export interface Lecturer {
  id: number;
  staff_id: string;
  name: string;
  rank: string;
  qualification: string;
  phone: string;
}

export const activeLink = 'flex items-center px-3 py-2 text-sm rounded-md bg-blue-700 text-white'
export const normalLink = 'flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100'