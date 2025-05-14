import React from 'react'
import { Button } from "@/components/ui/button";
import {
    Blocks,
    Menu,
  } from "lucide-react";

  import { useAppContext } from '../contexts/ContextProvider'

const MobileHeader = () => {
    const {toggleSidebar} = useAppContext()

  return (
    <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Blocks className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h2 className="text-sm font-medium">Course Allocation App</h2>
            <p className="text-xs text-gray-500">Academic Planning</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
    </div>
  )
}

export default MobileHeader