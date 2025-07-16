"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import Cookies from 'js-cookie';


const AppContext = createContext<any>(undefined);

export type roleT = {
    email: String,
    role: String,
}

type CourseSelect = {
    courseId: number;
    courseCode: string;
    courseTitle: string;
    semesterId: number;
    programId: number;
    programeName: string;
    levelId: number;
};

type Course = {
    id: string;
    code: string;
    title: string;
    unit: number;
    isAllocated: boolean;
    allocatedTo?: string;
};

type AllocatedCourse = {
    code: string;
    title: string;
    unit: number;
    isAllocated: boolean;
    allocatedTo?: string;
};
  
type Level = {
    id: string;
    name: string;
    courses: Course[];
};
  
type Program = {
    id: string;
    name: string;
    levels: Level[];
};
  
type Semester = {
    id: string;
    name: string;
    programs: Program[];
};

type AllocationStat = {
  semesterName: string;
  programName: string;
  unallocatedCourses: number;
  allocatedCourses: number;
  allocationRate: number; // as a percentage
  status: string;
};

type OverallAllocationStat = {
  totalPrograms: number;
  unallocatedCourses: number;
  allocatedCourses: number;
  allocationRate: number; // as a percentage
};


export const AppWrapper = ({ children } : { children : ReactNode}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [allocatedCourses, setAllocatedCourses] = useState(0);
    const [departmentalLecturers, setDepartmentalLecturers] = useState(43);
    const [totalCourses, setTotalCourses] = useState(56);
    const [pageHeader, setPageHeader] = useState<string>("Dashboard");
    const [pageHeaderPeriod, setPageHeaderPeriod] = useState<string>("Summer 24/25.3");
    const [prevPath, setPrevPath] = useState<string>("/course-allocation");
    const [selectedCourse, setSelectedCourse] = useState<CourseSelect | null>(null);
    const [allocateCourse, setAllocateCourse] = useState<AllocatedCourse | null>(null);
    const [groups, setGroups] = useState([
      {
        id: 0,
        name: "Group A",
        lecturer: "",
        classSize: "",
      },
    ]);
    const [selectedBulletin, setSelectedBulletin] = useState<string>('');
    const [semesters, setSemesters] = useState<string[]>([]);
    const [programs, setPrograms] = useState<string[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [department, setDepartment] = useState<string | null>(null);
    const [logoutMenuOpen, setLogoutMenuOpen] = useState(false);

    useEffect(() => {
      const roleFromCookie = Cookies.get('role');
      const nameFromCookie = Cookies.get('name');
      const dept = Cookies.get('department') || 'Department';
      const mail = Cookies.get('email');
    
      if (roleFromCookie) setRole(roleFromCookie);
      if (nameFromCookie) setName(nameFromCookie);
      if (dept) setDepartment(dept);
      if (mail) setEmail(mail);
    }, []);


    const login = (name: string, role: string, department: string, email: string) => {
      console.log("Logging in", { name, role });
      // localStorage.setItem('access_token', token);
      Cookies.set('name', name, { path: '/' });
      Cookies.set('role', role, { path: '/' });
      Cookies.set('department', department, { path: '/' });
      Cookies.set('email', email, { path: '/' });
      setRole(role);
      setName(name);
      setEmail(email);
      setDepartment(department);
    };

    // const logout = () => {
    //   Cookies.remove('name');
    //   Cookies.remove('role');
    //   Cookies.remove('email');
    //   Cookies.remove('department');
    //   setEmail(null);
    //   setRole(null);
    //   setName(null);
    //   setDepartment(null);
    // };

    const computeAllocationProgress = (allocationData: Semester[]): AllocationStat[] => {
      const stats: AllocationStat[] = [];

      allocationData?.forEach((semester) => {
        semester.programs?.forEach((program) => {
          let totalCourses = 0;
          let allocatedCourses = 0;

          program.levels.forEach((level) => {
            level.courses.forEach((course) => {
              totalCourses += 1;
              if (course.isAllocated) {
                allocatedCourses += 1;
              }
            });
          });

          stats.push({
            semesterName: semester.name,
            programName: program.name,
            unallocatedCourses: totalCourses - allocatedCourses,
            allocatedCourses,
            allocationRate: totalCourses > 0 ? parseFloat(((allocatedCourses / totalCourses) * 100).toFixed(1)) : 0,
            status: (totalCourses - allocatedCourses) === 0 ? "Completed": (totalCourses - allocatedCourses) === totalCourses ? "Not Started": "In Progress"
          });
        });
      });

      return stats;
    };

    const overallAllocationProgress = (allocationData: Semester[]): OverallAllocationStat[] => {
      const stats: OverallAllocationStat[] = [];

      let totalCourses = 0;
      let allocatedCourses = 0;
      let totalPrograms = 0;

      allocationData?.forEach((semester) => {
        const sem1 = allocationData && allocationData.length > 0 ? allocationData[0].id : "";
        const sem2 = allocationData && allocationData.length > 0 ? allocationData[1].id : "";
        if(semester.id === sem1 || semester.id === sem2) {
          semester.programs.forEach((program) => {
            if(semester.id === sem2) {
              totalPrograms += 1;
            }
            
            program.levels.forEach((level) => {
              level.courses.forEach((course) => {
                totalCourses += 1;
                if (course.isAllocated) {
                  allocatedCourses += 1;
                }
              });
            });

            
          });
        }
      });

      stats.push({
        totalPrograms,
        unallocatedCourses: totalCourses - allocatedCourses,
        allocatedCourses,
        allocationRate: totalCourses > 0 ? parseFloat(((allocatedCourses / totalCourses) * 100).toFixed(1)) : 0,
      });

      return stats;
    };

    const isLevelFullyAllocated = (
      semesterId: string,
      programId: string,
      levelId: string,
      allocationData: any
    ): boolean => {
      const semester = allocationData.find((s:any) => s.id === semesterId);
      const program = semester?.programs.find((p:any) => p.id === programId);
      const level = program?.levels.find((l:any) => l.id === levelId);
      if (!level) return false;

      return level.courses.every((course:any) => course.isAllocated);
    }

    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };

    const toggleLogoutMenu = () => {
      setLogoutMenuOpen(!logoutMenuOpen);
    };

    const fetchSemesterData = async () => {
      const res = await fetch(`/api/allocation`);
      if (!res.ok) throw new Error('Network error');
      return res.json();
    };

    const fetchLecturers = async () => {
      const res = await fetch(`/api/lecturers`);
      if (!res.ok) throw new Error('Network error');
      return res.json();
    };

    const fetchSemesterDataDE = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_DE_ALLOCATION_API;
      if (!apiUrl) throw new Error('NEXT_PUBLIC_DE_ALLOCATION_API is not set');
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    };

    const fetchProgramSA = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_SA_COURSES_API;
      if (!apiUrl) throw new Error('NEXT_PUBLIC_PROGRAM_SA_API is not set');
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    };

    return (
        <AppContext.Provider
            value={{
                sidebarOpen,
                toggleSidebar,
                pageHeader, setPageHeader,
                pageHeaderPeriod, setPageHeaderPeriod,
                selectedCourse, setSelectedCourse,
                allocateCourse, setAllocateCourse,
                groups, setGroups, isLevelFullyAllocated, computeAllocationProgress,
                overallAllocationProgress, fetchSemesterData, fetchSemesterDataDE,
                prevPath, setPrevPath, selectedBulletin, setSelectedBulletin,
                programs, setPrograms, selectedProgram, setSelectedProgram, fetchProgramSA,
                semesters, setSemesters, selectedSemester, setSelectedSemester,
                username, setUsername, password, setPassword,
                token, role, login, fetchLecturers, department, email, name,
                logoutMenuOpen, toggleLogoutMenu
            }}
        >
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)