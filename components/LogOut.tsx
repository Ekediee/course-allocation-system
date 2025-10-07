'use client'

import { LogOut, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useAppContext } from '@/contexts/ContextProvider';

const LogOutMenu = () => {
  const router = useRouter()
  const { role } = useAppContext()

  const handleLogout = async () => {
    // Clear relevant cookies/localStorage if needed
    // document.cookie = 'role=; Max-Age=0; path=/;'
    // document.cookie = 'name=; Max-Age=0; path=/;'
    // document.cookie = 'access_token_cookie=; Max-Age=0; path=/;'
    // router.push('/')
    const tempRole = role
    try {
      await fetch('/api/logout', { method: 'POST' })

      if(tempRole === 'hod' || tempRole === 'lecturer'){
        window.location.href = '/';
      }else{
        window.location.href = "/admin/login"
      }
    }catch (error){
      console.log("Error: ", error)
    }
  }

  const handleChangePassword = () => {
    router.push('/change-password')
  }

  return (
    <div className="absolute bottom-4 left-[259px] flex flex-col gap-2 items-start text-sm bg-white p-4 rounded-lg shadow-lg w-48 z-50">
      <Button
        onClick={handleChangePassword}
        variant="ghost"
        className="w-full flex items-center gap-2 justify-start text-gray-700 border-b border-gray-200 pt-2"
      >
        <Key className="w-4 h-4" />
        Change Password
      </Button>
        
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full flex items-center gap-2 justify-start text-red-600"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  )
}

export default LogOutMenu
