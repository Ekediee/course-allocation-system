"use client"

import * as React from "react"

import Select from 'react-select';
import { useAppContext } from '@/contexts/ContextProvider'

export type Items = {
  id: string;
  name: string;
}

type ComboboxDemoProps = {
  data?: Items[];
}

export const ComboboxMain: React.FC<ComboboxDemoProps> = ({data}) => {
  const { setSelectedOption } = useAppContext();

  const handleChange = (option: any) => {
    setSelectedOption(option.value);
    // console.log('Selected:', option.value);
  };

  return (
    <Select
      options={Array.isArray(data) ? data.map(item => ({ value: item.id, label: item.name })) : []}
      onChange={handleChange}
      placeholder="Select an Item"
      isSearchable
      className="text-black"
    />
  );
}
