import React, { useState, useMemo } from 'react';
import { Student, AttendanceRecord, AttendanceStatus } from '../types';

interface TeacherAttendanceViewProps {
  students: Student[];
  attendance: AttendanceRecord[];
  onAddStudent: (name: string) => void;
  onUpdateAttendance: (studentId: string, date: string, status: AttendanceStatus) => void;
}

const TeacherAttendanceView: React.FC<TeacherAttendanceViewProps> = ({ students, attendance, onAddStudent, onUpdateAttendance }) => {
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudentName.trim()) {
      onAddStudent(newStudentName.trim());
      setNewStudentName('');
    }
  };

  const attendanceForDate = useMemo(() => {
    const studentIdsInClass = new Set(students.map(s => s.id));
    const records = new Map<string, AttendanceStatus>();
    attendance
      .filter(record => record.date === selectedDate && studentIdsInClass.has(record.studentId))
      .forEach(record => {
        records.set(record.studentId, record.status);
      });
    return records;
  }, [attendance, selectedDate, students]);

  const statusOptions: { value: AttendanceStatus; label: string; color: string }[] = [
    { value: 'present', label: 'Có mặt', color: 'bg-green-500' },
    { value: 'absent', label: 'Vắng', color: 'bg-red-500' },
    { value: 'late', label: 'Trễ', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quản lý Sinh viên trong Lớp</h2>
        <form onSubmit={handleAddStudent} className="flex items-end gap-4">
          <div className="flex-grow">
            <label htmlFor="new-student-name" className="block text-sm font-medium text-gray-700">Tên sinh viên mới:</label>
            <input
              id="new-student-name"
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Thêm sinh viên vào lớp hiện tại"
            />
          </div>
          <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Thêm
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Điểm danh</h2>
            <div>
                 <label htmlFor="attendance-date" className="block text-sm font-medium text-gray-700 text-right">Chọn ngày:</label>
                <input
                    type="date"
                    id="attendance-date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
        </div>
        
        <div className="overflow-x-auto">
          {students.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sinh viên</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <fieldset>
                        <legend className="sr-only">Trạng thái điểm danh cho {student.name}</legend>
                        <div className="flex items-center gap-4">
                          {statusOptions.map(option => (
                            <div key={option.value} className="flex items-center">
                              <input
                                id={`${student.id}-${option.value}`}
                                name={`status-${student.id}`}
                                type="radio"
                                checked={attendanceForDate.get(student.id) === option.value}
                                onChange={() => onUpdateAttendance(student.id, selectedDate, option.value)}
                                className={`h-4 w-4 border-gray-300 focus:ring-blue-500 text-blue-600`}
                              />
                              <label htmlFor={`${student.id}-${option.value}`} className="ml-2 block text-sm font-medium text-gray-700">{option.label}</label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-4">Chưa có sinh viên nào trong lớp này. Hãy thêm sinh viên ở trên.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendanceView;
