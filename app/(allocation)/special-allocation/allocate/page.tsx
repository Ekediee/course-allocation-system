"use client";
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const bulletins = [
  { id: '2019', name: '2019 - 2023' },
  { id: '2015', name: '2015 - 2019' },
];

const StepperPage = () => {
  const [step, setStep] = useState(1);
  const [selectedBulletin, setSelectedBulletin] = useState<string | null>(null);
  const [programs, setPrograms] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrograms = async (bulletinId: string) => {
    setLoading(true);
    try {
      // Simulate API call based on selected bulletin
      const response = await fetch(`/api/programs?bulletin=${bulletinId}`);
      const data = await response.json();
      setPrograms(data.programs);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulletinProceed = () => {
    if (selectedBulletin) {
      fetchPrograms(selectedBulletin);
      setStep(2);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-36">
      <Card className="w-full max-w-xl border shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Allocate Courses based on special request</h2>
            <span className="text-sm font-medium text-blue-600">{step} of 2</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className={`rounded-lg p-3 border ${step === 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
              <div className="font-medium">Bulletin</div>
              <div className="text-sm text-muted-foreground">{selectedBulletin || '-'}</div>
            </div>
            <div className={`rounded-lg p-3 border ${step === 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
              <div className="font-medium">Program</div>
              <div className="text-sm text-muted-foreground">{selectedProgram || '-'}</div>
            </div>
          </div>

          {step === 1 && (
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
                  <SelectValue placeholder={loading ? 'Loading...' : 'Select Program'} />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program} value={program}>{program}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button disabled={!selectedProgram} className="">Proceed</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepperPage;
