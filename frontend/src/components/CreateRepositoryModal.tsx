import React, { useState, ChangeEvent, FormEvent } from 'react';
import { BASE_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface CreateRepositoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  repo_name: string;
  description: string;
  visibility: 'Public' | 'Private';
}

const CreateRepositoryModal: React.FC<CreateRepositoryModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    repo_name: '',
    description: '',
    visibility: 'Public',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/repo/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',          
        },
        credentials:'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create repository');
      }

      const data = await response.json();
      toast.success("Created a repo")
      setIsSubmitting(false);
      onClose();
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message)
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create New Repository</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="repo_name" className="block text-sm font-medium mb-2">
              Repository Name
            </label>
            <input
              id="repo_name"
              type="text"
              name="repo_name"
              value={formData.repo_name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <span className="block text-sm font-medium mb-2">Visibility</span>
            <div className="flex space-x-4">
              {(['Public', 'Private'] as const).map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="visibility"
                    value={option}
                    checked={formData.visibility === option}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-700 focus:ring-blue-500"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-white rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Repository'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default CreateRepositoryModal;
