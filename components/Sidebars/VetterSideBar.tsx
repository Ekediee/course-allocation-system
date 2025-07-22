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
    X,
    Upload
  } from "lucide-react";
  import { activeLink, normalLink } from '@/data/constants';

const VetterSideBar = () => {
    const pathname = usePathname();
  return (
    <>
        <div className="py-4 space-y-1 px-3">
          {/* <p className="px-4 text-xs font-medium text-gray-500 mb-2">NAV</p> */}
          {/* <Link href="/dashboard/vetter" className={` ${pathname.includes('dashboard') ?  activeLink : normalLink }`}>
            <Blocks className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link href="/course-allocation/vet-allocation" className={` ${pathname.includes('course-allocation') ?  activeLink : normalLink }`}>
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Course Allocation</span>
          </Link> */}
          <Link href="/vetter/manage-uploads" className={` ${pathname.includes('manage-uploads') ?  activeLink : normalLink }`}>
            <Upload className="h-5 w-5 mr-3" />
            <span>Upload Resources</span>
          </Link>
        </div>
    </>
  )
}

export default VetterSideBar