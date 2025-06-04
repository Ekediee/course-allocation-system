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

const bulletins = [
  { id: '2019 - 2023', name: '2019 - 2023' },
  { id: '2015 - 2019', name: '2015 - 2019' },
];

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
    programs, 
    setPrograms, 
    selectedProgram, 
    setSelectedProgram, 
    selectedBulletin, 
    setSelectedBulletin,
    semesters, setSemesters,
    selectedSemester, setSelectedSemester
  } = useAppContext()
  const [step, setStep] = useState(1);
  
  const [loading, setLoading] = useState(false);

  const fetchPrograms = async (bulletinId: string) => {
    setLoading(true);
    try {
      // Simulate API call based on selected bulletin
      const response = await fetch('https://mocki.io/v1/e75d0873-d9ca-4fac-90f7-0a95661c51b0');
      const data = await response.json();
      return data
      // console.log('Fetched programs:', data);
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchSemester = async () => {
    setLoading(true);
    try {
      // Simulate API call based on selected bulletin
      const response = await fetch('https://mocki.io/v1/d42a6792-b904-4c38-9429-b505bfe05d71');
      const data = await response.json();
      // console.log('Fetched semesters:', data);
      return data
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const { data: bulletin_data, isLoading: isBulletinLoading, error: bulletinError } = useQuery<Bulletin[]>({
    queryKey: ['bulletins', selectedBulletin], // Add bulletin to the key
    queryFn: () => fetchPrograms(selectedBulletin), // Wrap call in function
    enabled: !!selectedBulletin, // Only run query when bulletin is selected
  });

  const { data: semester_data, isLoading: isSemesterLoading, error: semesterError } = useQuery<Semester[]>({
    queryKey: ['semesters'], // Add bulletin to the key
    queryFn: fetchSemester,
  });

  const handleSemesterProceed = () => {
    if (semester_data) {
      
      
      setStep(2);
    }
  };

  const handleBulletinProceed = () => {
    if (selectedBulletin && bulletin_data) {
      setPrograms(bulletin_data.map(b => b.name));
      
      setStep(3);
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
              <h3 className="text-center text-blue-600 font-medium mb-2">Select a semester</h3>
              <Select onValueChange={setSelectedSemester} value={selectedSemester || ''}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select Bulletin" />
                </SelectTrigger>
                <SelectContent>
                  {semester_data?.map((s:any) => (
                    <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button disabled={!selectedSemester} variant="default" className="w-full bg-blue-800 hover:bg-blue-600" onClick={handleSemesterProceed}>
                Proceed
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-center text-blue-600 font-medium mb-2">Select a bulletin</h3>
              <Select onValueChange={setSelectedBulletin} value={selectedBulletin || ''}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Select Bulletin" />
                </SelectTrigger>
                <SelectContent>
                  {bulletins.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={!selectedBulletin} variant="default" className="bg-blue-800 hover:bg-blue-600" onClick={handleBulletinProceed}>
                  Proceed
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-center text-blue-600 font-medium mb-2">Select a program</h3>
              <Select onValueChange={setSelectedProgram} value={selectedProgram || ''}>
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder={loading ? 'Loading...' : 'Select Program'} />
                </SelectTrigger>
                <SelectContent>
                  {programs?.map((program:any) => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Link
                  href={{ pathname: "/special-allocation/bulletin/allocate" }}
                >
                  <Button disabled={!selectedProgram} className="">Proceed</Button>
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
