import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label: string;
  description?: string;
  className?: string;
}

const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250MB

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = "image/*",
  label,
  description,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    const isImage = file.type.startsWith('image/');
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    
    if (file.size > maxSize) {
      const sizeInMB = Math.round(file.size / (1024 * 1024));
      const maxSizeInMB = Math.round(maxSize / (1024 * 1024));
      setError(`File size (${sizeInMB}MB) exceeds maximum limit of ${maxSizeInMB}MB`);
      return false;
    }
    
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files && files[0] && validateFile(files[0])) {
      handleFile(files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0] && validateFile(e.target.files[0])) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
          transition-colors cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/10' 
            : error 
              ? 'border-red-500 bg-red-50/10' 
              : 'border-gray-600 hover:border-primary/50'
          }
        `}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {preview ? (
          accept.includes('image') ? (
            <img src={preview} alt="Preview" className="max-h-40 rounded-lg mb-4" />
          ) : (
            <video src={preview} className="max-h-40 rounded-lg mb-4" />
          )
        ) : (
          <Upload className="w-10 h-10 text-gray-400 mb-4" />
        )}
        
        <p className="text-sm text-gray-400 text-center">
          {description || `Drag and drop your file here, or click to select`}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {accept === 'image/*' 
            ? 'PNG, JPG, GIF up to 50MB' 
            : 'MP4, WebM up to 250MB'
          }
        </p>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;