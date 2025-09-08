"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FaBook, FaBookOpen } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '@/contexts/ContextProvider';
import BulletinProgram from '@/components/BulletinProgram';
import Link from 'next/link';

// const bulletins = [
//   { id: '2019 - 2023', name: '2019 - 2023' },
//   { id: '2015 - 2019', name: '2015 - 2019' },
// ];

// 

type Bulletin = {
    id: string;
    name: string;
};

type Semester = {
    id: string;
    name: string;
};

const StepperPage = () => {
  const {
    department,
    programs, 
    setPrograms, 
    selectedProgram, 
    setSelectedProgram, 
    selectedBulletin, 
    setSelectedBulletin,
    semesters, setSemesters,
    selectedSemester, setSelectedSemester,
    fetchBulletinName, fetchSemester, fetchProgramSA
  } = useAppContext()
  const [step, setStep] = useState(1);
  
  const [loading, setLoading] = useState(false);


  const { data: program_data, isLoading: isProgramLoading, error: programError } = useQuery<Bulletin[]>({
    queryKey: ['programs', selectedBulletin], // Add bulletin to the key
    queryFn: () => fetchProgramSA(department), // Wrap call in function
    enabled: !!selectedBulletin, // Only run query when bulletin is selected
  });

  const { data: semester_data, isLoading: isSemesterLoading, error: semesterError } = useQuery<Semester[]>({
    queryKey: ['semesters'], // Add bulletin to the key
    queryFn: fetchSemester,
  });

  const { data: bulletin_data, isLoading: isBulletinLoading, error: bulletinError } = useQuery<Semester[]>({
    queryKey: ['bulletin'], // Add bulletin to the key
    queryFn: fetchBulletinName,
  });

  const handleProgramProceed = () => {
    if (semester_data) {
      
      
      setStep(3);
    }
  };

  const handleBulletinProceed = () => {
    if (selectedBulletin && program_data) {
      setPrograms(program_data.map(b => b.name));
      
      setStep(2);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-36">
      <Card className="w-full max-w-xl border shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Allocate Courses based on special request</h2>
            <span className="text-sm font-medium text-blue-600">{step} of 3</span>
          </div>

          <BulletinProgram step={step} />

          {step === 1 && (
            <div>
              <h3 className="text-center text-blue-600 font-medium mb-2">Select a bulletin</h3>
              <Select onValueChange={setSelectedBulletin} value={selectedBulletin || ''}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select Bulletin" />
                </SelectTrigger>
                <SelectContent>
                  {bulletin_data?.map((b) => (
                    <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button disabled={!selectedBulletin} variant="default" className="w-full bg-blue-800 hover:bg-blue-600" onClick={handleBulletinProceed}>
                Proceed
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-center text-blue-600 font-medium mb-2">Select a program</h3>
              <Select onValueChange={setSelectedProgram} value={selectedProgram || ''}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs?.map((program:any) => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={!selectedProgram} variant="default" className="bg-blue-800 hover:bg-blue-600" onClick={handleProgramProceed}>
                  Proceed
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-center text-blue-600 font-medium mb-2">Select a semester</h3>
              <Select onValueChange={setSelectedSemester} value={ selectedSemester || ''}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder={loading ? 'Loading...' : 'Select Program'} />
                </SelectTrigger>
                <SelectContent>
                  {semester_data?.map((s:any) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Link
                  href={{ pathname: "/special-allocation/bulletin/allocate" }}
                >
                  <Button disabled={!selectedSemester} className="">Proceed</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepperPage;
