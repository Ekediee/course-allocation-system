// Types for our data
interface Course {
    id: string;
    code: string;
    title: string;
    unit: number;
    isAllocated: boolean;
    allocatedTo?: string;
  }
  
  interface Level {
    id: string;
    name: string;
    courses: Course[];
  }
  
  interface Program {
    id: string;
    name: string;
    levels: Level[];
  }
  
  export interface Semester {
    id: string;
    name: string;
    programs: Program[];
  }

export const activeLink = 'flex items-center px-3 py-2 text-sm rounded-md bg-blue-700 text-white'
export const normalLink = 'flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100'