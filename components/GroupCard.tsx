import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Combobox } from "./ComboBox";
import { useQuery } from '@tanstack/react-query';
import { Lecturer } from "@/data/constants";
import { useAppContext } from '@/contexts/ContextProvider'

interface GroupCardProps {
  group: {
    id: number;
    name: string;
    lecturer: string;
    classSize: string;
    classOption: string;
  };
  onDelete?: (id: number) => void;
  onUpdate: (id: number, field: string, value: string) => void;
  showDelete?: boolean;
}

const GroupCard = ({ group, onDelete, onUpdate, showDelete = true }: GroupCardProps) => {
    const {setPageHeader, 
        fetchAllLecturers,
        fetchClassOptions,
        utoken, uid
    } = useAppContext();

    const queryResult = useQuery<Lecturer[]>({
        queryKey: ['lecturers'],
        queryFn: fetchAllLecturers
    });

    const { data: lecturers, isLoading: lecturersLoading } = queryResult;

    const classOptionQueryResult = useQuery<Lecturer[]>({
        queryKey: ['classOption'],
        queryFn: fetchClassOptions
    });

    const { data: class_options, isLoading: classOptionLoading } = classOptionQueryResult;
    
    return (
        <Card className="mb-6 relative group">
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
            <h3 className="font-medium text-lg">Group {String.fromCharCode(65 + group.id)}</h3>
            {showDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete && onDelete(group.id)}
              >
                <Trash size={18} />
                <span className="sr-only">Delete group</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-4 ">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='flex flex-col gap-2'>
                  {/* <label htmlFor={`lecturer-${group.id}`} className="text-sm font-medium block mb-1.5">
                    Lecturer's Name
                  </label> */}
                  <Combobox
                    value={group.lecturer}
                    onChange={(val) => onUpdate(group.id, 'lecturer', val)}
                    data={lecturers ?? []}
                    placeholder='Select a lecturer'
                    label="Lecturer's Name"
                  />

                  <Combobox
                    value={group.classOption}
                    onChange={(val) => onUpdate(group.id, 'classOption', val)}
                    data={class_options ?? []}
                    placeholder='Select a class option'
                    label="Class Option"
                  />
                  {/* <Select 
                    value={group.lecturer}
                    onValueChange={(value: any) => onUpdate(group.id, "lecturer", value)}
                  >
                    <SelectTrigger id={`lecturer-${group.id}`} className="w-full">
                      <SelectValue placeholder="Select a lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturers.map((lecturer) => (
                        <SelectItem key={lecturer} value={lecturer}>
                          {lecturer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                </div>
              
              
                <div>
                  <label htmlFor={`class-size-${group.id}`} className="text-sm font-medium block mb-1.5">
                    Class size
                  </label>
                  <Input
                    id={`class-size-${group.id}`}
                    type="number"
                    placeholder="Enter class size"
                    value={group.classSize}
                    onChange={(e) => onUpdate(group.id, "classSize", e.target.value)}
                  />
                </div>
                
                {/* <div>
                  <label htmlFor={`class-hours-${group.id}`} className="text-sm font-medium block mb-1.5">
                    Class hours
                  </label>
                  <Input
                    id={`class-hours-${group.id}`}
                    placeholder="Enter class hours"
                    value={group.classHours}
                    onChange={(e) => onUpdate(group.id, "classHours", e.target.value)}
                  />
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>
    );
}

export default GroupCard