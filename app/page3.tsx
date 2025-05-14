'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// Types
type Course = {
  id: string
  code: string
  title: string
  unit: number
  allocated: boolean
  lecturer?: string
}

type Level = {
  id: string
  name: string
  courses: Course[]
}

type Program = {
  id: string
  name: string
  levels: Level[]
}

type Semester = {
  id: string
  name: string
  programs: Program[]
}

export default function CourseAllocationPage() {
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLecturer, setSelectedLecturer] = useState<Record<string, string>>({})

  // Mock data fetch - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data structure
        const mockData: Semester[] = [
          {
            id: 'first',
            name: 'First Semester',
            programs: [
              {
                id: 'cs',
                name: 'Computer Science',
                levels: [
                  {
                    id: '100',
                    name: '100 Level',
                    courses: [
                      { id: 'cs101', code: 'CS101', title: 'Introduction to Computing', unit: 3, allocated: false },
                      { id: 'cs102', code: 'CS102', title: 'Programming Fundamentals', unit: 3, allocated: true, lecturer: 'Dr. Smith' },
                    ]
                  },
                  {
                    id: '200',
                    name: '200 Level',
                    courses: [
                      { id: 'cs201', code: 'CS201', title: 'Data Structures', unit: 3, allocated: false },
                      { id: 'cs202', code: 'CS202', title: 'Algorithms', unit: 3, allocated: false },
                    ]
                  }
                ]
              },
              {
                id: 'se',
                name: 'Software Engineering',
                levels: [
                  {
                    id: '100',
                    name: '100 Level',
                    courses: [
                      { id: 'se101', code: 'SE101', title: 'Intro to SE', unit: 2, allocated: false },
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'second',
            name: 'Second Semester',
            programs: [] // Empty for demonstration
          },
          {
            id: 'summer',
            name: 'Summer Semester',
            programs: [] // Empty for demonstration
          }
        ]

        setSemesters(mockData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAllocate = (courseId: string) => {
    // In a real app, this would open a modal or dialog to select lecturer
    // For demo, we'll just simulate allocation
    setSelectedLecturer(prev => ({
      ...prev,
      [courseId]: `Lecturer ${Math.floor(Math.random() * 10) + 1}`
    }))
    
    // Update the courses data
    setSemesters(prev => prev.map(semester => ({
      ...semester,
      programs: semester.programs.map(program => ({
        ...program,
        levels: program.levels.map(level => ({
          ...level,
          courses: level.courses.map(course => 
            course.id === courseId 
              ? { ...course, allocated: true, lecturer: `Lecturer ${Math.floor(Math.random() * 10) + 1}` } 
              : course
          )
        }))
      }))
    })))
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-[200px] mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Course Allocation</h1>
      
      <Tabs defaultValue="first" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {semesters.map(semester => (
            <TabsTrigger key={semester.id} value={semester.id}>
              {semester.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {semesters.map(semester => (
          <TabsContent key={semester.id} value={semester.id}>
            {semester.programs.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No programs available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No programs found for this semester.</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue={semester.programs[0].id} className="w-full mt-4">
                <TabsList>
                  {semester.programs.map(program => (
                    <TabsTrigger key={program.id} value={program.id}>
                      {program.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {semester.programs.map(program => (
                  <TabsContent key={program.id} value={program.id} className="mt-4">
                    {program.levels.length === 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>No levels available</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">No levels found for this program.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <Tabs defaultValue={program.levels[0].id} className="w-full">
                        <TabsList>
                          {program.levels.map(level => (
                            <TabsTrigger key={level.id} value={level.id}>
                              {level.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {program.levels.map(level => (
                          <TabsContent key={level.id} value={level.id} className="mt-4">
                            <Card>
                              <CardHeader>
                                <CardTitle>{program.name} - {level.name} Courses</CardTitle>
                              </CardHeader>
                              <CardContent>
                                {level.courses.length === 0 ? (
                                  <p className="text-muted-foreground">No courses found for this level.</p>
                                ) : (
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Course Code</TableHead>
                                        <TableHead>Course Title</TableHead>
                                        <TableHead>Unit</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Lecturer</TableHead>
                                        <TableHead>Action</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {level.courses.map(course => (
                                        <TableRow key={course.id}>
                                          <TableCell>{course.code}</TableCell>
                                          <TableCell>{course.title}</TableCell>
                                          <TableCell>{course.unit}</TableCell>
                                          <TableCell>
                                            {course.allocated ? (
                                              <span className="text-green-600">Allocated</span>
                                            ) : (
                                              <span className="text-orange-600">Pending</span>
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {course.allocated ? course.lecturer : '-'}
                                          </TableCell>
                                          <TableCell>
                                            {!course.allocated ? (
                                              <Button 
                                                size="sm" 
                                                onClick={() => handleAllocate(course.id)}
                                              >
                                                Allocate
                                              </Button>
                                            ) : (
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleAllocate(course.id)}
                                              >
                                                Reallocate
                                              </Button>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                )}
                              </CardContent>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}