
"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Info, Plus } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from '@/contexts/ContextProvider'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ComboboxMain, Items } from "@/components/ComboboxMain";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

type UserModalProps = {
  btnName: string;
  onAddUser?: () => void;
};

const UserModal: React.FC<UserModalProps> = ({btnName, onAddUser}) => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [rank, setRank] = useState('');
    const [phone, setPhone] = useState('');
    const [qualification, setQualification] = useState('');
    const [areaOfSpecialization, setAreaOfSpecialization] = useState('');
    const [otherResponsibilities, setOtherResponsibilities] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null);

    const { 
        fetchDepartmentName,
        setIsUploading
    } = useAppContext();

    const { toast } = useToast()
    
    const handleCreateUser = async () => {
        if(!name || !gender || !email || !role || !rank || !phone || !qualification || !areaOfSpecialization || !selectedDepartment) {
            toast({
            variant: "destructive",
            title: "User Creation Failed",
            description: "Please fill in all required fields"
            })
            return;
        }

        const user_data = {
            name,
            gender,
            email,
            role,
            rank,
            phone,
            qualification,
            specialization: areaOfSpecialization,
            other_responsibilities: otherResponsibilities,
            department_id: selectedDepartment
        };

        try {
            const res = await fetch('/api/manage-uploads/user', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(user_data),
            });

            if (!res.ok) {
                const data = await res.json();
                toast({
                    variant: "destructive",
                    title: "Something is wrong",
                    description: data.error || "An unknown error occurred."
                });
                return;
            }

            const data = await res.json();
            if (onAddUser) onAddUser();
            toast({
                variant: "success",
                title: "User Creation Success",
                description: data.msg,
            });

            // Clear form
            setName('');
            setGender('');
            setEmail('');
            setRole('');
            setRank('');
            setPhone('');
            setQualification('');
            setAreaOfSpecialization('');
            setOtherResponsibilities('');
            setSelectedDepartment('');

        } catch (err) {
        toast({
            variant: "destructive",
            title: "User Creation Failed",
            description: (err as Error).message,
            });
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file){
        toast({
            variant: "destructive",
            title: "❌ Batch Upload Failed",
            description: 'No file selected.'
        });
        setFile(null);
        setOpen(false);
        return;
        }

        const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');

        if (!isCsv) {
        toast({
            variant: "destructive",
            title: "❌ Wrong File Type",
            description: 'Please upload a valid CSV file.'
        });
        setFile(null);
        return;
        }

        setFile(file);
    };

    const handleBatchUpload = async () => {
        setIsUploading(true);
        if (!file) {
        toast({
            variant: "destructive",
            title: "❌ Batch Upload Failed",
            description: 'No file selected.'
        });
        return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('department_id', selectedDepartment);

        try {
        
        const res = await fetch('/api/manage-uploads/user/batch', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {

            if (onAddUser) onAddUser();
            toast({
            variant: "success",
            title: "✅ Upload successful",
            description: data.message
            });
            
        } else {
            toast({
            variant: "destructive",
            title: "❌ Batch Upload Failed",
            description: data.error
            });
        }
        } catch (err) {
            alert('❌ Upload failed');
            console.error(err);
        }finally {
            setIsUploading(false);
            setOpen(false);
            setFile(null);
        }
    };

    const { data: departments = [], isLoading: loadingDepartments } = useQuery<Items[]>({
        queryKey: ["departments"],
        queryFn: fetchDepartmentName,
    });
    
  return (
    <>
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-700 hover:bg-blue-400 text-white">
                <Plus className="h-4 w-4" />
                { btnName }
                </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[800px] w-full">
                <DialogHeader>
                <div className="flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5 " />
                    <DialogTitle className="">Add a User</DialogTitle>
                </div>
                <DialogDescription className="text-center">
                    Fill in the form below to add a new user.
                </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 mt-4">
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Label htmlFor="department">Select Department</Label>
                            {!loadingDepartments && <ComboboxMain data={departments} onSelect={setSelectedDepartment} />}
                        </div>
                        <div className="w-full">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Label htmlFor="gender">Gender</Label>
                            <Input id="gender" type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" type="text" value={role} onChange={(e) => setRole(e.target.value)} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="rank">Rank</Label>
                            <Input id="rank" type="text" value={rank} onChange={(e) => setRank(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="w-full">
                            <Label htmlFor="qualification">Qualification</Label>
                            <Input id="qualification" type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} />
                        </div>
                    </div>
                    <div className="w-full">
                        <Label htmlFor="area_of_specialization">Area of Specialization</Label>
                        <Input id="area_of_specialization" type="text" value={areaOfSpecialization} onChange={(e) => setAreaOfSpecialization(e.target.value)} />
                    </div>
                    <div className="w-full">
                        <Label htmlFor="other_responsibilities">Other Responsibilities (Optional)</Label>
                        <Input id="other_responsibilities" type="text" value={otherResponsibilities} onChange={(e) => setOtherResponsibilities(e.target.value)} />
                    </div>
                    <Badge
                    variant="secondary"
                    className="bg-red-500 gap-3 mt-2 text-white dark:bg-blue-600"
                    >
                        <Info />
                        OR Use button below to upload a CSV file for batch upload.
                    </Badge>
                    <div className="grid w-full max-w-sm items-center gap-3">
                        <Label htmlFor="file">Batch Upload</Label>
                        <Input id="file" type="file" accept=".csv" onChange={handleFileChange} onClick={() => setOpen(true)} />
                    </div>
                    <div className='flex gap-2 justify-between mt-4'>
                        <DialogClose
                        className="w-full"
                        asChild>
                        <Button variant="outline" className="w-full">Cancel</Button>
                        </DialogClose>
                        <DialogClose
                        className="w-full"
                        asChild>
                        <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={open ? handleBatchUpload : handleCreateUser}>Create User</Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </>
  )
}

export default UserModal
