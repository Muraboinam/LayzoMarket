import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../data/admin';
import { Template } from '../types/template';
import { getTemplates, updateTemplate } from '../data/templates';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import FileUpload from '../components/ui/FileUpload';
import { motion } from 'framer-motion';

const AdminTemplateEditPage: React.FC = () => {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
      return;
    }

    const id = window.location.pathname.split('/').pop();
    const templates = getTemplates();
    const foundTemplate = templates.find((t: Template) => t.id === id);
    if (foundTemplate) {
      setTemplate(foundTemplate);
    }
    setLoading(false);
  }, []);

  const handleMainImageSelect = (file: File) => {
    setMainImageFile(file);
    const imageUrl = URL.createObjectURL(file);
    setTemplate(template ? { ...template, image: imageUrl } : null);
  };

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    const videoUrl = URL.createObjectURL(file);
    setTemplate(template ? { ...template, videoUrl } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    let updatedTemplate = { ...template };

    if (mainImageFile) {
      const mainImageBase64 = await fileToBase64(mainImageFile);
      updatedTemplate.image = mainImageBase64;
    }

    if (videoFile) {
      const videoBase64 = await fileToBase64(videoFile);
      updatedTemplate.videoUrl = videoBase64;
    }

    updateTemplate(updatedTemplate);
    window.location.href = '/admin/dashboard';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center text-white">
        Template not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-8">
            Edit Template
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={template.title}
                    onChange={(e) => setTemplate({ ...template, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={template.description}
                    onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    value={template.price}
                    onChange={(e) => setTemplate({ ...template, price: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={template.category}
                    onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <FileUpload
                  label="Main Image"
                  onFileSelect={handleMainImageSelect}
                  accept="image/*"
                  description="Drag and drop or click to update the main image"
                />

                <FileUpload
                  label="Video Preview"
                  onFileSelect={handleVideoSelect}
                  accept="video/*"
                  description="Drag and drop or click to update the video preview"
                />

                <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg">
                  <input
                    type="checkbox"
                    checked={template.isFeatured}
                    onChange={(e) => setTemplate({ ...template, isFeatured: e.target.checked })}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                  />
                  <label className="text-sm text-white">
                    Featured Template
                  </label>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end space-x-4 pt-6 border-t border-white/10"
            >
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/admin/dashboard'}
                className="bg-white/5 hover:bg-white/10 text-white border-white/10"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white"
              >
                Save Changes
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminTemplateEditPage;