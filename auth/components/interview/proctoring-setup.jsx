'use client';

import { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, ScreenShare, ScreenShareOff, Mic, MicOff, CheckCircle } from 'lucide-react';

export default function ProctoringSetup({ onSetupComplete }) {
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
    screen: false,
  });
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Request camera and microphone access
  useEffect(() => {
    const requestMediaAccess = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
        }

        setPermissions(prev => ({
          ...prev,
          camera: true,
          microphone: true,
        }));
      } catch (err) {
        console.error('Error accessing media devices:', err);
        setError('Could not access camera or microphone. Please check your permissions.');
      } finally {
        setIsLoading(false);
      }
    };

    requestMediaAccess();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScreenShare = async () => {
    try {
      if (permissions.screen) {
        // Stop screen sharing
        if (stream) {
          const videoTrack = stream.getVideoTracks().find(track => track.kind === 'video');
          if (videoTrack) videoTrack.stop();
          
          // Get a new stream with just the camera
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: permissions.microphone,
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
          setStream(newStream);
        }
        
        setPermissions(prev => ({ ...prev, screen: false }));
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        // Stop the existing stream
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }

        // Add screen share ended event
        screenStream.getVideoTracks()[0].onended = () => {
          setPermissions(prev => ({ ...prev, screen: false }));
          handleScreenShare(); // Fall back to camera
        };

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
        setStream(screenStream);
        setPermissions(prev => ({ ...prev, screen: true }));
      }
    } catch (err) {
      console.error('Error with screen sharing:', err);
      setError('Could not start screen sharing. Please try again.');
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setPermissions(prev => ({
          ...prev,
          microphone: audioTrack.enabled,
        }));
      }
    }
  };

  const handleStartInterview = () => {
    if (onSetupComplete) {
      onSetupComplete(stream);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-gray-700">Setting up your interview environment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Proctoring Setup</h2>
      
      {error && (
        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Video Preview */}
        <div className="w-full md:w-2/3 bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Controls */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Permissions</h3>
            
            {/* Camera Status */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                {permissions.camera ? (
                  <Video className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <VideoOff className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span>Camera</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                permissions.camera ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {permissions.camera ? 'Allowed' : 'Blocked'}
              </span>
            </div>
            
            {/* Microphone Status */}
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={toggleMicrophone}
            >
              <div className="flex items-center">
                {permissions.microphone ? (
                  <Mic className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <MicOff className="h-5 w-5 text-red-500 mr-2" />
                )}
                <span>Microphone</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                permissions.microphone ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {permissions.microphone ? 'Allowed' : 'Muted'}
              </span>
            </div>
            
            {/* Screen Share */}
            <div 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={handleScreenShare}
            >
              <div className="flex items-center">
                {permissions.screen ? (
                  <ScreenShare className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <ScreenShareOff className="h-5 w-5 text-gray-500 mr-2" />
                )}
                <span>Screen Share</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                permissions.screen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {permissions.screen ? 'Sharing' : 'Not Sharing'}
              </span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Proctoring Guidelines</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Ensure your face is clearly visible in the camera</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Close all unnecessary applications</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Ensure you're in a quiet, well-lit environment</span>
              </li>
            </ul>
          </div>
          
          <button
            onClick={handleStartInterview}
            disabled={!permissions.camera}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              permissions.camera 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } transition-colors`}
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
}
