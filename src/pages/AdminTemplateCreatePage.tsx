import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../data/admin';
import { Template } from '../types/template';
import { getTemplates } from '../data/templates';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import FileUpload from '../components/ui/FileUpload';

const categories = [
  'WordPress',
  'HTML',
  'React',
  'Vue.js',
  'Admin Templates',
  'UI Templates',
  'Landing Pages',
  'WooCommerce',
];

const AdminTemplateCreatePage: React.FC = () => {
  const [template, setTemplate] = useState<Partial<Template>>({
    title: '',
    description: '',
    fullDescription: '',
    price: 0,
    salePrice: undefined,
    image: '',
    additionalImages: [],
    videoUrl: '',
    category: categories[0],
    tags: [],
    templateFiles: '',
    livePreviewUrl: '',
    demoCredentials: {
      username: '',
      password: '',
    },
    status: 'draft',
    isFeatured: false,
    isNew: true,
  });

  const [tagInput, setTagInput] = useState('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
      return;
    }
  }, []);

  const handleMainImageSelect = (file: File) => {
    setMainImageFile(file);
    // Create a persistent URL for the image
    const imageUrl = URL.createObjectURL(file);
    setTemplate({
      ...template,
      image: imageUrl
    });
  };

  const handleAdditionalImageSelect = (file: File) => {
    setAdditionalImageFiles(prev => [...prev, file]);
    // Create a persistent URL for each additional image
    const imageUrl = URL.createObjectURL(file);
    setTemplate({
      ...template,
      additionalImages: [...(template.additionalImages || []), imageUrl]
    });
  };

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    // Create a persistent URL for the video
    const videoUrl = URL.createObjectURL(file);
    setTemplate({
      ...template,
      videoUrl: videoUrl
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert files to base64 strings for storage
    const mainImageBase64 = mainImageFile ? await fileToBase64(mainImageFile) : '';
    const additionalImagesBase64 = await Promise.all(
      additionalImageFiles.map(file => fileToBase64(file))
    );
    const videoBase64 = videoFile ? await fileToBase64(videoFile) : '';

    const templates = getTemplates();
    const newTemplate: Template = {
      ...(template as Template),
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      author: {
        name: 'Admin',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
        sales: 0,
      },
      salesCount: 0,
      rating: 0,
      ratingsCount: 0,
      image: mainImageBase64 || template.image,
      additionalImages: additionalImagesBase64.length > 0 ? additionalImagesBase64 : template.additionalImages,
      videoUrl: videoBase64 || template.videoUrl,
    };

    templates.push(newTemplate);
    localStorage.setItem('templates', JSON.stringify(templates));

    // Cleanup URLs
    if (template.image) URL.revokeObjectURL(template.image);
    template.additionalImages?.forEach(url => URL.revokeObjectURL(url));
    if (template.videoUrl) URL.revokeObjectURL(template.videoUrl);

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

  const handleAddTag = () => {
    if (tagInput.trim() && !template.tags?.includes(tagInput.trim())) {
      setTemplate({
        ...template,
        tags: [...(template.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTemplate({
      ...template,
      tags: template.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 neon-text">
            Create New Template
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
          >
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 neon-text">
                Basic Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Template Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={template.title}
                    onChange={(e) =>
                      setTemplate({ ...template, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Short Description *
                  </label>
                  <textarea
                    required
                    value={template.description}
                    onChange={(e) =>
                      setTemplate({ ...template, description: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Full Description
                  </label>
                  <textarea
                    value={template.fullDescription}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        fullDescription: e.target.value,
                      })
                    }
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 neon-text">
                Media
              </h2>

              <div className="space-y-4">
                <FileUpload
                  label="Main Image *"
                  onFileSelect={handleMainImageSelect}
                  accept="image/*"
                  description="Upload the main template preview image"
                />

                <FileUpload
                  label="Additional Images"
                  onFileSelect={handleAdditionalImageSelect}
                  accept="image/*"
                  description="Upload additional preview images"
                />

                <FileUpload
                  label="Video Preview"
                  onFileSelect={handleVideoSelect}
                  accept="video/*"
                  description="Upload a video preview of your template"
                />
              </div>
            </div>

            {/* Classification */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 neon-text">
                Classification
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Category *
                  </label>
                  <select
                    required
                    value={template.category}
                    onChange={(e) =>
                      setTemplate({ ...template, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Tags
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), handleAddTag())
                      }
                      className="block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-200 neon-bg"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 neon-text">
                Pricing
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Regular Price *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={template.price}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        price: Number(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={template.salePrice || ''}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        salePrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 neon-text">
                Additional Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Template Files URL
                  </label>
                  <input
                    type="url"
                    value={template.templateFiles}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        templateFiles: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Live Preview URL
                  </label>
                  <input
                    type="url"
                    value={template.livePreviewUrl}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        livePreviewUrl: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Demo Username
                    </label>
                    <input
                      type="text"
                      value={template.demoCredentials?.username}
                      onChange={(e) =>
                        setTemplate({
                          ...template,
                          demoCredentials: {
                            ...template.demoCredentials,
                            username: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Demo Password
                    </label>
                    <input
                      type="text"
                      value={template.demoCredentials?.password}
                      onChange={(e) =>
                        setTemplate({
                          ...template,
                          demoCredentials: {
                            ...template.demoCredentials,
                            password: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-neon-pink focus:ring-neon-pink sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 neon-text">
                Status
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center text-gray-300">
                    <input
                      type="radio"
                      checked={template.status === 'draft'}
                      onChange={() =>
                        setTemplate({ ...template, status: 'draft' })
                      }
                      className="text-neon-pink focus:ring-neon-pink"
                    />
                    <span className="ml-2">Draft</span>
                  </label>

                  <label className="inline-flex items-center text-gray-300">
                    <input
                      type="radio"
                      checked={template.status === 'published'}
                      onChange={() =>
                        setTemplate({ ...template, status: 'published' })
                      }
                      className="text-neon-pink focus:ring-neon-pink"
                    />
                    <span className="ml-2">Published</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.isFeatured}
                    onChange={(e) =>
                      setTemplate({ ...template, isFeatured: e.target.checked })
                    }
                    className="h-4 w-4 text-neon-pink focus:ring-neon-pink border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-white">
                    Feature this template on homepage
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/admin/dashboard')}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Template
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminTemplateCreatePage;