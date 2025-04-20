import React, { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { isAuthenticated } from '../../data/admin';
import { Testimonial } from '../../types/testimonial';
import { getTestimonials, updateTestimonial, deleteTestimonial, addTestimonial } from '../../data/testimonials';

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>(getTestimonials());
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const isAdmin = isAuthenticated();

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      deleteTestimonial(id);
      setTestimonials(getTestimonials());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      updateTestimonial(editingTestimonial);
      setTestimonials(getTestimonials());
      setIsEditing(false);
      setEditingTestimonial(null);
    }
  };

  const handleAdd = () => {
    const newTestimonial: Omit<Testimonial, 'id'> = {
      quote: '',
      author: {
        name: '',
        role: '',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      },
      rating: 5,
    };
    addTestimonial(newTestimonial);
    setTestimonials(getTestimonials());
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't take our word for it. Here's what customers think about the quality of our templates and themes.
          </p>
          {isAdmin && (
            <Button
              variant="primary"
              onClick={handleAdd}
              className="mt-4"
              leftIcon={<Plus size={20} />}
            >
              Add Testimonial
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2 relative"
            >
              {isAdmin && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(testimonial)}
                    leftIcon={<Pencil size={16} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="error"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                    leftIcon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              )}
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-2xl ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              
              <blockquote className="text-gray-700 mb-6 text-center italic">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center justify-center">
                <img 
                  src={testimonial.author.avatar} 
                  alt={testimonial.author.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{testimonial.author.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditing && editingTestimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Edit Testimonial</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quote
                </label>
                <textarea
                  value={editingTestimonial.quote}
                  onChange={(e) => setEditingTestimonial({
                    ...editingTestimonial,
                    quote: e.target.value
                  })}
                  className="w-full border rounded-md p-2"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={editingTestimonial.author.name}
                  onChange={(e) => setEditingTestimonial({
                    ...editingTestimonial,
                    author: { ...editingTestimonial.author, name: e.target.value }
                  })}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author Role
                </label>
                <input
                  type="text"
                  value={editingTestimonial.author.role}
                  onChange={(e) => setEditingTestimonial({
                    ...editingTestimonial,
                    author: { ...editingTestimonial.author, role: e.target.value }
                  })}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={editingTestimonial.author.avatar}
                  onChange={(e) => setEditingTestimonial({
                    ...editingTestimonial,
                    author: { ...editingTestimonial.author, avatar: e.target.value }
                  })}
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditingTestimonial({
                        ...editingTestimonial,
                        rating: star
                      })}
                      className={`text-2xl ${star <= editingTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingTestimonial(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;