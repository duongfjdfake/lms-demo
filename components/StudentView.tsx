import React, { useState } from 'react';
import { Submission } from '../types';
import { UploadIcon, CheckCircleIcon, ClockIcon } from './icons';

interface StudentViewProps {
  submissions: Submission[];
  onSubmission: (file: File, studentName: string) => void;
  selectedClassId: string | null;
}

const StudentView: React.FC<StudentViewProps> = ({ submissions, onSubmission, selectedClassId }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        setSelectedFile(file);
        setError(null);
      } else {
        setSelectedFile(null);
        setError('Chỉ chấp nhận file ảnh hoặc PDF.');
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentName.trim()) {
      setError('Vui lòng nhập tên của bạn.');
      return;
    }
    if (selectedFile) {
      onSubmission(selectedFile, studentName.trim());
      setSelectedFile(null);
      setStudentName('');
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } else {
      setError('Vui lòng chọn một file để nộp.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Nộp bài tập</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="student-name" className="block text-sm font-medium text-gray-700">Tên sinh viên:</label>
            <input
              type="text"
              id="student-name"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                if (error) setError(null);
              }}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">Chọn file (Ảnh hoặc PDF):</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Tải file lên</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" />
                        </label>
                        <p className="pl-1">hoặc kéo thả</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF</p>
                </div>
            </div>
            {selectedFile && <p className="mt-2 text-sm text-gray-600">Đã chọn: {selectedFile.name}</p>}
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400" disabled={!selectedFile || !studentName || !selectedClassId}>
            Nộp bài
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Lịch sử nộp bài</h2>
        <div className="overflow-x-auto">
          {submissions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên file</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((sub) => (
                  <React.Fragment key={sub.id}>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.file.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.submittedAt.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {sub.grade !== null ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                            Đã chấm
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <ClockIcon className="w-4 h-4 mr-1.5" />
                            Chờ chấm
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {sub.grade !== null ? sub.grade : 'N/A'}
                      </td>
                    </tr>
                    {sub.feedback && (
                       <tr className="bg-gray-50">
                          <td colSpan={4} className="px-6 py-3 text-sm text-gray-700">
                            <p className="font-semibold">Nhận xét của giảng viên:</p>
                            <p className="pl-2 whitespace-pre-wrap">{sub.feedback}</p>
                          </td>
                        </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-4">Chưa có bài nộp nào cho lớp này.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentView;
