"use client"

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react'
// import axios from 'axios'


const AppContext = createContext<any>(undefined);

export type roleT = {
    email: String,
    role: String,
}

type CourseSelect = {
    courseId: string;
    courseCode: string;
    courseTitle: string;
    semesterId: string;
    programId: string;
    programeName: string;
    levelId: string;
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
        classHours: "",
      },
    ]);
    const [selectedBulletin, setSelectedBulletin] = useState<string>('');
    const [semesters, setSemesters] = useState<string[]>([]);
    const [programs, setPrograms] = useState<string[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

    const computeAllocationProgress = (allocationData: Semester[]): AllocationStat[] => {
      const stats: AllocationStat[] = [];

      allocationData?.forEach((semester) => {
        semester.programs.forEach((program) => {
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
            semesterName: semester.id,
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
        if(semester.id === "first" || semester.id === "second") {
          semester.programs.forEach((program) => {
            if(semester.id === "first") {
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



    const updateCourse = (
        data: Semester[],
        {
          semesterId,
          programId,
          levelId,
          courseId,
          updates,
        }: {
          semesterId: string;
          programId: string;
          levelId: string;
          courseId: string;
          updates: Partial<Course>;
        }
      ): Semester[] => {
        return data.map((semester) =>
          semester.id === semesterId
            ? {
                ...semester,
                programs: semester.programs.map((program) =>
                  program.id === programId
                    ? {
                        ...program,
                        levels: program.levels.map((level) =>
                          level.id === levelId
                            ? {
                                ...level,
                                courses: level.courses.map((course) =>
                                  course.id === courseId
                                    ? { ...course, ...updates }
                                    : course
                                ),
                              }
                            : level
                        ),
                      }
                    : program
                ),
              }
            : semester
        );
    }


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
      };

    const fetchSemesterData = async () => {
      const res = await fetch('https://mocki.io/v1/3e18188b-b1e1-403e-8e63-b2a5132cab79');
      if (!res.ok) throw new Error('Network error');
      return res.json();
    };

    const fetchSemesterDataDE = async () => {
      const res = await fetch('https://mocki.io/v1/0ccbb67f-a0fd-456d-bb69-d3b67b882bc6');
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    };

    const fetchProgramSA = async () => {
      const res = await fetch('https://mocki.io/v1/978433f4-ff36-4321-b79f-560f10b5ab81');
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
                updateCourse, allocateCourse, setAllocateCourse,
                groups, setGroups, isLevelFullyAllocated, computeAllocationProgress,
                overallAllocationProgress, fetchSemesterData, fetchSemesterDataDE,
                prevPath, setPrevPath, selectedBulletin, setSelectedBulletin,
                programs, setPrograms, selectedProgram, setSelectedProgram, fetchProgramSA,
                semesters, setSemesters, selectedSemester, setSelectedSemester
            }}
        >
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)