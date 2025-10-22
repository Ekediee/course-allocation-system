"use client"

import * as React from "react"

import Select from 'react-select';
// import { useAppContext } from '@/contexts/ContextProvider'

export type Items = {
  id: string;
  name: string;
}

type ComboboxDemoProps = {
  data?: Items[];
  onSelect: (value: string) => void;
  initialValue?: string;
}

export const ComboboxMain: React.FC<ComboboxDemoProps> = ({data, onSelect, initialValue}) => {
  // const { setSelectedOption } = useAppContext();

  const handleChange = (option: any) => {
    onSelect(option.value);
    
  };

  return (
    <Select
      options={Array.isArray(data) ? data.map(item => ({ value: item.id, label: item.name })) : []}
      onChange={handleChange}
      placeholder="Select an Item"
      // value={initialValue ? { value: initialValue, label: initialValue } : null}
      isSearchable
      className="text-black w-full"
    />
  );
}
