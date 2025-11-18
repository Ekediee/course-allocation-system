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

// using zod for form validation
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from '@/components/ui/toaster';
import CopyRight from "@/components/CopyRight";

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
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
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (values: FormData) => {
    
    // Handle login logic here
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/login', {
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
          res.status === 400 ? 'Invalid credentials' :
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
          case 'vetter':
            router.replace('/dashboard/vetter');
            break;
          case 'superadmin':
            router.replace('/dashboard/vetter');
            break;
          case 'admin':
            router.replace('/vetter/course-allocations');
            break;
          default:
            router.replace('/');
        }
      }


      
    } catch (err) {
      // setError('Login failed: ' + (err as Error).message);
      alert('Login failed '+ (err as Error).message);
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
            <h2 className="text-2xl font-bold">Login to your account</h2>
            <p className="text-gray-600">Enter your details to login.</p>
          </div>

          {/* Google Sign In */}
          {/* <Button 
            variant="outline" 
            className="w-full h-12 mb-6 border border-gray-300 flex items-center justify-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 48 48" 
              width="24px" 
              height="24px"
            >
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            <span>Continue with Google</span>
          </Button>*/}

          {/* Divider */}
          {/* <div className="flex items-center mb-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>  */}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <Label htmlFor="email" className="flex items-center mb-2">
                Email Address<span className="text-blue-500 ml-1">*</span>
              </Label>
              <Input
                id="username"
                // type="text"
                placeholder="enter your username"
                className="h-12"
                // value={username} 
                // onChange={(e) => setUsername(e.target.value)}
                // required
                {...register('email')}
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
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
            
            <div className="flex items-center justify-between mb-6">
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
            </div>
            
            <Button disabled={isSubmitting || !isClient} type="submit" className="w-full h-12 bg-blue-800 hover:bg-blue-900">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
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