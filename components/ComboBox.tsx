'use client';

import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ComboboxProps {
  value: string | null;
  onChange: (value: string) => void;
  data: any[];
  placeholder?: string;
  label?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  onChange,
  data,
  placeholder,
  label,
}) => {
  const [open, setOpen] = useState(false);
    
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium block">{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search lecturer..." className="h-9" />
            <CommandEmpty>No lecturer found.</CommandEmpty>
            <CommandGroup>
              {data?.map((datavalue:any) => (
                <CommandItem
                  key={datavalue.id}
                  value={datavalue.id}
                  onSelect={() => {
                    onChange(datavalue.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === datavalue.name ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {datavalue.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
