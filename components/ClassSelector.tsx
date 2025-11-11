import React, { useState } from 'react';
import { Role, Class } from '../types';

interface ClassSelectorProps {
  role: Role;
  classes: Class[];
  selectedClassId: string | null;
  onSelectClass: (id: string) => void;
  onAddClass: (name: string) => void;
}

const ClassSelector: React.FC<ClassSelectorProps> = ({ role, classes, selectedClassId, onSelectClass, onAddClass }) => {
  const [newClassName, setNewClassName] = useState('');

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      onAddClass(newClassName.trim());
      setNewClassName('');
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-grow min-w-[250px]">
          <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">
            {selectedClassId ? 'Lớp học hiện tại:' : 'Chọn một lớp học:'}
          </label>
          <select
            id="class-select"
            value={selectedClassId || ''}
            onChange={(e) => onSelectClass(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            disabled={classes.length === 0}
          >
            <option value="" disabled>
              -- {classes.length === 0 ? 'Chưa có lớp nào' : 'Vui lòng chọn một lớp'} --
            </option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {role === 'teacher' && (
          <form onSubmit={handleAddClassSubmit} className="flex items-end gap-2 flex-grow min-w-[300px]">
            <div className="flex-grow">
              <label htmlFor="new-class-name" className="block text-sm font-medium text-gray-700">
                Tạo lớp mới:
              </label>
              <input
                id="new-class-name"
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Ví dụ: Lập trình Web 101"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Thêm Lớp
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClassSelector;
