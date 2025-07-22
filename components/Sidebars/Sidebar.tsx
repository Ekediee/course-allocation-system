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

import { useAppContext } from '../../contexts/ContextProvider'
import HODSideBar from './HODSideBar';
import VetterSideBar from './VetterSideBar';

const Sidebar = () => {
    const {
      toggleSidebar, 
      email, name, 
      toggleLogoutMenu,
      role
    } = useAppContext()

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
        
        {role == "hod" && <HODSideBar />}
        {role == "vetter" && <VetterSideBar />}
        
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
            <div className="text-sm font-small flex items-center gap-1">
              {name}
              <Badge className="bg-blue-100 text-blue-600 h-4 w-4 p-0 rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </Badge>
            </div>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleLogoutMenu}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
    </>
  )
}

export default Sidebar