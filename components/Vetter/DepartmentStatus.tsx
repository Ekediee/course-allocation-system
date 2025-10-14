import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownWideNarrow, CheckCircle, ChevronLeft, ChevronRight, Hourglass, XCircle } from "lucide-react";
import { useAppContext } from "@/contexts/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTable } from "@/lib/useTable";
import { Button } from "../ui/button";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Allocated":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Still Allocating":
      return <Hourglass className="h-4 w-4 text-yellow-500" />;
    case "Not Started":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

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

const DepartmentStatus = () => {
  const {
    fetchAllocatationStatusOverview
  } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // check allocation submission status
  const { data: allocationStatus, isLoading } = useQuery<AllocationStatus[]>({
      queryKey: ['allocation_status'],
      queryFn: fetchAllocatationStatusOverview,
  });

  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (allocationStatus && allocationStatus.length > 0) {
      setActiveTab(allocationStatus[0].id);
    }
  }, [allocationStatus]);

  // get currently selected semester
  const currentSemester = allocationStatus?.find(s => s.id === activeTab);

  const { paginated, totalPages } = useTable({
    data: currentSemester?.departments ?? [],
    searchTerm,
    searchKeys: ['department_name', 'status'],
    sortColumn,
    sortDirection: sortDirection as 'asc' | 'desc',
    currentPage,
    itemsPerPage,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, sortColumn, sortDirection, itemsPerPage]);
      
  return (
    <Card className="p-4 col-span-2 h-full">
      <div className="flex font-bold mb-2">Allocation Status By Department - Most recent 10</div>
      <div className="flex items-center justify-between mb-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : allocationStatus && allocationStatus.length > 0 && activeTab ? (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full h-full">
          <TabsList>
            {allocationStatus?.map((semester: AllocationStatus) => (
              <TabsTrigger key={semester.id} value={semester.id} className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 z-20">
                  {semester.name.split(" ")[0]}
              </TabsTrigger>
              ))}
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
                    <TableHead className="cursor-pointer" onClick={() => { setSortColumn('status'); setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}}>
                      <div className="flex items-center">
                        <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                        Status
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full h-full">
                  {(semester.id === activeTab ? paginated : semester.departments).map((dept:any) => (
                    <TableRow key={dept.department_id}>
                      {/* <TableCell className="font-medium">{dept.sn}</TableCell> */}
                      <TableCell>{dept.department_name}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getStatusIcon(dept.status)} {dept.status}
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
          {/* <TabsContent value="first">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">SN</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.id}</TableCell>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {getStatusIcon(dept.status)} {dept.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="second">Change your password here.</TabsContent>
          <TabsContent value="summer">Change your password here.</TabsContent> */}
        </Tabs>
        ) : (
          <div>No data available</div>
        )}
        {/* Sort by dropdown can go here */}
      </div>
    </Card>
  );
};

export default DepartmentStatus;
