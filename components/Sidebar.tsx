import React from 'react';
import { Role } from '../types';
import { UserIcon, TeacherIcon, UploadIcon, CalendarIcon } from './icons';

interface SidebarProps {
  currentRole: Role;
  currentView: 'submissions' | 'attendance';
  onRoleChange: (role: Role) => void;
  onViewChange: (view: 'submissions' | 'attendance') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentRole, currentView, onRoleChange, onViewChange }) => {
  const roleNavItems = [
    { role: 'student' as Role, label: 'Giao diện Sinh viên', icon: <UserIcon className="w-5 h-5 mr-3" /> },
    { role: 'teacher' as Role, label: 'Giao diện Giảng viên', icon: <TeacherIcon className="w-5 h-5 mr-3" /> },
  ];

  const viewNavItems = [
    { view: 'submissions', label: 'Quản lý Bài nộp', icon: <UploadIcon className="w-5 h-5 mr-3" /> },
    { view: 'attendance', label: 'Điểm danh', icon: <CalendarIcon className="w-5 h-5 mr-3" /> },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white h-screen fixed top-0 left-0 p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-10 mt-2">Simple LMS</h1>
      <nav>
        <p className="px-4 text-sm font-semibold text-gray-400 uppercase">Vai trò</p>
        <ul>
          {roleNavItems.map((item) => (
            <li key={item.role}>
              <button
                onClick={() => onRoleChange(item.role)}
                className={`w-full flex items-center px-4 py-3 my-1 text-left rounded-lg transition-colors duration-200 ${
                  currentRole === item.role
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <hr className="my-4 border-gray-600" />
        <p className="px-4 text-sm font-semibold text-gray-400 uppercase">Chức năng</p>
        <ul>
           {viewNavItems.map((item) => (
            <li key={item.view}>
              <button
                onClick={() => onViewChange(item.view as 'submissions' | 'attendance')}
                className={`w-full flex items-center px-4 py-3 my-1 text-left rounded-lg transition-colors duration-200 ${
                  currentView === item.view
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-center text-gray-400 text-xs">
          <p>Phát triển bởi AI</p>
          <p>&copy; 2024</p>
      </div>
    </div>
  );
};

export default Sidebar;
