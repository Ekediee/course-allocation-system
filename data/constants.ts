// Types for our data
export interface Course {
  id: string;
  code: string;
  title: string;
  unit: number;
  isAllocated: boolean;
  allocatedTo?: string;
}
  
export interface Level {
  id: string;
  name: string;
  courses: Course[];
}

export interface Program {
  id: string;
  name: string;
  levels: Level[];
}

export interface Semester {
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