'use client'
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

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

interface Semester {
  id: string;
  name: string;
  programs: Program[];
}

// Mock fetching function - replace with actual API call
const fetchSemesterData = async (): Promise<Semester[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: "first",
      name: "First Semester",
      programs: [
        {
          id: "cs",
          name: "Computer Science",
          levels: [
            {
              id: "100",
              name: "100 Level",
              courses: [
                { id: "cs101", code: "CS101", title: "Introduction to Programming", unit: 3, isAllocated: true, allocatedTo: "Dr. Smith" },
                { id: "cs105", code: "CS105", title: "Discrete Mathematics", unit: 2, isAllocated: false },
              ]
            },
            {
              id: "200",
              name: "200 Level",
              courses: [
                { id: "cs201", code: "CS201", title: "Data Structures", unit: 3, isAllocated: true, allocatedTo: "Dr. Johnson" },
                { id: "cs205", code: "CS205", title: "Computer Architecture", unit: 3, isAllocated: false },
              ]
            }
          ]
        },
        {
          id: "se",
          name: "Software Engineering",
          levels: [
            {
              id: "100",
              name: "100 Level",
              courses: [
                { id: "se101", code: "SE101", title: "Introduction to Software Engineering", unit: 3, isAllocated: false },
                { id: "se105", code: "SE105", title: "Programming Fundamentals", unit: 3, isAllocated: true, allocatedTo: "Dr. Wilson" },
              ]
            },
            {
              id: "200",
              name: "200 Level",
              courses: [
                { id: "se201", code: "SE201", title: "Software Design", unit: 3, isAllocated: false },
                { id: "se205", code: "SE205", title: "Database Systems", unit: 3, isAllocated: true, allocatedTo: "Dr. Brown" },
              ]
            }
          ]
        }
      ]
    },
    {
      id: "second",
      name: "Second Semester",
      programs: [
        {
          id: "cs",
          name: "Computer Science",
          levels: [
            {
              id: "100",
              name: "100 Level",
              courses: [
                { id: "cs102", code: "CS102", title: "Object-Oriented Programming", unit: 3, isAllocated: true, allocatedTo: "Dr. Davis" },
                { id: "cs106", code: "CS106", title: "Introduction to Web Development", unit: 2, isAllocated: false },
              ]
            },
            {
              id: "200",
              name: "200 Level",
              courses: [
                { id: "cs202", code: "CS202", title: "Algorithms", unit: 3, isAllocated: false },
                { id: "cs206", code: "CS206", title: "Operating Systems", unit: 3, isAllocated: true, allocatedTo: "Dr. Taylor" },
              ]
            }
          ]
        },
        {
          id: "se",
          name: "Software Engineering",
          levels: [
            {
              id: "100",
              name: "100 Level",
              courses: [
                { id: "se102", code: "SE102", title: "Software Development Process", unit: 3, isAllocated: true, allocatedTo: "Dr. Miller" },
                { id: "se106", code: "SE106", title: "Web Programming", unit: 3, isAllocated: false },
              ]
            }
          ]
        }
      ]
    },
    {
      id: "summer",
      name: "Summer Semester",
      programs: [
        {
          id: "cs",
          name: "Computer Science",
          levels: [
            {
              id: "200",
              name: "200 Level",
              courses: [
                { id: "cs299", code: "CS299", title: "Summer Project", unit: 4, isAllocated: false },
              ]
            }
          ]
        }
      ]
    }
  ];
};

export default function CourseAllocationPage() {
  const [activeSemester, setActiveSemester] = useState<string>("first");
  const [activeProgramMap, setActiveProgramMap] = useState<Record<string, string>>({});
  
  const { data: semesters, isLoading, error } = useQuery({
    queryKey: ['semesters'],
    queryFn: fetchSemesterData
  });

  // Set default active program for each semester when data is loaded
  useEffect(() => {
    if (semesters) {
      const defaultProgramMap: Record<string, string> = {};
      semesters.forEach(semester => {
        if (semester.programs.length > 0) {
          defaultProgramMap[semester.id] = semester.programs[0].id;
        }
      });
      setActiveProgramMap(defaultProgramMap);
    }
  }, [semesters]);

  const handleSemesterChange = (semesterId: string) => {
    setActiveSemester(semesterId);
  };

  const handleProgramChange = (semesterId: string, programId: string) => {
    setActiveProgramMap(prev => ({
      ...prev,
      [semesterId]: programId
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading course allocation data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load course allocation data</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try again later or contact support.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Course Allocation System</h1>
      <p className="text-muted-foreground mb-8">
        Allocate courses to lecturers for different programs and levels across semesters
      </p>

      {/* First layer: Semester Tabs */}
      <Tabs defaultValue={activeSemester} onValueChange={handleSemesterChange} className="w-full">
        <TabsList className="w-full mb-6 justify-start">
          {semesters?.map((semester) => (
            <TabsTrigger key={semester.id} value={semester.id} className="text-base">
              {semester.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Semester Content */}
        {semesters?.map((semester) => (
          <TabsContent key={semester.id} value={semester.id} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{semester.name}</CardTitle>
                <CardDescription>
                  Manage course allocations for all programs in {semester.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* No programs message */}
                {semester.programs.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No programs available for this semester
                  </div>
                ) : (
                  /* Second layer: Program Tabs */
                  <Tabs 
                    defaultValue={activeProgramMap[semester.id] || semester.programs[0]?.id} 
                    onValueChange={(value) => handleProgramChange(semester.id, value)}
                  >
                    <TabsList className="mb-4">
                      {semester.programs.map((program) => (
                        <TabsTrigger key={program.id} value={program.id}>
                          {program.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {/* Program Content */}
                    {semester.programs.map((program) => (
                      <TabsContent key={program.id} value={program.id} className="space-y-4">
                        {/* No levels message */}
                        {program.levels.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No levels available for this program
                          </div>
                        ) : (
                          /* Third layer: Level Tabs */
                          <Tabs defaultValue={program.levels[0]?.id}>
                            <TabsList>
                              {program.levels.map((level) => (
                                <TabsTrigger key={level.id} value={level.id}>
                                  {level.name}
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {/* Level Content - Course Table */}
                            {program.levels.map((level) => (
                              <TabsContent key={level.id} value={level.id}>
                                {level.courses.length === 0 ? (
                                  <div className="p-4 text-center text-muted-foreground">
                                    No courses available for this level
                                  </div>
                                ) : (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Course Code</TableHead>
                                        <TableHead>Course Title</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Allocated To</TableHead>
                                        <TableHead>Action</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {level.courses.map((course) => (
                                        <TableRow key={course.id}>
                                          <TableCell className="font-medium">{course.code}</TableCell>
                                          <TableCell>{course.title}</TableCell>
                                          <TableCell>{course.unit}</TableCell>
                                          <TableCell>{course.allocatedTo || "-"}</TableCell>
                                          <TableCell>
                                            <Badge variant={course.isAllocated ? "default" : "outline"}>
                                              {course.isAllocated ? "Allocated" : "Allocate Lecturer"}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                )}
                              </TabsContent>
                            ))}
                          </Tabs>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};