import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Crop as CropIcon, RotateCcw, Check, X } from 'lucide-react';
import GlassCard from './GlassCard';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropComplete, onCancel }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 60,
    x: 10,
    y: 20
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Set a default crop area
    const defaultCrop: Crop = {
      unit: '%',
      width: 80,
      height: 60,
      x: 10,
      y: 20
    };
    
    setCrop(defaultCrop);
  }, []);

  const resetCrop = useCallback(() => {
    setCrop({
      unit: '%',
      width: 80,
      height: 60,
      x: 10,
      y: 20
    });
  }, []);

  const getCroppedImg = useCallback(async (): Promise<File | null> => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `cropped-${Date.now()}.jpg`, {
            type: 'image/jpeg'
          });
          resolve(file);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop]);

  const handleCropComplete = useCallback(async () => {
    const croppedFile = await getCroppedImg();
    if (croppedFile) {
      onCropComplete(croppedFile);
    }
  }, [getCroppedImg, onCropComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <CropIcon className="h-5 w-5 text-primary-400" />
              <h3 className="text-xl font-semibold text-white">Crop Ingredient List</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          <p className="text-white/70 mb-6 text-center">
            Drag to select the ingredient list area for better text recognition
          </p>

          {/* Crop Area */}
          <div className="mb-6 flex justify-center">
            <div className="relative max-w-full">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={undefined}
                minWidth={50}
                minHeight={50}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Crop preview"
                  className="max-w-full max-h-96 object-contain"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={resetCrop}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-200"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reset Crop</span>
            </button>
            <button
              onClick={handleCropComplete}
              disabled={!completedCrop}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-primary hover:from-primary-600 hover:to-secondary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <Check className="h-5 w-5" />
              <span>Apply Crop</span>
            </button>
          </div>

          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </GlassCard>
    </div>
  );
};

export default ImageCropper;