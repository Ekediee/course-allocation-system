"use client";
import React, { useState, useMemo, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const printRef = useRef<HTMLDivElement>(null);

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
  const totalUnits = [...general, ...core].reduce((sum, c) => sum + Number(c.unit), 0);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const headerText = `${selectedProgram.replace(/_/g, " ").toUpperCase()}\n${selectedSemester.toUpperCase()} SEMESTER COURSE ALLOCATION\n${currentLevel?.name.toUpperCase()} COURSES`;
    const lines = doc.splitTextToSize(headerText, 180);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textHeight = 7;
    const startY = 16;

    lines.forEach((line:any, index:any) => {
      const textWidth = doc.getTextWidth(line);
      const x = (pageWidth - textWidth) / 2;
      doc.text(line, x, startY + index * textHeight);
    });

    const tableYStart = startY + lines.length * textHeight + 4;

    const result = autoTable(doc, {
      startY: tableYStart,
      head: [["Code", "Title", "Unit", "Allocated To"]],
      body: [...general, ...core].map((c) => [c.code, c.title, c.unit, c.allocatedTo]),
      theme: "striped",
    }) as any;

    const finalY = result?.cursor?.y ?? tableYStart + 10;
    doc.text(`Total Units: ${totalUnits}`, 14, finalY + 120);
    doc.save("course_allocation.pdf");
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "height=700,width=900");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Course Allocation Print View</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2, p { margin: 0; padding: 4px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }
              th { background: #f0f0f0; }
              .header { text-align: center; margin-bottom: 20px; }
              .section-title { margin-top: 20px; font-weight: bold; }
              .total { margin-top: 20px; font-weight: bold; text-align: right; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownloadCSV = () => {
      const headerText = `${selectedProgram.replace(/_/g, " ").toUpperCase()}\n${selectedSemester.toUpperCase()} SEMESTER COURSE ALLOCATION\n${currentLevel?.name.toUpperCase()} COURSES\n\n`;
      const header = "Code,Title,Unit,Allocated To\n";
      const rows = [...general, ...core]
        .map((c) => `${c.code},${c.title},${c.unit},${c.allocatedTo}`)
        .join("\n");
      const footer = `\nTotal Units:,${totalUnits}`;
      const blob = new Blob([headerText + header + rows + footer], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, "course_allocation.csv");
  };

  return (
    <>
      {/* <h1 className="text-2xl font-bold">Course Allocation</h1> */}

      <div className="space-y-2">
        <Tabs value={selectedSemester} onValueChange={setSelectedSemester} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-8 p-0 bg-white shadow-sm border-b border-gray-200 sticky top-[68px] z-100">
            {allocation_data.map((sem) => (
              <TabsTrigger key={sem.id} value={sem.id} className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6">
                {sem.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs value={selectedProgram} onValueChange={setSelectedProgram} className="w-full">
          <TabsList className="grid grid-cols-2 md:flex md:justify-start bg-transparent px-4 h-20 md:h-10 gap-2 mb-3 md:mb-2">
            {programs.map((progId) => (
              <TabsTrigger key={progId} value={progId} className="capitalize bg-white md:w-56 md:h-8 data-[state=active]:bg-blue-700 data-[state=active]:text-white">
                {progId.replace(/_/g, " ")}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex justify-between items-center">
          <Tabs value={selectedLevelId} onValueChange={setSelectedLevelId} className="w-full">
            <TabsList className="grid grid-cols-4 md:flex md:justify-start bg-transparent px-4 md:h-10 md:grid-cols-4 gap-2">
              {levels.map((level) => (
                <TabsTrigger key={level.id} value={level.id} className="bg-gray-100 md:h-8 data-[state=active]:bg-white">
                  {level.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex justify-end gap-2 px-4">
            {/* <Button onClick={handlePrint}>Print</Button> */}
            <Button onClick={handleDownloadPDF} className="bg-gray-900">PDF</Button>
            <Button onClick={handleDownloadCSV} className="bg-gray-900">CSV</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mx-4 my-2">
        <Card>
          <CardContent className="p-4">
            <div ref={printRef}>
              <div className="text-center mb-4">
                <p className="font-semibold">B.Sc (Hons.) {selectedProgram.replace(/_/g, " ").toUpperCase()}</p>
                <p className="font-semibold">{selectedSemester.toUpperCase()} SEMESTER COURSE ALLOCATION</p>
                <p className="font-semibold">{currentLevel?.name.toUpperCase()} COURSES</p>
              </div>

              {general.length > 0 && (
                <>
                  <h2 className="font-semibold mt-4 bg-gray-200 p-2 rounded">GENERAL COURSES</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 p-2 rounded">
                        <th className="text-left">SN</th>
                        <th className="text-left">Code</th>
                        <th className="text-left">Title</th>
                        <th className="text-left">Unit</th>
                        <th className="text-left">Lecturer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {general.map((course, index) => (
                        <tr key={course.id}>
                          <td>{index + 1}</td>
                          <td>{course.code}</td>
                          <td>{course.title}</td>
                          <td>{course.unit}</td>
                          <td>{course.allocatedTo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {core.length > 0 && (
                <>
                  <h2 className="font-semibold mt-4 bg-gray-200 p-2 rounded">CORE COURSES</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 p-2 rounded">
                        <th className="text-left">SN</th>
                        <th className="text-left">Code</th>
                        <th className="text-left">Title</th>
                        <th className="text-left">Unit</th>
                        <th className="text-left">Lecturer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {core.map((course, index) => (
                        <tr key={course.id}>
                          <td>{index + general.length + 1}</td>
                          <td>{course.code}</td>
                          <td>{course.title}</td>
                          <td>{course.unit}</td>
                          <td>{course.allocatedTo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              <div className="flex mt-4 justify-between font-semibold text-lg bg-gray-900 text-white p-2 rounded">
                <div className="w-full ml-[245px]">Total</div>
                 <div className="w-full ml-[300px]">{totalUnits}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CourseAllocation;
