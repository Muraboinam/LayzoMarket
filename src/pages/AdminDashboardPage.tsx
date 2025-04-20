import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../data/admin';
import { defaultTemplates as initialTemplates, Template } from '../data/templates';
import Header from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Pencil, Trash2, Plus } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = '/admin/login';
      return;
    }
    
    const storedTemplates = localStorage.getItem('templates');
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    } else {
      setTemplates(initialTemplates);
      localStorage.setItem('templates', JSON.stringify(initialTemplates));
    }

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter(template => template.id !== id);
      setTemplates(updatedTemplates);
      localStorage.setItem('templates', JSON.stringify(updatedTemplates));
    }
  };

  const handleEdit = (id: string) => {
    window.location.href = `/admin/template/edit/${id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <main className="container mx-auto px-4 pt-24">
        <div 
          className="flex justify-between items-center mb-8 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.2, 20)}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <h1 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">
            Admin Dashboard
          </h1>
          <Button
            variant="primary"
            leftIcon={<Plus size={20} />}
            onClick={() => window.location.href = '/admin/template/new'}
            className="bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 transition-all duration-300 shadow-lg hover:shadow-amber-500/20"
          >
            Add New Template
          </Button>
        </div>

        <div 
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/10 opacity-0 animate-[fadeIn_0.8s_0.2s_ease-out_forwards]"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.1, 10)}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-amber-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-amber-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {templates.map((template, index) => (
                <tr 
                  key={template.id}
                  className="hover:bg-white/5 transition-colors duration-200 opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-white/20">
                        <img
                          className="h-12 w-12 object-cover transform hover:scale-110 transition-transform duration-300"
                          src={template.image}
                          alt={template.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {template.title}
                        </div>
                        <div className="text-sm text-gray-400">
                          By {template.author?.name || 'Unknown Author'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-500/20">
                      {template.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-300">
                    ${template.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      template.isFeatured
                        ? 'bg-amber-900/50 text-amber-300 border border-amber-500/20'
                        : 'bg-gray-800 text-gray-300 border border-gray-600'
                    }`}>
                      {template.isFeatured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mr-2 bg-white/5 hover:bg-white/10 text-white border-white/10"
                      leftIcon={<Pencil size={16} />}
                      onClick={() => handleEdit(template.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="error"
                      size="sm"
                      className="bg-red-900/50 hover:bg-red-900/70 text-red-300 border-red-500/20"
                      leftIcon={<Trash2 size={16} />}
                      onClick={() => handleDelete(template.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;