
import React from 'react';

interface FileViewerProps {
  fileUrl: string;
  fileType: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileUrl, fileType }) => {
  if (!fileUrl) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
            <p className="text-gray-500">Chọn một bài nộp để xem</p>
        </div>
    );
  }

  if (fileType.startsWith('image/')) {
    return (
      <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <img src={fileUrl} alt="Submission preview" className="max-w-full max-h-full object-contain" />
      </div>
    );
  }

  if (fileType === 'application/pdf') {
    return (
      <div className="w-full h-full">
        <embed src={fileUrl} type="application/pdf" className="w-full h-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
      <p className="text-red-500">Định dạng file không được hỗ trợ để xem trực tiếp.</p>
    </div>
  );
};

export default FileViewer;
