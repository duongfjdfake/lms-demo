import React, { useState, useEffect } from 'react';
import { Submission } from '../types';
import FileViewer from './FileViewer';

interface TeacherViewProps {
  submissions: Submission[];
  selectedSubmission: Submission | null;
  onSelectSubmission: (id: string) => void;
  onGradeSubmission: (id: string, grade: number, feedback: string) => void;
}

const TeacherView: React.FC<TeacherViewProps> = ({ submissions, selectedSubmission, onSelectSubmission, onGradeSubmission }) => {
  const [grade, setGrade] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (selectedSubmission) {
      setGrade(selectedSubmission.grade?.toString() || '');
      setFeedback(selectedSubmission.feedback || '');
    } else {
      setGrade('');
      setFeedback('');
    }
  }, [selectedSubmission]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGrade(e.target.value);
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubmission && grade !== '') {
      const numericGrade = parseFloat(grade);
      if (!isNaN(numericGrade) && numericGrade >= 0 && numericGrade <= 10) {
        onGradeSubmission(selectedSubmission.id, numericGrade, feedback);
      } else {
        alert("Vui lòng nhập điểm hợp lệ từ 0 đến 10.");
      }
    } else {
        alert("Vui lòng nhập điểm trước khi lưu.")
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-2rem)]">
      {/* Submissions List */}
      <div className="lg:col-span-1 bg-white p-4 rounded-lg shadow-md overflow-y-auto h-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 sticky top-0 bg-white pb-2">Danh sách bài nộp</h2>
        {submissions.length > 0 ? (
          <ul className="space-y-2">
            {submissions.map((sub) => (
              <li key={sub.id}>
                <button
                  onClick={() => onSelectSubmission(sub.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    selectedSubmission?.id === sub.id ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-semibold text-gray-800 truncate">{sub.studentName}</p>
                  <p className="text-sm text-gray-600 truncate">{sub.file.name}</p>
                   {sub.feedback && <p className="text-xs text-gray-500 mt-1 italic truncate">"{sub.feedback}"</p>}
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{sub.submittedAt.toLocaleDateString()}</p>
                    {sub.grade !== null ? (
                      <span className="px-2 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full">
                        Điểm: {sub.grade}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-200 rounded-full">
                        Chờ chấm
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 pt-10">Chưa có sinh viên nào nộp bài.</p>
        )}
      </div>

      {/* File Viewer and Grading */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-md flex flex-col h-full">
        <div className="flex-grow p-4 min-h-0">
          <FileViewer
            fileUrl={selectedSubmission?.fileURL || ''}
            fileType={selectedSubmission?.file?.type || ''}
          />
        </div>
        {selectedSubmission && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold mb-3">Chấm điểm cho {selectedSubmission.studentName}</h3>
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-grow">
                  <label htmlFor="grade-input" className="sr-only">Điểm</label>
                  <input
                    id="grade-input"
                    type="number"
                    value={grade}
                    onChange={handleGradeChange}
                    placeholder="Nhập điểm (0-10)"
                    min="0"
                    max="10"
                    step="0.1"
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Lưu điểm
                </button>
              </div>
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">Nhận xét:</label>
                <textarea
                  id="feedback"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Thêm nhận xét cho sinh viên..."
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherView;