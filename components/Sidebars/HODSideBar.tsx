import React from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronRight,
    Search,
    Bell,
    Users,
    Blocks,
    BookOpen,
    FileText,
    CircleAlert,
    User,
    Inbox,
    HelpCircle,
    MessageSquare,
    UserCircle,
    PlusCircle,
    ChevronDown,
    AlertCircle,
    Menu,
    X
  } from "lucide-react";
  import { activeLink, normalLink } from '@/data/constants';

const HODSideBar = () => {
    const pathname = usePathname();
  return (
    <>
        <div className="py-4 space-y-1 px-3">
          {/* <p className="px-4 text-xs font-medium text-gray-500 mb-2">NAV</p> */}
          <Link href="/dashboard/hod" className={` ${pathname.includes('dashboard') ?  activeLink : normalLink }`}>
            <Blocks className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link href="/course-allocation" className={` ${pathname.includes('course-allocation') ?  activeLink : normalLink }`}>
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Course Allocation</span>
          </Link>
          {/* <Link href="/de-allocation" className={` ${pathname.includes('de-allocation') ?  activeLink : normalLink }`}>
            <User className="h-5 w-5 mr-3" />
            <span>DE Allocation</span>
          </Link> */}
          <Link href="/special-allocation" className={` ${pathname.includes('special-allocation') ?  activeLink : normalLink }`}>
            <Users className="h-5 w-5 mr-3" />
            <span>Special Allocation</span>
          </Link>
          {/* <Link href="/support-request" className={` ${pathname.includes('support-request') ?  activeLink : normalLink }`}>
            <MessageSquare className="h-5 w-5 mr-3" />
            <span>Support and Requests</span>
          </Link>
          
          <p className="px-4 text-xs font-medium text-gray-500 mt-4 mb-2">OTHER</p>
          <Link href="/lecturers" className={` ${pathname.includes('lecturers') ?  activeLink : normalLink }`}>
            <Users className="h-5 w-5 mr-3" />
            <span>Lecturers</span>
          </Link> */}
        </div>
    </>
  )
}

export default HODSideBar