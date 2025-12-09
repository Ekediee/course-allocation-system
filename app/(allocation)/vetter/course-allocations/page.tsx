'use client'
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import DonutChart from '@/components/DonutChart';
import { ArrowDownWideNarrow, ChevronLeft, ChevronRight, Hourglass, Router, Search, XCircle } from 'lucide-react';
import AllocationPercentage from '@/components/Vetter/AllocationPercentage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { useTable } from '@/lib/useTable';
import { useAppContext } from "@/contexts/ContextProvider";
import { getStatusIcon } from '@/components/Vetter/DepartmentStatus';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { ComboboxMain } from '@/components/ComboboxMain';
import { int64 } from 'zod';
import { MetricType } from '@/components/Vetter/VetterStats';

type Department = {
    sn: number;
    department_id: string;
    department_name: string;
    status: string;
}

type AllocationStatus = {
    id: string;
    name: string;
    departments: Department[];
}

const CourseAllocationsPage = () => {
  // Mock data - replace with actual data fetching
  const stats = {
    totalPrograms: 29,
    totalCourses: 987,
    departmentsSubmitted: 15,
    programsInProgress: 16,
  };

  const rowCount = [
    {id: '10', name: '10'},
    {id: '50', name: '50'},
    {id: '100', name: '100'}
  ]

  const {
    fetchAllocatationStatusOverview,
    fetchAllocatationMetrics,
    setVetDepIDs, vetDepIDs,
    role
  } = useAppContext()

  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState('10');

  // check allocation submission status
  const { data: allocationStatus, isLoading } = useQuery<AllocationStatus[]>({
      queryKey: ['allocation_status'],
      queryFn: fetchAllocatationStatusOverview,
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery<MetricType>({
      queryKey: ['metrics'],
      queryFn: fetchAllocatationMetrics,
  });

  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (allocationStatus && allocationStatus.length > 0) {
      setActiveTab(allocationStatus[0].id);
    }
  }, [allocationStatus]);
  
  // get currently selected semester
  const currentSemester = allocationStatus?.find(s => s.id === activeTab);

  let itemsPerPage = Number(pageItems)

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
  
  const handleVetAllocation = (department_id: any, semester_id: any) => {
    
    setVetDepIDs({
      department_id: department_id,
      semester_id: semester_id
    });

    router.push("/vetter/course-allocations/vet-allocation")
  }
  
  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Allocation Progress stats */}
        <AllocationPercentage />

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-weak-100 relative">
            <div className="flex justify-between">
              <div className=''>
              <CardHeader>
                <CardTitle># Courses allocated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{metrics?.allocated_courses}</p>
              </CardContent>
              </div>
              {/* <div className='absolute bottom-1 right-6 text-right'>
              <CardHeader>
                <CardTitle># Courses to allocate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{metrics?.total_courses_to_allocate}</p>
              </CardContent>
              </div> */}
            </div>
          </Card>
          <Card className="bg-weak-100">
            <CardHeader>
              <CardTitle># Departments allocating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{metrics?.allocation_in_progress}</p>
            </CardContent>
          </Card>
          <Card className="bg-weak-100">
            <CardHeader>
              <CardTitle># Departments not started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{metrics?.allocation_not_started}</p>
            </CardContent>
          </Card>
          <Card className="bg-weak-100">
            <CardHeader>
              <CardTitle># Departments completed allocations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{metrics?.allocation_submitted}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Department Allocation Status Table */}
      <Card className="p-4 col-span-2">
        <div className="flex items-center justify-between mb-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : allocationStatus && allocationStatus.length > 0 && activeTab ? (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className='flex justify-between'>
              <div className='flex items-center gap-10'>
                <div>
                  {allocationStatus?.map((semester: AllocationStatus) => (
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
            {allocationStatus?.map((semester: AllocationStatus) => (
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
                      <TableHead className="cursor-pointer" onClick={() => { setSortColumn('hod_name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                        <div className="flex items-center">
                          <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                          Total Courses
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortColumn('hod_name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                        <div className="flex items-center">
                          <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                          Allocated Courses
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortColumn('hod_name'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                        <div className="flex items-center">
                          <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                          Allocation Rate
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => { setSortColumn('status'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                        <div className="flex items-center">
                          <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                          Allocation Status
                        </div>
                      </TableHead>
                      {(role === "superadmin" || role === "vetter") && (
                        <>
                          <TableHead className="">
                              View
                          </TableHead>
                          <TableHead className="">
                            Vetting Status
                          </TableHead>
                        </>
                      )}
                      <TableHead className="">
                        Vetted By
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="w-full h-full">
                    {(semester.id === activeTab ? paginated : semester.departments).map((dept:any) => (
                      <TableRow key={dept.department_id}>
                        {/* <TableCell className="font-medium">{dept.sn}</TableCell> */}
                        <TableCell>{dept.department_name}</TableCell>
                        <TableCell>{dept.hod_name}</TableCell>
                        <TableCell className="text-center">{dept.total_courses}</TableCell>
                        <TableCell className="text-center">{dept.total_courses_allocated}</TableCell>
                        <TableCell>
                          <div className="col-span-3 pr-4">
                            <div className="flex items-center gap-2">
                              <Progress value={dept.allocation_rate} className="h-2" />
                              <span className="text-xs md:text-sm text-gray-500">{dept.allocation_rate}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="flex items-center gap-2">
                          {getStatusIcon(dept.status)} {dept.status}
                        </TableCell>
                        {(role === "superadmin" || role === "vetter") && (
                          <>
                            <TableCell className="">
                              <Button
                                variant="outline"
                                className="text-webblue-100 hover:text-blue-700"
                                onClick={() => handleVetAllocation(dept.department_id, activeTab)}
                                disabled={!dept.submitted}
                                // disabled={role !== "superadmin" && !dept.submitted}
                              >
                                View Allocation
                              </Button>
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                              {dept.vet_status === "Vetted" ? (
                                <Badge className="text-white flex items-center gap-2 p-2 font-bold">
                                  {getStatusIcon(dept.vet_status)} {dept.vet_status}
                                </Badge>
                              ) : (
                                <Badge variant='outline' className="text-gray-500 flex items-center gap-2 p-1">
                                  <XCircle className="h-4 w-4 text-red-300" /> {dept.vet_status}
                                </Badge>
                              )}
                            </TableCell>
                          </>
                        )}
                        <TableCell className="">
                          {dept.vetted_by}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {semester.id === activeTab && (
                  <div className="flex justify-between items-center gap-2 mt-4">
                    <div className='flex items-center gap-2'>
                      <span>Rows</span>
                      <ComboboxMain data={rowCount} onSelect={setPageItems} initialValue={pageItems} />
                    </div>
                    <div className='flex items-center gap-2'>
                      <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}> <ChevronLeft /> Prev</Button>
                        <span>Page {currentPage} of {totalPages}</span>
                      <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next <ChevronRight /></Button>
                    </div>
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

export default CourseAllocationsPage;
