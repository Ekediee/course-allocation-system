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

  // Find the selected option object based on initialValue
  const selectedOption = React.useMemo(() => {
    if (initialValue && Array.isArray(data)) {
      const foundItem = data.find(item => item.id === initialValue);
      if (foundItem) {
        return { value: foundItem.id, label: foundItem.name };
      }
    }
    return null;
  }, [initialValue, data]);

  return (
    <Select
      options={Array.isArray(data) ? data.map(item => ({ value: item.id, label: item.name })) : []}
      onChange={handleChange}
      placeholder="Select an Item"
      value={selectedOption}
      isSearchable
      className="text-black w-full"
      menuPlacement="auto"
    />
  );
}
