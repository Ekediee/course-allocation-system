// File structure:
// app/page.tsx - Main page component
// components/ui/* - shadcn components
// components/course-allocation/* - Custom components for the app

// app/page.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Bell, User, LayoutDashboard, Users, FileText, MessageSquare, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CourseAllocationApp() {
  const [programTab, setProgramTab] = useState("computerScience");
  const [semesterTab, setSemesterTab] = useState("firstSemester");
  const [levelTab, setLevelTab] = useState("100L");

  const courseData = [
    { sn: 1, code: "GEDS 280", title: "Leadership Skills", units: 3, level: 100 },
    { sn: 2, code: "GEDS 002", title: "Citizenship Orientation", units: 2, level: 100 },
    { sn: 3, code: "GEDS 312", title: "Introduction to Family Life Education", units: 3, level: 100 },
    { sn: 4, code: "COSC 302", title: "Algorithms and Data Structures", units: 3, level: 100 },
    { sn: 5, code: "COSC 105", title: "Students Industrial Work Experience SIWES", units: 3, level: 100 },
    { sn: 6, code: "COSC 105", title: "Students Industrial Work Experience SIWES", units: 3, level: 100 },
    { sn: 7, code: "COSC 105", title: "Internet Technologies and Web Application Development", units: 2, level: 100 },
    { sn: 8, code: "COSC 105", title: "Students Industrial Work Experience SIWES", units: 1, level: 100 },
    { sn: 9, code: "COSC 105", title: "Internet Technologies and Web Application Development", units: 2, level: 100 },
    { sn: 10, code: "COSC 105 Group A", title: "Internet Technologies and Web Application Development", units: 2, level: 100 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <div className="font-medium">Course Allocation App</div>
            <div className="text-sm text-gray-500">Academic Planning</div>
          </div>
        </div>
        
        <div className="p-4 text-sm text-gray-500">NAV</div>
        
        <nav className="space-y-1 px-3">
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
            <LayoutDashboard className="h-5 w-5 mr-3 text-gray-500" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md bg-blue-700 text-white">
            <FileText className="h-5 w-5 mr-3 text-white" />
            Course Allocation
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            DE Allocation
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            Special Allocation
          </a>
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
            <MessageSquare className="h-5 w-5 mr-3 text-gray-500" />
            Support and Requests
          </a>
        </nav>
        
        <div className="p-4 text-sm text-gray-500 mt-4">OTHER</div>
        
        <nav className="space-y-1 px-3">
          <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100">
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            Lecturers
          </a>
        </nav>
        
        <div className="absolute bottom-0 w-full border-t border-gray-200">
          <div className="p-4">
            <div className="bg-gray-100 p-3 rounded-lg relative">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <span className="ml-2 text-sm font-medium">Need support?</span>
                <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">×</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Contact with one of our experts to get support.</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 border-t border-gray-200">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <span className="font-medium">Seun Ebiesuwa</span>
                <span className="ml-1 text-blue-500">✓</span>
              </div>
              <div className="text-xs text-gray-500">Ebiesuwas@babcock...</div>
            </div>
            <ChevronRight className="h-5 w-5 ml-auto text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <div>
              <h1 className="text-xl font-medium">Course Allocation</h1>
              <p className="text-sm text-gray-500">First Semester 24/25.1</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden md:flex items-center">
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                  Allocation Open
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Semester tabs */}
          <Tabs defaultValue="firstSemester" value={semesterTab} onValueChange={setSemesterTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 p-0">
              <TabsTrigger 
                value="firstSemester" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
              >
                First Semester
              </TabsTrigger>
              <TabsTrigger 
                value="secondSemester" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
              >
                Second Semester
              </TabsTrigger>
              <TabsTrigger 
                value="summerSemester" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6"
              >
                Summer Semester
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </header>
        
        {/* Program tabs */}
        <div className="p-4">
          <Tabs defaultValue="computerScience" value={programTab} onValueChange={setProgramTab} className="w-full">
            <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
              <TabsTrigger value="computerScience" className="bg-white data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                Computer Science
              </TabsTrigger>
              <TabsTrigger value="computerTechnology" className="bg-white data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                Computer Technology
              </TabsTrigger>
              <TabsTrigger value="computerInformationSystem" className="bg-white data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                Computer Information System
              </TabsTrigger>
            </TabsList>
            
            {/* Level tabs and course table */}
            <div className="bg-white shadow rounded-lg p-6">
              <Tabs defaultValue="100L" value={levelTab} onValueChange={setLevelTab} className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                  <TabsTrigger value="100L" className="bg-gray-100 data-[state=active]:bg-white">
                    100L
                  </TabsTrigger>
                  <TabsTrigger value="200L" className="bg-gray-100 data-[state=active]:bg-white">
                    200L
                  </TabsTrigger>
                  <TabsTrigger value="300L" className="bg-gray-100 data-[state=active]:bg-white">
                    300L
                  </TabsTrigger>
                  <TabsTrigger value="400L" className="bg-gray-100 data-[state=active]:bg-white">
                    400L
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex justify-between mb-4">
                  <div></div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="text-gray-500">Print</Button>
                    <Button variant="outline" className="text-gray-500">Submit allocations</Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">SN</TableHead>
                        <TableHead>Course code</TableHead>
                        <TableHead>Course Title</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseData.map((course) => (
                        <TableRow key={course.sn}>
                          <TableCell>{course.sn}</TableCell>
                          <TableCell>{course.code}</TableCell>
                          <TableCell>{course.title}</TableCell>
                          <TableCell>{course.units}</TableCell>
                          <TableCell>{course.level}</TableCell>
                          <TableCell>
                            <Button variant="link" className="text-blue-600 p-0">
                              Allocate Lecturer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Tabs>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 md:hidden">
        <button className="flex flex-col items-center justify-center p-2">
          <LayoutDashboard className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-500 mt-1">Dashboard</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2 text-blue-600">
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">Courses</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-500 mt-1">Allocations</span>
        </button>
        <button className="flex flex-col items-center justify-center p-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <span className="text-xs text-gray-500 mt-1">Support</span>
        </button>
      </div>
    </div>
  );
}