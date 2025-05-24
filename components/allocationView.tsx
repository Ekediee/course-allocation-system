import React, { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { allocation_data } from "@/data/course_data";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

const CourseAllocation = () => {
  const semesters = useMemo(() => allocation_data.map((sem) => sem.id), []);
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]);

  const programs = useMemo(() => {
    const semester = allocation_data.find((sem) => sem.id === selectedSemester);
    return semester ? semester.programs.map((p) => p.id) : [];
  }, [selectedSemester]);

  const [selectedProgram, setSelectedProgram] = useState(programs[0]);

  const selectedData = useMemo(() => {
    const semester = allocation_data.find((sem) => sem.id === selectedSemester);
    return semester?.programs.find((p) => p.id === selectedProgram);
  }, [selectedSemester, selectedProgram]);

  const levels = selectedData?.levels || [];
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id);

  const currentLevel = levels.find((l) => l.id === selectedLevelId);

  const groupCourses = (courses: any) => {
    const core = [];
    const general = [];
    for (const course of courses) {
      if (course.code.startsWith("GEDS") || course.code.startsWith("BU-GST")) {
        general.push(course);
      } else {
        core.push(course);
      }
    }
    return { core, general };
  };

  const { core, general } = groupCourses(currentLevel?.courses || []);

  const getCurrentView = () => {
    const data = [...core, ...general];
    return data.map((c) => [c.code, c.title, c.unit, c.allocatedTo]);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Course Allocation", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Code", "Title", "Unit", "Allocated To"]],
      body: getCurrentView(),
    });
    doc.save("course_allocation.pdf");
  };

  const handleDownloadCSV = () => {
    const header = "Code,Title,Unit,Allocated To\n";
    const rows = getCurrentView()
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "course_allocation.csv");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Course Allocation</h1>

      <div className="space-y-2">
        <Tabs value={selectedSemester} onValueChange={setSelectedSemester} className="w-full">
          <TabsList className="w-full flex flex-wrap">
            {allocation_data.map((sem) => (
              <TabsTrigger key={sem.id} value={sem.id} className="capitalize">
                {sem.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs value={selectedProgram} onValueChange={setSelectedProgram} className="w-full">
          <TabsList className="w-full flex flex-wrap">
            {programs.map((progId) => (
              <TabsTrigger key={progId} value={progId} className="capitalize">
                {progId.replace(/_/g, " ")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs value={selectedLevelId} onValueChange={setSelectedLevelId} className="w-full">
          <TabsList className="w-full flex flex-wrap">
            {levels.map((level) => (
              <TabsTrigger key={level.id} value={level.id}>
                {level.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleDownloadCSV}>Print</Button>
        <Button onClick={handleDownloadPDF}>Download</Button>
      </div>

      <div className="grid gap-6">
        {core.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Core Courses</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Code</th>
                    <th className="text-left">Title</th>
                    <th className="text-left">Unit</th>
                    <th className="text-left">Allocated To</th>
                  </tr>
                </thead>
                <tbody>
                  {core.map((course) => (
                    <tr key={course.id}>
                      <td>{course.code}</td>
                      <td>{course.title}</td>
                      <td>{course.unit}</td>
                      <td>{course.allocatedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

        {general.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">General Courses</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Code</th>
                    <th className="text-left">Title</th>
                    <th className="text-left">Unit</th>
                    <th className="text-left">Allocated To</th>
                  </tr>
                </thead>
                <tbody>
                  {general.map((course) => (
                    <tr key={course.id}>
                      <td>{course.code}</td>
                      <td>{course.title}</td>
                      <td>{course.unit}</td>
                      <td>{course.allocatedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseAllocation;
