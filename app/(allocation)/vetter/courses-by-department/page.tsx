'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import DonutChart from '@/components/DonutChart';
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight, Hourglass, Router, Search } from 'lucide-react';
import AllocationPercentage from '@/components/Vetter/AllocationPercentage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useTable } from '@/lib/useTable';
import { useAppContext } from "@/contexts/ContextProvider";
import { getStatusIcon } from '@/components/Vetter/DepartmentStatus';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Department = {
    sn: number;
    department_id: string;
    department_name: string;
    status: string;
}

type DepartmentsHODs = {
    id: string;
    name: string;
    departments: Department[];
}

const CoursesByDepartment = () => {

  const {
    fetchDepartmentsForCourses,
    setViewDepIDs
  } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(14);

  // check allocation submission status
  const { data: departments_hods, isLoading } = useQuery<DepartmentsHODs[]>({
      queryKey: ['allocation_status'],
      queryFn: fetchDepartmentsForCourses,
  });

  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (departments_hods && departments_hods.length > 0) {
      setActiveTab(departments_hods[0].id);
    }
  }, [departments_hods]);
  
  // get currently selected semester
  const currentSemester = departments_hods?.find(s => s.id === activeTab);

  const { paginated, totalPages } = useTable({
    data: currentSemester?.departments ?? [],
    searchTerm,
    searchKeys: ['department_name', 'hod_name', 'status'],
    sortColumn,
    sortDirection: sortDirection as 'asc' | 'desc',
    currentPage,
    itemsPerPage,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, sortColumn, sortDirection, itemsPerPage]);

  const router = useRouter();

  const handleViewCourses = (department_id: any, semester_id: any) => {
    
    setViewDepIDs({
      department_id: department_id,
      semester_id: semester_id
    });

    router.push("/vetter/courses-by-department/vet-courses-by-department");
  }


  
  return (
    <div className="p-4 md:p-6">

      {/* Department Allocation Status Table */}
      <Card className="p-4 col-span-2">
        <div className="flex items-center justify-between mb-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : departments_hods && departments_hods.length > 0 && activeTab ? (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className='flex justify-between'>
              <div className='flex items-center gap-10'>
                <div>
                  {departments_hods?.map((semester: DepartmentsHODs) => (
                    <TabsTrigger key={semester.id} value={semester.id} className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 z-20">
                        {semester.name.split(" ")[0]}
                    </TabsTrigger>
                  ))}
                </div>
                <div className='relative '>
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
                  <Input placeholder="Search..." className="pl-8 bg-white w-[500px]" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <div></div>
            </TabsList>
            {departments_hods?.map((semester: DepartmentsHODs) => (
              <TabsContent key={semester.id} value={semester.id} className="h-full">
                <Table className="w-full h-full">
                  <TableHeader>
                    <TableRow>
                      {/* <TableHead className="w-[50px]">SN</TableHead> */}
                      <TableHead className="cursor-pointer" onClick={() => { setSortColumn('department_name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                        <div className="flex items-center">
                          <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                          Departments
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortColumn('hod_name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                        <div className="flex items-center">
                          <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                          HOD
                        </div>
                      </TableHead>
                      <TableHead className="">
                          Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="w-full h-full">
                    {(semester.id === activeTab ? paginated : semester.departments).map((dept:any) => (
                      <TableRow key={dept.department_id}>
                        {/* <TableCell className="font-medium">{dept.sn}</TableCell> */}
                        <TableCell>{dept.department_name}</TableCell>
                        <TableCell>{dept.hod_name}</TableCell>
                        <TableCell className="">
                          <Button
                            variant="outline"
                            className="text-webblue-100 hover:text-blue-700"
                            onClick={() => handleViewCourses(dept.department_id, activeTab)}
                          >
                            View Courses
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {semester.id === activeTab && (
                  <div className="flex justify-end items-center gap-2 mt-4">
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}> <ChevronLeft /> Prev</Button>
                      <span>Page {currentPage} of {totalPages}</span>
                    <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next <ChevronRight /></Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          ) : (
            <div>No data available</div>
          )}
          {/* Sort by dropdown can go here */}
        </div>
      </Card>
    </div>
  );
};

export default CoursesByDepartment;
