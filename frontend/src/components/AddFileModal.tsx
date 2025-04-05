import React, { useState, useRef } from 'react';

interface AddFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelected: (file: File) => void;
}

const AddFileModal: React.FC<AddFileModalProps> = ({ isOpen, onClose, onFileSelected }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setSelectedFile(file || null);
  };

  const handleAddFile = () => {
    if (selectedFile) {
      onFileSelected(selectedFile);
      onClose();
    }
  };

  const handleOpenFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

 

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add File</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
            Choose a file to upload
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <button
            type="button"
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-700 transition-colors"
            onClick={handleOpenFileExplorer}
          >
            {selectedFile ? selectedFile.name : 'Select File'}
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddFile}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded ${
              selectedFile ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-400 cursor-not-allowed'
            } transition-colors`}
          >
            Add File
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;
