"use client";
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

  const totalUnits = [...core, ...general].reduce((sum, c) => sum + Number(c.unit), 0);

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(12);
//     doc.text(
//       `${selectedProgram.replace(/_/g, " ").toUpperCase()}\n${selectedSemester.toUpperCase()} COURSE ALLOCATION\n${currentLevel?.name.toUpperCase()} COURSES`,
//       14,
//       16
//     );
//     autoTable(doc, {
//       startY: 30,
//       head: [["Code", "Title", "Unit", "Allocated To"]],
//       body: [...core, ...general].map((c) => [c.code, c.title, c.unit, c.allocatedTo]),
//     });
//     doc.text(`Total Units: ${totalUnits}`, 14, doc.lastAutoTable.finalY + 10);
//     doc.save("course_allocation.pdf");
//   };

//   const handleDownloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(12);

//     const headerText = `${selectedProgram.replace(/_/g, " ").toUpperCase()}\n${selectedSemester.toUpperCase()} COURSE ALLOCATION\n${currentLevel?.name.toUpperCase()} COURSES`;
//     const lines = doc.splitTextToSize(headerText, 180);
//     doc.text(lines, 14, 16);

//     const tableYStart = 16 + lines.length * 7;

//     // SAFELY capture autoTable result
//     const result = autoTable(doc, {
//         startY: tableYStart,
//         head: [["Code", "Title", "Unit", "Allocated To"]],
//         body: [...core, ...general].map((c) => [c.code, c.title, c.unit, c.allocatedTo]),
//         theme: "striped",
//     });

//     const finalY = result?.cursor?.y ?? tableYStart + 10; // fallback if undefined

//     doc.text(`Total Units: ${totalUnits}`, 14, finalY + 10);
//     doc.save("course_allocation.pdf");
//   };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const headerText = `${selectedProgram.replace(/_/g, " ").toUpperCase()}\n${selectedSemester.toUpperCase()} COURSE ALLOCATION\n${currentLevel?.name.toUpperCase()} COURSES`;
    const lines = doc.splitTextToSize(headerText, 180);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textHeight = 7;
    const startY = 16;

    lines.forEach((line: any, index: any) => {
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
    });

    const finalY = result?.cursor?.y ?? tableYStart + 10;

    doc.text(`Total Units: ${totalUnits}`, 14, finalY + 10);
    doc.save("course_allocation.pdf");
  };


  const handleDownloadCSV = () => {
    const headerText = `${selectedProgram.replace(/_/g, " ").toUpperCase()}\n${selectedSemester.toUpperCase()} COURSE ALLOCATION\n${currentLevel?.name.toUpperCase()} COURSES\n\n`;
    const header = "Code,Title,Unit,Allocated To\n";
    const rows = [...core, ...general]
      .map((c) => `${c.code},${c.title},${c.unit},${c.allocatedTo}`)
      .join("\n");
    const footer = `\nTotal Units:,${totalUnits}`;
    const blob = new Blob([headerText + header + rows + footer], {
      type: "text/csv;charset=utf-8;",
    });
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
        <Card>
          <CardContent className="p-4">
            <div className="text-center mb-4">
              <p className="font-semibold">B.Sc (Hons.) {selectedProgram.replace(/_/g, " ").toUpperCase()}</p>
              <p className="font-semibold">{selectedSemester.toUpperCase()} COURSE ALLOCATION</p>
              <p className="font-semibold">{currentLevel?.name.toUpperCase()} COURSES</p>
            </div>

            {general.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mt-4 mb-2">GENERAL COURSES</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th className="text-left">Code</th>
                      <th className="text-left">Title</th>
                      <th className="text-left">Unit</th>
                      <th className="text-left">Allocated To</th>
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
                <h2 className="text-lg font-semibold mt-4 mb-2">CORE COURSES</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th className="text-left">Code</th>
                      <th className="text-left">Title</th>
                      <th className="text-left">Unit</th>
                      <th className="text-left">Allocated To</th>
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

            <div className="mt-4 p-2 bg-black text-white text-right font-semibold rounded">
              Total: {totalUnits}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseAllocation;
