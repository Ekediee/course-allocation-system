import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LevelModalProps {
    btnName: string;
    onAddLevel: () => void;
}

const LevelModal: React.FC<LevelModalProps> = ({ btnName, onAddLevel }) => {
    const [levelName, setLevelName] = useState('');
    const { toast } = useToast();

    const handleAddLevel = async () => {
        if(levelName == "") {
            toast({
            variant: "destructive",
            title: "Level Creation Failed",
            description: "Please fill in all fields"
            })
            return;
        }

        const level_data = {
            name: levelName,
        };

        try {
            const res = await fetch('/api/manage-uploads/level', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(level_data),
            });

            if (res.status.toString().startsWith("40")) {
                const data = await res.json();
                toast({
                    variant: "destructive",
                    title: "Something is wrong",
                    description: data.error
                });
                return;
            }

            if (res.ok) {
                const data = await res.json();
                if (onAddLevel) onAddLevel();
                toast({
                    variant: "success",
                    title: "Level Upload Success",
                    description: data.msg,
                });
            }
        } catch (err) {
        toast({
            variant: "destructive",
            title: "Level Upload Failed",
            description: (err as Error).message,
            });
        }
        setLevelName("")
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="bg-blue-700 hover:bg-blue-400 text-white">
                        <Plus className="h-4 w-4" />
                        {btnName}
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center justify-center gap-2">
                            <Plus className="h-5 w-5 " />
                            <DialogTitle className="">Add a Level</DialogTitle>
                        </div>
                        <DialogDescription className="text-center">
                            Specify the Name for the Level
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 mt-4">
                        <div className="flex flex-col gap-2 ">
                            <Label htmlFor="level">Level Name</Label>
                            <input
                                id="level"
                                type="text"
                                placeholder="e.g. 100"
                                className="border p-2 rounded mb-2"
                                value={levelName}
                                onChange={(e) => setLevelName(e.target.value)}
                                required
                            />
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
                                <Button className="w-full bg-blue-700 hover:bg-blue-400" onClick={handleAddLevel}>Create Level</Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LevelModal;