'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const handleLogin = () => {
    console.log("Login attempt with:", { email, password, rememberMe });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,3L1,9L5,11.18V17.18L12,21L19,17.18V11.18L21,10.09V17H23V9L12,3M18.5,9L12,12.72L5.5,9L12,5.28L18.5,9M17,16L12,18.72L7,16V12.27L12,15L17,12.27V16Z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 text-center">Babcock University</h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 text-center">Course Allocation System</h2>
          </div>
          
          <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0">
            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-1">Login to your account</h3>
              <p className="text-sm sm:text-base text-gray-600">Enter your details to login.</p>
            </div>
            
            <div className="w-full mb-4">
              <Button variant="outline" className="w-full h-10 sm:h-12 justify-center border-gray-300 text-gray-600 relative">
                <div className="absolute left-3">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base">Sign in with Google</span>
              </Button>
            </div>
            
            <div className="flex items-center my-5 sm:my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="px-3 sm:px-4 text-xs sm:text-sm text-gray-500">OR</div>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
                  Email Address<span className="text-blue-500">*</span>
                </label>
                <Input 
                  type="email" 
                  placeholder="hello@alignui.com" 
                  className="h-10 sm:h-12 text-sm sm:text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="mb-5 sm:mb-6">
                <label className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium">
                  Password<span className="text-blue-500">*</span>
                </label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••••" 
                    className="h-10 sm:h-12 pr-10 sm:pr-12 text-sm sm:text-base"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    variant="ghost"
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 text-gray-500 p-0 h-auto"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-5 sm:mb-6 gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                  />
                  <label htmlFor="remember" className="text-xs sm:text-sm text-gray-600 cursor-pointer">
                    Keep me logged in
                  </label>
                </div>
                <Button variant="link" className="p-0 h-auto text-xs sm:text-sm text-gray-600">
                  Forgot password?
                </Button>
              </div>
              
              <Button 
                className="w-full h-10 sm:h-12 bg-blue-800 hover:bg-blue-900 text-sm sm:text-base"
                onClick={handleLogin}
              >
                Login
              </Button>
            </div>
          </div>
          
          <div className="hidden sm:block mt-16 text-gray-600 text-xs sm:text-sm">
            © 2024 Babcock University
          </div>
        </div>
        
        {/* Right Section - Dashboard Preview */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-4 lg:p-6">
          <div className="w-full max-w-md lg:max-w-lg">
            <Card className="w-full p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,3L1,9L5,11.18V17.18L12,21L19,17.18V11.18L21,10.09V17H23V9L12,3Z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Course Allocation App</div>
                    <div className="text-xs text-gray-500">Academic 2023/1</div>
                  </div>
                </div>
                <div className="text-xs sm:text-sm font-medium">Dashboard</div>
              </div>
              
              <div className="mb-4">
                <div className="text-base sm:text-lg font-medium mb-1">Welcome HOD,</div>
                <div className="text-xs text-gray-500">Manage your teaching faculty and course allocation with ease. It's fast.</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-white border rounded-lg p-2 sm:p-3">
                  <div className="flex justify-between items-start">
                    <div className="text-xs sm:text-sm font-medium">Allocated Courses</div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400">◆</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">0</div>
                </div>
                <div className="bg-white border rounded-lg p-2 sm:p-3">
                  <div className="flex justify-between items-start">
                    <div className="text-xs sm:text-sm font-medium">Departmental Lecturers</div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500">◆</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">43</div>
                </div>
                <div className="bg-white border rounded-lg p-2 sm:p-3">
                  <div className="flex justify-between items-start">
                    <div className="text-xs sm:text-sm font-medium">Programs</div>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 text-green-500">◆</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">3</div>
                </div>
              </div>
              
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <div className="text-xs sm:text-sm font-medium">Allocation is incomplete</div>
                  <div className="flex items-center py-0.5 px-2 bg-blue-100 rounded-full text-xs text-blue-800">25%</div>
                </div>
                <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full">
                  <div className="w-1/4 h-full bg-blue-500 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  The system requires that you do the necessary setup steps, kindly see the instructions below.
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="text-xs sm:text-sm font-medium">Allocation Progress</div>
                </div>
                <Button variant="link" className="p-0 h-5 sm:h-6 text-xs text-blue-600">
                  Continue Allocation →
                </Button>
              </div>
              
              <div className="mt-4 sm:mt-10 text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Allocate your courses all in one go</h3>
                <p className="text-xs sm:text-sm text-gray-600">Assign lecturers to the courses they are to teach</p>
              </div>
              
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Mobile Footer */}
      <div className="sm:hidden flex items-center justify-between p-4 border-t mt-auto">
        <div className="text-xs text-gray-600">© 2024 Babcock University</div>
        <div className="flex items-center text-xs text-gray-600">
          <span>ENG</span>
          <ChevronDown size={14} className="ml-1" />
        </div>
      </div>
    </div>
  );
}