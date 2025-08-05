import React from 'react'
import { EmptyFolderIcon } from '../../EmptyFolder'
import { Plus } from 'lucide-react'
import DepartmentModal from './DepartmentModal';

type EmptyPageProps = {
  title: string;
  desc: string;
  btnName: string;
  onAddDepartment?: () => void;
};

const EmptyPage: React.FC<EmptyPageProps> = ({title, desc, btnName, onAddDepartment}) => {
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
            
            <DepartmentModal btnName={btnName} onAddDepartment={onAddDepartment} />
        </div>
    </>
  )
}

export default EmptyPage