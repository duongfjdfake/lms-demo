import React from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';

interface StudentAttendanceViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  currentStudentId: string | null;
  onSelectStudent: (studentId: string) => void;
}

const StudentAttendanceView: React.FC<StudentAttendanceViewProps> = ({ students, attendance, currentStudentId, onSelectStudent }) => {
  
  const studentAttendance = attendance.filter(record => record.studentId === currentStudentId)
    .sort((a, b) => b.date.localeCompare(a.date));

  const getStatusInfo = (status: AttendanceStatus): { label: string; className: string } => {
    switch (status) {
      case 'present':
        return { label: 'Có mặt', className: 'bg-green-100 text-green-800' };
      case 'absent':
        return { label: 'Vắng', className: 'bg-red-100 text-red-800' };
      case 'late':
        return { label: 'Trễ', className: 'bg-yellow-100 text-yellow-800' };
      default:
        return { label: 'N/A', className: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Xem Lịch sử Điểm danh</h2>
            {students.length > 0 ? (
                <div>
                    <label htmlFor="student-select" className="block text-sm font-medium text-gray-700">Chọn tên của bạn:</label>
                    <select
                        id="student-select"
                        value={currentStudentId || ''}
                        onChange={(e) => onSelectStudent(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                        <option value="" disabled>-- Vui lòng chọn tên --</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <p className="text-center text-gray-500 py-4">Lớp học chưa có sinh viên nào.</p>
            )}
        </div>

        {currentStudentId && (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                    Kết quả điểm danh cho: {students.find(s => s.id === currentStudentId)?.name}
                </h3>
                 <div className="overflow-x-auto">
                    {studentAttendance.length > 0 ? (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {studentAttendance.map((record) => {
                                    const statusInfo = getStatusInfo(record.status);
                                    return (
                                        <tr key={record.date}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(record.date + 'T00:00:00').toLocaleDateString('vi-VN')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500 py-4">Chưa có dữ liệu điểm danh cho bạn.</p>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default StudentAttendanceView;
