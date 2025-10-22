import { Search } from 'lucide-react'
import React from 'react'
import { Input } from './ui/input'

type SearchProp = {
  setSearchTerm: (value: string) => void;
};

const SearchTable: React.FC<SearchProp> = ({ setSearchTerm }) => {
  return (
    <>
        <div className="flex items-center gap-2">
            <div className="flex items-center p-2 pr-4 pl-4 rounded-lg bg-white shadow-md">
                <div className='relative '>
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
                    <Input placeholder="Search..." className="pl-8 bg-white w-[500px]" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
        </div>
    </>
  )
}

export default SearchTable