import React, { useState, useCallback } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ImageUploader({ onImagesUploaded }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    
    // Validate file count
    if (selectedFiles.length + fileArray.length > 5) {
      setError("Please select exactly 5 images");
      return;
    }

    // Validate file types
    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidFormat = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      return isImage && isValidFormat;
    });

    if (validFiles.length !== fileArray.length) {
      setError("Please upload only JPEG or PNG images");
      return;
    }

    setError("");
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreview = {
          file,
          url: e.target.result,
          id: Math.random().toString(36).substr(2, 9)
        };

        setPreviews(prev => {
          const newPreviews = [...prev, newPreview];
          if (newPreviews.length <= 5) {
            setSelectedFiles(prevFiles => [...prevFiles, file]);
          }
          return newPreviews.slice(0, 5);
        });
      };
      reader.readAsDataURL(file);
    });
  }, [selectedFiles.length]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeImage = useCallback((indexToRemove) => {
    setPreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setError("");
  }, []);

  const handleSubmit = useCallback(() => {
    if (previews.length === 5) {
      onImagesUploaded(previews);
    }
  }, [previews, onImagesUploaded]);

  return (
    <Card className="game-card border-0 rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Shay's Photos</h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Choose exactly 5 beautiful photos of Shay to create personalized games. These will be used across all three games!
          </p>
        </div>

        <div 
          className={`relative border-3 border-dashed rounded-2xl p-8 transition-all duration-300 ${
            dragActive 
              ? "border-purple-400 bg-purple-50" 
              : "border-gray-300 hover:border-purple-300 hover:bg-purple-25"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
        >
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="text-center">
            <div className="text-gray-600 mb-4">
              <p className="text-lg font-medium mb-2">Drop images here or click to browse</p>
              <p className="text-sm">PNG or JPEG files only • Exactly 5 images required</p>
            </div>
            <Button variant="outline" className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50">
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {previews.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Selected Images ({previews.length}/5)
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {previews.map((preview, index) => (
                <div key={preview.id} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={preview.url} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {Array.from({ length: 5 - previews.length }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  <Upload className="w-8 h-8" />
                </div>
              ))}
            </div>
            
            {previews.length === 5 && (
              <div className="text-center">
                <Button 
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Start Playing Games!
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
