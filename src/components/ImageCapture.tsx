import React, { useRef, useState, useCallback } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';
import GlassCard from './GlassCard';

interface ImageCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and create preview
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        setCapturedBlob(blob);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setCapturedBlob(null);
    startCamera();
  }, [capturedImage, startCamera]);

  const confirmPhoto = useCallback(() => {
    if (!capturedBlob) return;

    const file = new File([capturedBlob], `captured-${Date.now()}.jpg`, {
      type: 'image/jpeg'
    });
    
    onCapture(file);
  }, [capturedBlob, onCapture]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Capture Ingredient List</h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-error-600/20 border border-error-500/30 rounded-lg">
              <p className="text-error-300 text-sm">{error}</p>
            </div>
          )}

          {/* Camera/Preview Area */}
          <div className="relative mb-6">
            {capturedImage ? (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
                <div className="absolute inset-0 border-2 border-dashed border-primary-400/50 rounded-lg pointer-events-none"></div>
                <div className="absolute top-2 left-2 right-2 text-center">
                  <p className="text-white/90 text-sm bg-black/70 rounded px-2 py-1 inline-block">
                    Photo captured successfully
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 md:h-80 object-cover rounded-lg bg-black"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera overlay guides */}
                {isStreaming && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-4 border-2 border-dashed border-primary-400/50 rounded-lg"></div>
                    <div className="absolute top-2 left-2 right-2 text-center">
                      <p className="text-white/80 text-sm bg-black/50 rounded px-2 py-1 inline-block">
                        Position ingredient list within the frame
                      </p>
                    </div>
                  </div>
                )}
                
                {!isStreaming && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <p className="text-white/70">Starting camera...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {capturedImage ? (
              <>
                <button
                  onClick={retakePhoto}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200"
                >
                  <RotateCcw className="h-5 w-5" />
                  <span>Retake</span>
                </button>
                <button
                  onClick={confirmPhoto}
                  disabled={!capturedBlob}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Check className="h-5 w-5" />
                  <span>Use Photo</span>
                </button>
              </>
            ) : (
              <button
                onClick={capturePhoto}
                disabled={!isStreaming}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <Camera className="h-6 w-6" />
                <span>Capture Photo</span>
              </button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ImageCapture;