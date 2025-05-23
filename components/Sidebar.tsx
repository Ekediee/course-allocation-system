import React from 'react'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { usePathname } from 'next/navigation';

import { useAppContext } from '../contexts/ContextProvider'
import Link from 'next/link';
import { activeLink, normalLink } from '@/data/constants';

const Sidebar = () => {
    const {toggleSidebar} = useAppContext()

    const pathname = usePathname();

  return (
    <>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Blocks className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-medium">Course Allocation App</h2>
              <p className="text-xs text-gray-500">Academic Planning</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="py-4 space-y-1 px-3">
          {/* <p className="px-4 text-xs font-medium text-gray-500 mb-2">NAV</p> */}
          <Link href="/dashboard" className={` ${pathname.includes('dashboard') ?  activeLink : normalLink }`}>
            <Blocks className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          <Link href="/course-allocation" className={` ${pathname.includes('course-allocation') ?  activeLink : normalLink }`}>
            <BookOpen className="h-5 w-5 mr-3" />
            <span>Course Allocation</span>
          </Link>
          <Link href="/de-allocation" className={` ${pathname.includes('de-allocation') ?  activeLink : normalLink }`}>
            <User className="h-5 w-5 mr-3" />
            <span>DE Allocation</span>
          </Link>
          <Link href="/special-allocation" className={` ${pathname.includes('special-allocation') ?  activeLink : normalLink }`}>
            <Users className="h-5 w-5 mr-3" />
            <span>Special Allocation</span>
          </Link>
          <Link href="/support-request" className={` ${pathname.includes('support-request') ?  activeLink : normalLink }`}>
            <MessageSquare className="h-5 w-5 mr-3" />
            <span>Support and Requests</span>
          </Link>
          
          <p className="px-4 text-xs font-medium text-gray-500 mt-4 mb-2">OTHER</p>
          <Link href="/lecturers" className={` ${pathname.includes('lecturers') ?  activeLink : normalLink }`}>
            <Users className="h-5 w-5 mr-3" />
            <span>Lecturers</span>
          </Link>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-200">
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 text-gray-500 mr-2" />
            <div className="flex-1">
              <p className="text-sm font-medium">Need support?</p>
              <p className="text-xs text-gray-500">Contact with one of our experts to get support.</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full text-white flex items-center justify-center">
            <span className="text-xs">SE</span>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="text-sm font-medium flex items-center gap-1">
              Seun Ebiesuwa
              <Badge className="bg-blue-100 text-blue-600 h-4 w-4 p-0 rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </Badge>
            </div>
            <p className="text-xs text-gray-500 truncate">Ebiesuwas@babcock.edu.ng</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
    </>
  )
}

export default Sidebar