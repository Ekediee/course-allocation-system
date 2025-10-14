'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation"
import { useAppContext } from '@/contexts/ContextProvider';
import Cookies from 'js-cookie';
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from 'lucide-react'

// using zod for form validation
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/components/ui/toaster';
import CopyRight from "@/components/CopyRight";

const schema = z.object({
  umisid: z.string().min(5, { message: 'Min 5 characters' }),
  password: z.string().min(6, { message: 'Min 6 characters' }),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    username,
    setUsername,
    password,
    setPassword,
    login
  } = useAppContext()

  const {toast} = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();

  const onSubmit = async (values: FormData) => {
    
    // Handle login logic here
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/umis-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        // alert(data.error);
        const errorData = await res.json();
        const title =
          res.status === 401 ? 'Invalid credentials' :
          res.status === 403 ? 'Access denied' :
          'Login failed';

        toast({
          variant: "destructive",
          title,
          description: errorData.error
        });
        return;
      }

      if (res.ok) {
        // Wait for cookie to be set
        const data = await res.json();

        login(data.user.name, data.user.role, data.user.department, data.user.email);

        
        // Redirect based on role
        switch (data.user.role) {
          case 'hod':
            router.replace('/dashboard/hod');
            break;
          case 'lecturer':
            router.replace('/dashboard/lecturer');
            break;
          case 'vetter':
            router.replace('/dashboard/vetter');
            break;
          default:
            router.replace('/umis/login');
        }
      }


      
    } catch (err) {
      // setError('Login failed: ' + (err as Error).message);
      alert('Login failed '+ (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:px-12 md:max-w-[600px] mx-auto">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Image 
                src="/images/bu_logo.png" 
                alt="Babcock University Logo" 
                width={64}
                height={64}
                className="h-16 w-16 object-contain" 
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-800 text-center">Babcock University</h1>
            <h2 className="text-xl md:text-2xl font-bold text-blue-800 text-center">Course Allocation System</h2>
          </div>

          {/* Login Title */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Login with UMIS Credentials</h2>
            <p className="text-gray-600">Enter your details to login.</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="umisid" className="flex items-center mb-2">
                UMIS ID<span className="text-blue-500 ml-1">*</span>
              </Label>
              <Input
                id="umisid"
                // type="text"
                placeholder="enter your umis id"
                className="h-12"
                // value={username} 
                // onChange={(e) => setUsername(e.target.value)}
                // required
                {...register('umisid')}
              />
              {errors.umisid && <p className="text-red-600 text-sm">{errors.umisid.message}</p>}
            </div>
            
            <div className="mb-4">
              <Label htmlFor="password" className="flex items-center mb-2">
                Password<span className="text-blue-500 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  className="h-12 pr-10"
                  // value={password}
                  // onChange={(e) => setPassword(e.target.value)}
                  // required
                  {...register('password')}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? 
                    <EyeOffIcon className="h-5 w-5" /> : 
                    <EyeIcon className="h-5 w-5" />
                  }
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>
            
            {/* <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Keep me logged in
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div> */}
            
            <Button disabled={isSubmitting} type="submit" className="w-full h-12 bg-blue-800 hover:bg-blue-900">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="flex justify-center items-center mt-6 gap-2">
            <p className="text-sm text-gray-600">Admin User?</p>
            <Link href="/admin/login" className="flex justify-center item-center text-sm text-blue-600 hover:underline inline-block">
              Login Here <ArrowUpRight size={16} className="w-4 h-4" />
            </Link>
          </div>
          <Toaster />
        </div>

        {/* Footer */}
        <CopyRight />
      </div>

      {/* Right Section - Illustration */}
      <div className="hidden md:flex flex-1 bg-gray-50 items-center justify-center p-8">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold mb-2 text-center">Allocate your courses all in one go</h2>
          <p className="text-lg mb-8 text-center text-gray-600">Assign lecturers to the courses they are to teach</p>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Image 
              src="/images/Desktop - 280.png" 
              alt="Dashboard Preview" 
              width={600}
              height={400}
              className="w-full h-auto rounded-lg"
            />
          </div>

          {/* Pagination Dots */}
          {/* <div className="flex justify-center mt-8 space-x-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
            <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;