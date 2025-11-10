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
    Upload,
    TableOfContents,
    Settings2,
    Settings
  } from "lucide-react";
  import { activeLink, normalLink } from '@/data/constants';
  import { useAppContext } from '@/contexts/ContextProvider';

const VetterSideBar = () => {
    const {
      role
    } = useAppContext()
    const pathname = usePathname();
  return (
    <>
        <div className="py-4 space-y-1 px-3 pb-12">
          {/* <p className="px-4 text-xs font-medium text-gray-500 mb-2">NAV</p> */}
          <Link href="/dashboard/vetter" className={` ${pathname.includes('dashboard') ?  activeLink : normalLink }`}>
            <Blocks className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link href="/vetter/course-allocations" className={` ${pathname.includes('course-allocations') ?  activeLink : normalLink }`}>
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Course Allocations</span>
          </Link>
          <Link href="/vetter/manage-uploads" className={` ${pathname.includes('manage-uploads') ?  activeLink : normalLink }`}>
            <Upload className="h-5 w-5 mr-3" />
            <span>Upload Resources</span>
          </Link>
          <Link href="/vetter/courses-by-department" className={` ${pathname.includes('courses-by-department') ?  activeLink : normalLink }`}>
            <TableOfContents className="h-5 w-5 mr-3" />
            <span>View Courses</span>
          </Link>
          <Link href="/vetter/manage-courses" className={` ${pathname.includes('manage-courses') ?  activeLink : normalLink }`}>
            <TableOfContents className="h-5 w-5 mr-3" />
            <span>Manage Courses</span>
          </Link>
          {role === 'superadmin' &&
            <Link href="/vetter/admin-management" className={` ${pathname.includes('admin-management') ?  activeLink : normalLink }`}>
              <Users className="h-5 w-5 mr-3" />
              <span>Admin Management</span>
            </Link>
          }
          
        </div>
        {role === 'superadmin' &&
          <div>
            <div className="pt-4 pb-2 px-2 border-b border-gray-200">
              <h3 className="flex items-center gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Settings /> Settings
              </h3>
            </div>
            <Link href="/system-settings" className={` ${pathname.includes('system-settings') ?  activeLink : normalLink }`}>
              <Settings2 className="h-5 w-5 mr-3" />
              <span>System Configs</span>
            </Link>
          </div>
        }
  </>
  )
}

export default VetterSideBar