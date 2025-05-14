// app/course-allocation/page.js
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  Users,
  Blocks,
  BookOpen,
  MessageSquare,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  User
} from "lucide-react";

export default function CourseAllocationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("Computer Science");
  const [selectedLevel, setSelectedLevel] = useState("100L");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Programs data
  const programs = ["Computer Science", "Computer Technology", "Computer Information System"];
  
  // Levels data
  const levels = ["100L", "200L", "300L", "400L"];
  
  // Course data
  const courses = [
    { sn: 1, code: "GEDS 280", title: "Leadership Skills", units: 3, level: "100", status: "Allocated" },
    { sn: 2, code: "GEDS 002", title: "Citizenship Orientation", units: 2, level: "100", status: "Allocate Lecturer" },
    { sn: 3, code: "GEDS 312", title: "Introduction to Family Life Education", units: 3, level: "100", status: "Allocate Lecturer" },
    { sn: 4, code: "COSC 302", title: "Algorithms and Data Structures", units: 3, level: "100", status: "Allocate Lecturer" },
    { sn: 5, code: "COSC 105", title: "Students Industrial Work Experience SIWES", units: 3, level: "100", status: "Allocate Lecturer" },
    { sn: 6, code: "COSC 105", title: "Students Industrial Work Experience SIWES", units: 3, level: "100", status: "Allocate Lecturer" },
    { sn: 7, code: "COSC 105", title: "Internet Technologies and Web Application Development", units: 2, level: "100", status: "Allocate Lecturer" },
    { sn: 8, code: "COSC 105", title: "Students Industrial Work Experience SIWES", units: 1, level: "100", status: "Allocate Lecturer" },
    { sn: 9, code: "COSC 105", title: "Internet Technologies and Web Application Development", units: 2, level: "100", status: "Allocate Lecturer" },
    { sn: 10, code: "COSC 105 Group A", title: "Internet Technologies and Web Application Development", units: 2, level: "100", status: "Allocate Lecturer" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Blocks className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-medium">Course Allocation App</h2>
            <p className="text-xs text-gray-500">Academic Planning</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        fixed md:static z-50 w-64 h-full bg-white border-r border-gray-200 flex flex-col
      `}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Blocks className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-medium">Course Allocation App</h2>
              <p className="text-xs text-gray-500">Academic Planning</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="py-4 flex-grow overflow-y-auto">
          <p className="px-4 text-xs font-medium text-gray-500 mb-2">NAV</p>
          <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100">
            <Blocks className="w-4 h-4 mr-2" />
            <span>Dashboard</span>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            <span>Course Allocation</span>
          </div>
          <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100">
            <User className="w-4 h-4 mr-2" />
            <span>DE Allocation</span>
          </div>
          <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100">
            <Users className="w-4 h-4 mr-2" />
            <span>Special Allocation</span>
          </div>
          <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100">
            <MessageSquare className="w-4 h-4 mr-2" />
            <span>Support and Requests</span>
          </div>
          
          <p className="px-4 text-xs font-medium text-gray-500 mt-4 mb-2">OTHER</p>
          <div className="px-4 py-2 flex items-center text-gray-700 hover:bg-gray-100">
            <Users className="w-4 h-4 mr-2" />
            <span>Lecturers</span>
          </div>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 text-gray-500 mr-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">Need support?</p>
              <p className="text-xs text-gray-500">Contact with one of our experts to get support.</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center">
            <span className="text-xs">SE</span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="text-sm font-medium flex items-center gap-1">
              Seun Ebiesuwa
              <Badge className="bg-blue-100 text-blue-600 h-4 w-4 p-0 rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </Badge>
            </div>
            <p className="text-xs text-gray-500 truncate">Ebiesuwas@babcock.edu.ng</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-4 md:px-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">Course Allocation</h1>
            <p className="text-sm text-gray-500">First Semester 24/25.1</p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Badge className="bg-green-100 text-green-600 py-1 px-2 md:px-3 text-xs md:text-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Allocation Open
            </Badge>
          </div>
        </header>
        
        {/* Main Content Area */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {/* Program Tabs */}
          <Tabs 
            value={selectedProgram} 
            className="mb-6"
            onValueChange={setSelectedProgram}
          >
            <TabsList className="bg-gray-100 border border-gray-200 rounded-md overflow-x-auto flex gap-3 justify-start md:h-[50px] w-full md:w-auto whitespace-nowrap">
              {programs.map(program => (
                <TabsTrigger 
                  key={program} 
                  value={program}
                  className={`px-4 py-2 text-sm ${selectedProgram === program ? 'bg-blue-600 text-white' : ''}`}
                >
                  {program}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Dynamic Tab Content for Programs */}
            {programs.map(program => (
              <TabsContent key={program} value={program} className="mt-4">
                {/* Level Tabs */}
                <Tabs 
                  defaultValue="100L" 
                  className="mb-6"
                  onValueChange={setSelectedLevel}
                >
                  <div className="flex justify-between items-center mb-4">
                    <TabsList className="bg-gray-100 border border-gray-200 rounded-2xl md:h-[50px] overflow-x-auto flex gap-4 whitespace-nowrap">
                      {levels.map(level => (
                        <TabsTrigger 
                          key={level} 
                          value={level}
                          className="px-4 py-2 text-sm w-20"
                        >
                          {level}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <Button className="hidden md:block">Submit allocations</Button>
                  </div>
                  
                  {/* Course Table - This will be shown for each level tab */}
                  {levels.map(level => (
                    <TabsContent key={level} value={level}>
                      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="border-b border-gray-200 text-gray-600 text-sm">
                                <th className="py-3 px-4 text-left font-medium">SN</th>
                                <th className="py-3 px-4 text-left font-medium">Course code</th>
                                <th className="py-3 px-4 text-left font-medium">Course Title</th>
                                <th className="py-3 px-4 text-left font-medium">Units</th>
                                <th className="py-3 px-4 text-left font-medium">Level</th>
                                <th className="py-3 px-4 text-left font-medium">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {courses.map(course => (
                                <tr key={course.sn} className="border-b border-gray-100 last:border-0">
                                  <td className="py-3 px-4 text-sm">{course.sn}</td>
                                  <td className="py-3 px-4 text-sm">{course.code}</td>
                                  <td className="py-3 px-4 text-sm">{course.title}</td>
                                  <td className="py-3 px-4 text-sm">{course.units}</td>
                                  <td className="py-3 px-4 text-sm">{course.level}</td>
                                  <td className="py-3 px-4 text-sm">
                                    {course.status === "Allocated" ? (
                                      <span className="text-green-600">Allocated</span>
                                    ) : (
                                      <Button 
                                        variant="ghost" 
                                        className="text-blue-600 p-0 h-auto hover:bg-transparent hover:text-blue-800 hover:underline"
                                      >
                                        Allocate Lecturer
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Mobile Submit Button */}
                      <div className="mt-4 md:hidden">
                        <Button className="w-full">Submit allocations</Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
}