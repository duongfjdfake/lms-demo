import React, { useState, useMemo } from 'react';
import { Role, Submission, Student, AttendanceRecord, AttendanceStatus, Class } from './types';
import Sidebar from './components/Sidebar';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';
import TeacherAttendanceView from './components/TeacherAttendanceView';
import StudentAttendanceView from './components/StudentAttendanceView';
import ClassSelector from './components/ClassSelector';

function App() {
  const [role, setRole] = useState<Role>('student');
  const [view, setView] = useState<'submissions' | 'attendance'>('submissions');
  
  // State for classes - Pre-populated with 3 classes
  const [classes, setClasses] = useState<Class[]>([
    { id: 'class-1', name: 'Lập Trình C++' },
    { id: 'class-2', name: 'Lập trình Python' },
    { id: 'class-3', name: 'Lập trình Java' },
  ]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // State for submissions
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // State for attendance
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  // --- App Handlers ---
  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setSelectedClassId(null); // Reset class selection on role change
  };

  const handleViewChange = (newView: 'submissions' | 'attendance') => {
    setView(newView);
  };

  // --- Class Handlers ---
  const handleAddClass = (name: string) => {
    if (classes.some(c => c.name.toLowerCase() === name.toLowerCase())) {
        alert('Tên lớp đã tồn tại.');
        return;
    }
    const newClass: Class = {
        id: `cls_${Date.now()}`,
        name,
    };
    setClasses(prev => [...prev, newClass]);
  };

  const handleSelectClass = (id: string) => {
    setSelectedClassId(id);
    setSelectedSubmissionId(null);
    setCurrentStudentId(null);
  }

  // --- Submission Handlers ---
  const handleSubmission = (file: File, studentName: string) => {
    if (!selectedClassId) return;
    const newSubmission: Submission = {
      id: `sub_${Date.now()}`,
      classId: selectedClassId,
      studentName: studentName,
      file: file,
      fileURL: URL.createObjectURL(file),
      grade: null,
      feedback: null,
      submittedAt: new Date(),
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const handleSelectSubmission = (id: string) => {
    setSelectedSubmissionId(id);
  };

  const handleGradeSubmission = (id: string, grade: number, feedback: string) => {
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(sub =>
        sub.id === id ? { ...sub, grade: grade, feedback: feedback } : sub
      )
    );
  };

  // --- Attendance Handlers ---
  const handleAddStudent = (name: string) => {
    if (!selectedClassId) return;
    if (students.some(s => s.classId === selectedClassId && s.name.toLowerCase() === name.toLowerCase())) {
        alert('Sinh viên đã tồn tại trong lớp này.');
        return;
    }
    const newStudent: Student = {
        id: `stu_${Date.now()}`,
        classId: selectedClassId,
        name: name,
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleUpdateAttendance = (studentId: string, date: string, status: AttendanceStatus) => {
    setAttendance(prev => {
        const existingRecordIndex = prev.findIndex(rec => rec.studentId === studentId && rec.date === date);
        if (existingRecordIndex > -1) {
            const updatedAttendance = [...prev];
            updatedAttendance[existingRecordIndex] = { ...updatedAttendance[existingRecordIndex], status };
            return updatedAttendance;
        } else {
            return [...prev, { studentId, date, status }];
        }
    });
  };

  const handleSelectCurrentStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
  };


  // --- Memos for performance and filtering ---
  const submissionsForClass = useMemo(() => {
    return submissions
      .filter(s => s.classId === selectedClassId)
      .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
  }, [submissions, selectedClassId]);

  const teacherSubmissions = useMemo(() => {
    return [...submissionsForClass].sort((a, b) => {
      if (a.grade === null && b.grade !== null) return -1;
      if (a.grade !== null && b.grade === null) return 1;
      return b.submittedAt.getTime() - a.submittedAt.getTime();
    });
  }, [submissionsForClass]);

  const selectedSubmission = useMemo(() => {
    return submissions.find(sub => sub.id === selectedSubmissionId) || null;
  }, [selectedSubmissionId, submissions]);
  
  const studentsInClass = useMemo(() => {
    return students
        .filter(s => s.classId === selectedClassId)
        .sort((a,b) => a.name.localeCompare(b.name));
  }, [students, selectedClassId]);


  const renderContent = () => {
    if (!selectedClassId) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              {role === 'teacher' ? 'Vui lòng chọn hoặc tạo một lớp học để bắt đầu.' : 'Vui lòng chọn một lớp học để xem.'}
            </h2>
             {role === 'student' && classes.length === 0 && (
                <p className="mt-2 text-gray-500">Hiện chưa có lớp học nào được tạo. Vui lòng chờ giảng viên.</p>
             )}
          </div>
        </div>
      );
    }

    if (view === 'submissions') {
      return role === 'student' ? (
        <StudentView 
            submissions={submissionsForClass} 
            onSubmission={handleSubmission} 
            selectedClassId={selectedClassId}
        />
      ) : (
        <TeacherView 
          submissions={teacherSubmissions} 
          selectedSubmission={selectedSubmission}
          onSelectSubmission={handleSelectSubmission}
          onGradeSubmission={handleGradeSubmission}
        />
      );
    }

    if (view === 'attendance') {
        return role === 'student' ? (
            <StudentAttendanceView
                students={studentsInClass}
                attendance={attendance}
                currentStudentId={currentStudentId}
                onSelectStudent={handleSelectCurrentStudent}
            />
        ) : (
            <TeacherAttendanceView
                students={studentsInClass}
                attendance={attendance}
                onAddStudent={handleAddStudent}
                onUpdateAttendance={handleUpdateAttendance}
            />
        );
    }
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        currentRole={role} 
        currentView={view}
        onRoleChange={handleRoleChange} 
        onViewChange={handleViewChange}
      />
      <main className="flex-1 ml-64 p-8 bg-gray-100 flex flex-col">
        <ClassSelector 
            role={role}
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClass={handleSelectClass}
            onAddClass={handleAddClass}
        />
        <div className="flex-grow mt-6">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;