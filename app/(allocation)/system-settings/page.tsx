'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from '@/contexts/ContextProvider';

const SystemConfigsPage = () => {
    const {
        toggleMaintenanceMode,
        isInMaintenace,
        role, 
        email,
        isAllocationClosed,
        toggleCloseAllocationStatus
    } = useAppContext()


  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">System Configurations</h1>
        <p className="text-gray-500">Manage global application settings and states.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Control the overall state of the application for all users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            
            <div className="flex items-center gap-16 rounded-lg border p-4">
                {(role === 'superadmin' && email === 'ague@babcock.edu.ng') && (
                    <div className='flex items-center gap-2'>
                        <Label htmlFor="maintenance-mode" className="font-semibold">Maintenance Mode</Label>
                        <Switch
                            id="maintenance-mode"
                            checked={isInMaintenace}
                            onCheckedChange={toggleMaintenanceMode}
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-500"
                        />
                    </div>
                )}
                <div className="flex items-center gap-2">
                        <Label htmlFor="allocation-period" className="font-semibold">Close Allocation</Label>
                        <Switch 
                            id="allocation-period" 
                            checked={isAllocationClosed}
                            onCheckedChange={toggleCloseAllocationStatus}
                            className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-500" 
                        />
                </div>
            </div>
            
          
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemConfigsPage;