'use client';
import React, { useState, useMemo, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { saveAs } from "file-saver";
import { useAppContext } from "@/contexts/ContextProvider";
import { useQuery } from "@tanstack/react-query";
import { Semester } from "@/data/constants";
import { Skeleton } from "@/components/ui/skeleton";

const CourseAllocationReport = () => {
  const { fetchSemesterData, prevPath, fetchSemesterDataDE } = useAppContext();
  const searchParams = useSearchParams();
  const semesterId = searchParams.get('semester');

  const queryResult =
    prevPath === "/course-allocation"
      ? useQuery<Semester[]>({
          queryKey: ["semesters"],
          queryFn: fetchSemesterData,
        })
      : useQuery<Semester[]>({
          queryKey: ["semesters"],
          queryFn: fetchSemesterDataDE,
        });

  const { data: allocation_data, isLoading, error } = queryResult;

  const semesterData = useMemo(
    () => allocation_data?.find((sem) => String(sem.id) === semesterId),
    [allocation_data, semesterId]
  );

  const programs = useMemo(() => {
    return semesterData?.programs ?? [];
  }, [semesterData]);

  const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>();
  const activeProgramId = selectedProgramId ?? programs[0]?.id;

  const selectedData = useMemo(() => {
    return programs.find((p) => String(p.id) === String(activeProgramId));
  }, [activeProgramId, programs]);

  const levels = selectedData?.levels || [];
  const [selectedLevelId, setSelectedLevelId] = useState<string | undefined>();
  const activeLevelId = selectedLevelId ?? levels[0]?.id;

  const currentLevel = useMemo(() => {
      return levels.find((l) => l.id === activeLevelId);
  }, [levels, activeLevelId]);

  const printRef = useRef<HTMLDivElement>(null);

  const groupCourses = (courses: any) => {
    const core = [];
    const general = [];
    for (const course of courses) {
      if (course.code.startsWith("GEDS") || course.code.startsWith("BU-GST") || course.code.includes("GST")) {
        general.push(course);
      } else {
        core.push(course);
      }
    }
    return { core, general };
  };

  const { core, general } = groupCourses(currentLevel?.courses || []);
  const totalUnits = [...general, ...core].reduce(
    (sum, c) => sum + Number(c.unit),
    0
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const headerText = `BABCOCK UNIVERSITY\n${String(semesterData?.sessionName).toUpperCase()} ACADEMIC SESSION\n${String(semesterData?.name).toUpperCase()} COURSE ALLOCATION\n${String(selectedData?.name)
      .replace(/_/g, " ")
      .toUpperCase()}\n${currentLevel?.name.toUpperCase()} COURSES`;
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

    const tableBody: RowInput[] = [];
    if (general.length > 0) {
        tableBody.push([
            {
                content: 'GENERAL COURSES',
                colSpan: 5,
                styles: { fontStyle: 'bold', fillColor: [220, 220, 220], textColor: [0, 0, 0], halign: 'center' }
            }
        ]);
        general.forEach((course, index) => {
            tableBody.push([index + 1, course.code, course.title, course.unit, course.allocatedTo]);
        });
    }

    if (core.length > 0) {
        tableBody.push([
            {
                content: 'CORE COURSES',
                colSpan: 5,
                styles: { fontStyle: 'bold', fillColor: [220, 220, 220], textColor: [0, 0, 0], halign: 'center' }
            }
        ]);
        core.forEach((course, index) => {
            tableBody.push([index + general.length + 1, course.code, course.title, course.unit, course.allocatedTo]);
        });
    }

    tableBody.push([
        {
            content: 'Total',
            colSpan: 3,
            styles: { fontStyle: 'bold', fillColor: [41, 41, 41], textColor: [255, 255, 255], halign: 'center' }
        },
        {
            content: String(totalUnits),
            styles: { fontStyle: 'bold', fillColor: [41, 41, 41], textColor: [255, 255, 255], halign: 'left' }
        },
        {
            content: '',
            styles: { fillColor: [41, 41, 41] }
        }
    ]);

    autoTable(doc, {
      startY: tableYStart,
      head: [["SN", "Code", "Title", "Unit", "Lecturer"]],
      body: tableBody,
      theme: "striped",
      didDrawPage: function (data) {
        // Footer
        const docHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const timestamp = new Date().toLocaleString();
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Date Printed: " + timestamp, data.settings.margin.left, docHeight - 10);
      },
    });

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
    const headerText = `${String(semesterData?.sessionName).toUpperCase()} ACADEMIC SESSION\n${String(semesterData?.name).toUpperCase()} COURSE ALLOCATION\n${String(selectedData?.name)
      .replace(/_/g, " ")
      .toUpperCase()}\n${currentLevel?.name.toUpperCase()} COURSES\n\n`;
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

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Card className="p-4 md:p-6 max-w-full mt-4">
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>
            Failed to load course allocation data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please try again later or contact support.</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!semesterData) {
    return (
      <Card className="max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Report Not Found</CardTitle>
          <CardDescription>
            The report for the specified semester could not be found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check the URL or go back to the allocation page.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-2 p-4">
        <Tabs
          value={programs.length > 0 ? String(activeProgramId) : ""}
          onValueChange={setSelectedProgramId}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:flex md:justify-start bg-transparent px-4 h-20 md:h-10 gap-2 mb-3 md:mb-2">
            {programs.map((program) => (
              <TabsTrigger
                key={String(program.id)}
                value={String(program.id)}
                title={program.name}
                className="capitalize bg-white md:w-56 md:h-8 truncate data-[state=active]:bg-blue-700 data-[state=active]:text-white"
              >
                {program.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex justify-between items-center">
          <Tabs
            value={activeLevelId}
            onValueChange={setSelectedLevelId}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 md:flex md:justify-start bg-transparent px-4 md:h-10 md:grid-cols-4 gap-2">
              {levels.map((level) => (
                <TabsTrigger
                  key={level.id}
                  value={level.id}
                  className="bg-gray-100 md:h-8 data-[state=active]:bg-white"
                >
                  {level.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="flex justify-end gap-2 px-4">
            <Button onClick={handleDownloadPDF} className="bg-gray-900">
              PDF
            </Button>
            <Button onClick={handleDownloadCSV} className="bg-gray-900">
              CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mx-4 my-2">
        <Card>
          <CardContent className="p-4">
            <div ref={printRef}>
              <div className="text-center mb-4">
                <p className="font-semibold">
                  {String(semesterData?.sessionName).toUpperCase()} ACADEMIC SESSION
                </p>
                <p className="font-semibold">
                  {String(semesterData?.name).toUpperCase()} COURSE ALLOCATION
                </p>
                <p className="font-semibold">
                  B.Sc (Hons.) {String(selectedData?.name).toUpperCase()}
                </p>
                <p className="font-semibold">
                  {currentLevel?.name.toUpperCase()} COURSES
                </p>
              </div>

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
                  {general.length > 0 && (
                    <>
                      <tr>
                        <td colSpan={5} className="font-semibold mt-4 bg-gray-200 p-2 rounded">
                          GENERAL COURSES
                        </td>
                      </tr>
                      {general.map((course, index) => (
                        <tr key={course.id}>
                          <td>{index + 1}</td>
                          <td>{course.code}</td>
                          <td>{course.title}</td>
                          <td>{course.unit}</td>
                          <td>{course.allocatedTo}</td>
                        </tr>
                      ))}
                    </>
                  )}
                  {core.length > 0 && (
                    <>
                      <tr>
                        <td colSpan={5} className="font-semibold mt-4 bg-gray-200 p-2 rounded">
                          CORE COURSES
                        </td>
                      </tr>
                      {core.map((course, index) => (
                        <tr key={course.id}>
                          <td>{index + general.length + 1}</td>
                          <td>{course.code}</td>
                          <td>{course.title}</td>
                          <td>{course.unit}</td>
                          <td>{course.allocatedTo}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>

              <div className="flex mt-4 justify-between font-semibold text-lg bg-gray-900 text-white p-2 rounded">
                <div className="w-full text-center pr-[70px]">Total</div>
                <div className="w-full text-center pr-[40px]">
                  {totalUnits}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CourseAllocationReport;