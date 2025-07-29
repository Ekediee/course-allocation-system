import React from 'react'
import { EmptyFolderIcon } from '../../EmptyFolder'
import { Plus } from 'lucide-react'
import SchoolModal from './SchoolModal';

type EmptyPageProps = {
  title: string;
  desc: string;
  btnName: string;
  onAddSchool?: () => void;
};

const EmptyPage: React.FC<EmptyPageProps> = ({title, desc, btnName, onAddSchool}) => {
  return (
    <>
        <div className="flex flex-col items-center justify-center text-center mt-4 py-16 px-4 bg-blue-100 h-[510px] rounded-3xl">
                        
            <EmptyFolderIcon />
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
                {desc}
            </p>
            
            {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="h-4 w-4" />
                {btnName}
            </Button> */}
            {/* <SessionModal btnName={btnName} /> */}
            <SchoolModal btnName={btnName} onAddSchool={onAddSchool} />
        </div>
    </>
  )
}

export default EmptyPage