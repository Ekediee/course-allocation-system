import React from 'react'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell
} from "lucide-react";
import { useAppContext } from '@/contexts/ContextProvider';

const Header = ({title, description}: any) => {
  const {
    isAllocationClosed,
  } = useAppContext()
  return (
    <header className="bg-white border-b border-gray-200 py-[10px] px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div>
        <h1 className="text-xl font-medium">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
        </Button>
        {isAllocationClosed ? (
          <Badge className="bg-red-100 text-red-600 py-1 px-2 md:px-3 text-xs md:text-sm">Allocation Closed</Badge>
        ) : (
          <Badge className="bg-green-100 text-green-600 py-1 px-2 md:px-3 text-xs md:text-sm">Allocation Open</Badge>
        )}
        </div>
    </header>
  )
}

export default Header