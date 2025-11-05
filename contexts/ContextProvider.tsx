"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import Cookies from 'js-cookie';
import { apiFetch } from '@/lib/api-client';


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

export type Academic_Session = {
  id: number;
  name: string;
  is_active: boolean;
};

export type Bulletin = {
  id: number;
  name: string;
  start_year: number;
  end_year: number;
};

export type SemesterType = {
  id: number;
  name: string;
};

export type SchoolType = {
  id: number;
  name: string;
  acronym: string;
};

export type SchoolTypes = {
  id: number;
  name: string;
};

export type DepartmentType = {
  id: number;
  name: string;
  acronym: string;
};

export type CourseTypeType = {
  id: number;
  name: string;
};

export type LevelType = {
  id: number;
  name: string;
};

type VetDepartment = {
  department_id: number;
  semester_id: number;
};


export const AppWrapper = ({ children } : { children : ReactNode}) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [allocatedCourses, setAllocatedCourses] = useState(0);
    const [departmentalLecturers, setDepartmentalLecturers] = useState(43);
    const [totalCourses, setTotalCourses] = useState(56);
    const [pageHeader, setPageHeader] = useState<string>("Manage Course Allocation");
    const [pageHeaderPeriod, setPageHeaderPeriod] = useState<string>("");
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
    const [sessionData, setSessionData] = useState<Academic_Session | null>(null);
    const [semesterData, setSemesterData] = useState<SemesterType | null>(null);
    const [schoolData, setSchoolData] = useState<SchoolType | null>(null);
    const [bulletinData, setBulletinData] = useState<Bulletin | null>(null);
    const [levelData, setLevelData] = useState<LevelType | null>(null);
    const [vetDepIDs, setVetDepIDs] = useState<VetDepartment | null>(null);
    const [viewDepIDs, setViewDepIDs] = useState<VetDepartment | null>(null);
    

    useEffect(() => {
      const roleFromCookie = Cookies.get('role')?.toLowerCase();
      const nameFromCookie = Cookies.get('name');
      const dept = Cookies.get('department') || 'Department';
      const mail = Cookies.get('email');
    
      if (roleFromCookie) setRole(roleFromCookie);
      if (nameFromCookie) setName(nameFromCookie);
      if (dept) setDepartment(dept);
      if (mail) setEmail(mail);
    }, []);


    const login = (name: string, role: string, department: string, email: string) => {
      
      // localStorage.setItem('access_token', token);
      // Cookies.set('name', name, { path: '/' });
      // Cookies.set('role', role, { path: '/' });
      // Cookies.set('department', department, { path: '/' });
      // Cookies.set('email', email, { path: '/' });
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
          semester.programs?.forEach((program) => {
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
      const data = await apiFetch(`/api/allocation`);
      return data;
    };

    const fetchSemesterDataPrint = async (department_id: string) => {
      try {
        const selectedDepartment = {
          department_id: department_id,
        }
        const data = await apiFetch('/api/allocation/print', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedDepartment),
        });
         
        return data
      } catch (error) {
          console.error('Failed to fetch departments data:', error);
      }

      // const data = await apiFetch(`/api/allocation`);
      // return data;
    };

    const fetchLecturers = async () => {
      const data = await apiFetch(`/api/lecturers`);
      return data;
    };

    const fetchAllLecturers = async () => {
      const data = await apiFetch(`/api/lecturers/all`);
      return data;
    };

    const fetchSemesterDataDE = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_DE_ALLOCATION_API;
      if (!apiUrl) throw new Error('NEXT_PUBLIC_DE_ALLOCATION_API is not set');
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    };

    // const fetchProgramSA = async () => {
    //   const apiUrl = process.env.NEXT_PUBLIC_SA_COURSES_API;
    //   if (!apiUrl) throw new Error('NEXT_PUBLIC_PROGRAM_SA_API is not set');
    //   const res = await fetch(apiUrl);
    //   if (!res.ok) throw new Error('Network error');
    //   return await res.json();
    // };

    const fetchSemesters = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/semester');
          setSemesterData(data); // Update state with fetched data
          return data
      } catch (error) {
          console.error('Failed to fetch semesters:', error);
      }
    };

    const fetchLevels = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/level');
          setLevelData(data);
          return data
      } catch (error) {
          console.error('Failed to fetch levels:', error);
      }
    };

    const fetchSchools = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/school');
          setSchoolData(data.schools); // Update state with fetched data
          return data
      } catch (error) {
          console.error('Failed to fetch schools:', error);
      }
    };

    const [schoolNameData, setSchoolNameData] = useState<SchoolTypes | null>(null);

    // Fetch school names for the combobox
    const fetchSchoolName = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/school/names');
          setSchoolNameData(data.schools); // Update state with fetched data
          return data.schools
      } catch (error) {
          console.error('Failed to fetch schools:', error);
      }
    };

    const fetchSchoolNameAdmin = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/school/names/admin');
          return data.schools
      } catch (error) {
          console.error('Failed to fetch schools:', error);
      }
    };

    const [departmentData, setDepartmentData] = useState<DepartmentType | null>(null);
    const [programData, setProgramData] = useState<DepartmentType | null>(null);
    const [specializationData, setSpecializationData] = useState<DepartmentType | null>(null);

    const fetchDepartments = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/department');
          setDepartmentData(data.departments); 
          return data.departments
      } catch (error) {
          console.error('Failed to fetch departments:', error);
      }
    };

    const fetchAdminDepartments = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/department/admin');
          setDepartmentData(data.departments); 
          return data.departments
      } catch (error) {
          console.error('Failed to fetch departments:', error);
      }
    };


    const [showDeptCombo, setShowDeptCombo] = useState(false);
    const [showProgCombo, setShowProgCombo] = useState(false);
    
    // Fetch department names for the combobox
    const fetchDepartmentName = async () => {
      try {
      
        const data = await apiFetch('/api/manage-uploads/department/names');
        
        return data.departments
      } catch (error) {
          console.error('Failed to fetch departments:', error);
      }
    };

    const fetchDepartmentNameBySchool = async (school: string) => {
      try {
        const selectedSchool = {
          school_id: school,
        }
        const data = await apiFetch('/api/manage-uploads/department/names', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedSchool),
        });
        setShowDeptCombo(true); 
        return data.departments
      } catch (error) {
          console.error('Failed to fetch departments:', error);
      }
    };

    const fetchPrograms = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/program');
          setProgramData(data.programs); 
          return data.programs
      } catch (error) {
          console.error('Failed to fetch programs:', error);
      }
    };

    const fetchProgramSA = async (department: string) => {
      try {
        const selectedDept = {
          department: department,
        }

        const data = await apiFetch('/api/special-allocation/program', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedDept)
        });
           
          return data.programs
      } catch (error) {
          console.error('Failed to fetch programs:', error);
      }
    };

    const fetchCourseSA = async (bulletin: string, program: string, semester: string) => {
      try {
        const bullParams = {
          bulletin: bulletin,
          program: program,
          semester: semester,
        }
        const data = await apiFetch('/api/special-allocation/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bullParams),
        });
        return data.levels
      } catch (error) {
        console.error('Failed to fetch special allocation courses:', error);
        throw error;
      }
    };

    const fetchDepAllocations = async (department: string, semester: string) => {
      try {
        const bullParams = {
          department: department,
          semester: semester,
        }
        const data = await apiFetch('/api/allocation/get-by-department', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bullParams),
        });
        return data
      } catch (error) {
        console.error('Failed to fetch special allocation courses:', error);
        throw error;
      }
    };

    const fetchDepCourses = async (department: string, semester: string) => {
      try {
        const courseParams = {
          department: department,
          semester: semester,
        }
        const data = await apiFetch('/api/manage-uploads/course/vet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseParams),
        });
        return data
      } catch (error) {
        console.error('Failed to fetch departments courses:', error);
        throw error;
      }
    };

    const fetchAllocationStatus = async (semester: string) => {
      try {
        // const semester_data = {
        //   semester: semester,
        // }
        const data = await apiFetch(`/api/allocation/status?semesterId=${semester}`);
        
        return data
      } catch (error) {
        console.error('Failed to fetch special allocation courses:', error);
        throw error;
      }
    };

    const fetchSpecializations = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/specialization');
          
          setSpecializationData(data.specializations); 
          return data
      } catch (error) {
          console.error('Failed to fetch specializations:', error);
      }
    };

    const [courseTypeData, setCourseTypeData] = useState<CourseTypeType | null>(null);

    const fetchCourseTypes = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/course-type');
          
          setCourseTypeData(data); 
          return data
      } catch (error) {
          console.error('Failed to fetch course types:', error);
      }
    };

    const fetchProgramName = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/program/names');
          
          // setProgramData(data.programs); 
          return data.programs
      } catch (error) {
          console.error('Failed to fetch programs:', error);
      }
    };

    const fetchSpecializationName = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/specialization/names');
          
          return data.specializations
      } catch (error) {
          console.error('Failed to fetch specializations:', error);
      }
    };

    const fetchProgramNameByDepartment = async (department: string) => {
      try {
        const selectedDept = {
          department_id: department,
        }
        const data = await apiFetch('/api/manage-uploads/program/names', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedDept)
        });
        
        setShowProgCombo(true); 
        return data.programs
      } catch (error) {
          console.error('Failed to fetch programs:', error);
      }
    };

    const [showSpecCombo, setShowSpecCombo] = useState(false);

    const fetchSpecializationNameByProgram = async (program: string) => {
      try {
        const selectedProg = {
          program_id: program,
        }
        const data = await apiFetch('/api/manage-uploads/specialization/names', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedProg)
        });
        
        setShowSpecCombo(true); 
        return data.specializations
      } catch (error) {
          console.error('Failed to fetch specializations:', error);
      }
    };

    const fetchBulletinName = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/bulletin/names');
          
          return data.bulletins
      } catch (error) {
          console.error('Failed to fetch bulletins:', error);
      }
    };

    const fetchSessionName = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/session/names');
          
          // setProgramData(data.programs); 
          return data.programs
      } catch (error) {
          console.error('Failed to fetch programs:', error);
      }
    };

    const fetchCourses = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/course');
          
          return data
      } catch (error) {
          console.error('Failed to fetch courses:', error);
      }
    };

    const fetchUsers = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/user');
          
          return data
      } catch (error) {
          console.error('Failed to fetch users:', error);
      }
    };

    const [isUploading, setIsUploading] = useState(false);
    
    const [selectedOption, setSelectedOption] = React.useState(null);

    const fetchAdminUsers = async () => {
      try {
          const data = await apiFetch('/api/admin/users');
          
          return data
      } catch (error) {
          console.error('Failed to fetch admin users:', error);
      }
    };

    const fetchAllocatationStatusOverview = async () => {
      try {
          const data = await apiFetch('/api/allocation/status/overview');
          
          return data
      } catch (error) {
          console.error('Failed to fetch allocation status overview:', error);
      }
    };

    const fetchDepartmentsForCourses = async () => {
      try {
          const data = await apiFetch('/api/manage-uploads/department/hods');
          
          return data
      } catch (error) {
          console.error('Failed to fetch allocation status overview:', error);
      }
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
                programs, setPrograms, selectedProgram, setSelectedProgram, fetchProgramSA, fetchCourseSA,
                semesters, setSemesters, selectedSemester, setSelectedSemester,
                username, setUsername, password, setPassword,
                token, role, login, fetchLecturers, department, email, name,
                logoutMenuOpen, toggleLogoutMenu, sessionData, setSessionData,
                semesterData, setSemesterData, fetchSemesters, bulletinData, setBulletinData,
                fetchSchools, schoolData, setSchoolData, isUploading, setIsUploading,
                departmentData, setDepartmentData, fetchDepartments, schoolNameData, fetchSchoolName,
                selectedOption, setSelectedOption, programData, fetchPrograms, fetchDepartmentName,
                fetchProgramName, showDeptCombo, fetchDepartmentNameBySchool, fetchBulletinName, showProgCombo,
                fetchProgramNameByDepartment, fetchLevels, specializationData, fetchSpecializations, 
                                fetchSpecializationName, fetchSpecializationNameByProgram, showSpecCombo, fetchCourses,
                fetchUsers, fetchAdminUsers, fetchSchoolNameAdmin, fetchAdminDepartments,
                courseTypeData, fetchCourseTypes, levelData, fetchAllocationStatus, fetchAllocatationStatusOverview,
                setVetDepIDs, vetDepIDs, fetchDepAllocations, fetchDepartmentsForCourses, viewDepIDs, setViewDepIDs,
                fetchDepCourses, fetchAllLecturers, fetchSemesterDataPrint
            }}
        >
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)