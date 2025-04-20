import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../data/admin';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { categories } from '../data/categories';
import * as LucideIcons from 'lucide-react';

const AdminCategoryEditPage: React.FC = () => {
  const [category, setCategory] = useState({
    id: '',
    name: '',
    description: '',
    icon: '',
    count: 0,
    featured: false
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
      return;
    }

    const categoryId = window.location.pathname.split('/').pop();
    const foundCategory = categories.find(c => c.id === categoryId);
    
    if (foundCategory) {
      setCategory(foundCategory);
    } else {
      window.location.href = '/';
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedCategories = categories.map(c => 
      c.id === category.id ? category : c
    );
    
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    window.location.href = '/';
  };

  const iconOptions = Object.keys(LucideIcons).filter(
    key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Edit Category</h1>
          
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Name
              </label>
              <input
                type="text"
                value={category.name}
                onChange={(e) => setCategory({ ...category, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Description
              </label>
              <textarea
                value={category.description}
                onChange={(e) => setCategory({ ...category, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Icon
              </label>
              <select
                value={category.icon}
                onChange={(e) => setCategory({ ...category, icon: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon.toLowerCase()}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Count
              </label>
              <input
                type="number"
                value={category.count}
                onChange={(e) => setCategory({ ...category, count: parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={category.featured}
                onChange={(e) => setCategory({ ...category, featured: e.target.checked })}
                className="h-4 w-4 text-primary border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-200">
                Featured Category
              </label>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/'}
                className="bg-white/5 hover:bg-white/10 text-white"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="bg-primary hover:bg-primary-dark"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminCategoryEditPage;