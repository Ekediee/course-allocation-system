"use client"

import React, { ReactNode } from 'react'

import { useAppContext } from '../contexts/ContextProvider'

// import Breadcrumb from '../components/BreadCrumbs'
import Sidebar from './Sidebars/Sidebar'
import MobileHeader from './MobileHeader'
import Header from './Header'
import { Toaster } from './ui/toaster'
import LogOutMenu from './LogOut'
// import Navbar from './Navbar'
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'

// import { useGetStaffMainDashQuery } from '../api/staffdash'

const PageWrapper = ({ children }: { children: ReactNode }) => {
    const {sidebarOpen, toggleSidebar, pageHeader, pageHeaderPeriod, logoutMenuOpen} = useAppContext()


    return (
        <div className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
            {/* Mobile Header with Menu Button */}
            <MobileHeader />

                    {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 transition-transform duration-300 ease-in-out
                fixed md:sticky md:top-0 md:static z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col
            `}>
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <Header title={pageHeader} description={pageHeaderPeriod} />

                {/* Main Content Area */}
                {children}
                {logoutMenuOpen && <LogOutMenu /> }
                <Toaster />
            </div>
            
        </div>
    )
    // }
}

export default PageWrapper