"use client";
import React from 'react'
import { FaBook, FaBookOpen } from 'react-icons/fa'
import { useAppContext } from '@/contexts/ContextProvider';

const BulletinProgram = ({step, view}: any) => {
    const { 
        selectedProgram, 
        selectedBulletin,
        selectedSemester 
      } = useAppContext()

  return (
    <div className={`grid grid-cols-3 gap-2 mb-4 ${view ? 'md:w-3/4 m-4 md:gap-4' : 'w-full'}`}>
        {/* Bulletin and Program Selection */}
        <div className={`rounded-lg p-3 border bg-blue-100 flex items-center ${step === 1 ? 'border-blue-600 border-2' : 'border-gray-200'}`}>
            <div className="flex gap-2">
            <div className="flex justify-center items-center w-8 h-8 rounded-full bg-white"><FaBook className='text-lg text-center'/></div>
            <div className="flex flex-col">
                <div className="font-medium">Semester</div>
                <div className="text-sm text-muted-foreground">{selectedSemester || '-'}</div>
            </div> 
            </div>
        </div>
        <div className={`rounded-lg p-3 border bg-blue-100 flex items-center ${step === 2 ? 'border-blue-600 border-2' : 'border-gray-200'}`}>
            <div className="flex gap-2">
            <div className="flex justify-center items-center w-8 h-8 rounded-full bg-white"><FaBook className='text-lg text-center'/></div>
            <div className="flex flex-col">
                <div className="font-medium">Bulletin</div>
                <div className="text-sm text-muted-foreground">{selectedBulletin || '-'}</div>
            </div> 
            </div>
        </div>
        <div className={`rounded-lg p-3 border bg-blue-100 flex items-center ${step === 3 ? 'border-blue-600 border-2' : 'border-gray-200'}`}>
            <div className="flex gap-2">
            <div className="flex justify-center items-center w-8 h-8 rounded-full bg-white"><FaBookOpen className='text-lg text-center'/></div>
            <div className="flex flex-col">
                <div className="font-medium">Program</div>
                <div className="text-sm text-muted-foreground">{selectedProgram || '-'}</div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default BulletinProgram