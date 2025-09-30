import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

type Course = {
  id: string;
  isAllocated: boolean;
};

type Program = {
  levels: {
    courses: Course[];
  }[];
};

type Semester = {
  id: string;
  programs: Program[];
};

type Props = {
  semester: Semester;
//   onSubmit: () => void;
};

const PrintLink = ({ semester }: Props) => {
    const allCourses = semester?.programs
    .flatMap(p => p.levels)
    .flatMap(l => l.courses);

    const total = allCourses?.length;
    const allocated = allCourses?.filter(c => c.isAllocated).length;
    
    let allAllocated;
    if (semester.id === "summer") {
        allAllocated = true;
    } else {
        allAllocated = total > 0 && allocated === total;
    }

  return (
    <>
        {allAllocated && (
            <Link
                href={{
                    pathname: "/course-allocation/reports",
                    query: { semester: semester.id }
                }}
            >
                <Button variant="outline" className="text-gray-500">View Report</Button>
            </Link>
        )}
    </>
  )
}

export default PrintLink