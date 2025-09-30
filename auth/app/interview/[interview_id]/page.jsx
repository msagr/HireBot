'use client';

import { useState, useRef } from 'react';
import { Upload, User, Mail, Phone, Bot, Loader2, Video, VideoOff } from 'lucide-react';
import { extractResumeInfo } from '@/lib/resumeParser';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// Dynamically import the ProctoringSetup component with no SSR
const ProctoringSetup = dynamic(
  () => import('@/components/interview/proctoring-setup'),
  { ssr: false }
);

// Simple toast notification component
const Toast = ({ message, type = 'error' }) => {
  if (!message) return null;
  
  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
      type === 'error' ? 'bg-red-500' : 'bg-green-500'
    } text-white`}>
      {message}
    </div>
  );
};

export default function InterviewPage({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    fileName: 'No file chosen'
  });
  const [showProctoringSetup, setShowProctoringSetup] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'error') => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    
    setToast({ message, type });
    
    // Auto-hide after 5 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('File size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        resume: file,
        fileName: file.name
      }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('File size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        resume: file,
        fileName: file.name
      }));
    } else {
      showToast('Please upload a PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      showToast('Please fill in all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address');
      return;
    }
    
    // If resume is uploaded, parse it
    if (formData.resume) {
      try {
        setIsParsing(true);
        const resumeData = await extractResumeInfo(formData.resume);
        // You can use the parsed resume data here if needed
        console.log('Parsed resume data:', resumeData);
      } catch (error) {
        console.error('Error parsing resume:', error);
        setParseError('Failed to parse resume. Please check the file and try again.');
        return;
      } finally {
        setIsParsing(false);
      }
    }
    
    // Proceed to proctoring setup
    setShowProctoringSetup(true);
  };

  const handleProctoringComplete = async (stream) => {
    try {
      setMediaStream(stream);
      
      // Fetch test data
      const response = await fetch(`/api/tests/${params.interview_id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch test data');
      }

      const testData = await response.json();
      
      if (!testData.questions || testData.questions.length === 0) {
        throw new Error('No questions found for this test');
      }

      // Store test data in localStorage
      localStorage.setItem('interviewTestData', JSON.stringify(testData));
      
      // Navigate to the interview session
      router.push(`/interview/${params.interview_id}/session`);
    } catch (err) {
      console.error('Failed to start interview:', err);
      showToast('Failed to start interview. Please try again.');
    }
  };

  if (showProctoringSetup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ProctoringSetup onComplete={handleProctoringComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Interview Setup</h1>
          <p className="mt-2 text-gray-600">Please fill in your details to start the interview</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume (Optional)
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="resume-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="resume-upload"
                      name="resume-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 5MB</p>
                {formData.fileName && (
                  <p className="text-sm text-gray-900 mt-2">{formData.fileName}</p>
                )}
              </div>
            </div>
            {isParsing && (
              <div className="mt-2 text-sm text-gray-500 flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Parsing resume...
              </div>
            )}
            {parseError && (
              <p className="mt-2 text-sm text-red-600">{parseError}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isParsing}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isParsing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isParsing ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Processing...
                </>
              ) : (
                'Continue to Proctoring Setup'
              )}
            </button>
          </div>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
