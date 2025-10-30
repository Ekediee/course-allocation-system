'use client'
import { useAppContext } from '@/contexts/ContextProvider'
import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query';
import { Semester } from "@/data/constants";
import CoursesVet from '@/components/ResourceUpload/course/CourseVet';

const VetCourses = () => {
      
  return (
    <>
        <CoursesVet />
    </>
  )
}

export default VetCourses