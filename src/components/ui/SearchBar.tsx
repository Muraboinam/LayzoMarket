import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getTemplates } from '../../data/templates';
import { Template } from '../../types/template';
import { Link } from './Link';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Template[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      const templates = getTemplates();
      const results = templates.filter(template => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          template.title.toLowerCase().includes(searchTerm) ||
          template.description.toLowerCase().includes(searchTerm) ||
          template.category.toLowerCase().includes(searchTerm) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      });
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className={`relative ${className}`}>
      <form className="relative" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search templates, themes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={handleBlur}
          className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
        />
        <button
          type="submit"
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"
        >
          <Search size={18} />
        </button>
      </form>

      {/* Search Results Dropdown */}
      {showResults && searchQuery.trim() && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((template) => (
                <Link
                  key={template.id}
                  href={`/template/${template.id}`}
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {template.title}
                      </h4>
                      <p className="text-xs text-gray-500">{template.category}</p>
                      <p className="text-sm font-medium text-primary">
                        ${template.salePrice || template.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500">No templates found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try different keywords or browse all templates
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;