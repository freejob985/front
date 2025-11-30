import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowUp, ArrowDown, Package, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: number;
  name: string;
  type: 'product' | 'brand' | 'category';
  image?: string;
  price?: string;
  category?: string;
  brand?: string;
  url: string;
  rating?: number;
  reviews_count?: number;
  stock?: number;
  is_fresh?: boolean;
  is_featured?: boolean;
}

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Perform search
  const performSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const response = await api.searchAutocomplete(searchQuery, 6);
      // Ensure results is an array and has valid data
      const results = Array.isArray(response?.results) ? response.results.map((item: any) => ({
        ...item,
        type: item.type as 'product' | 'brand' | 'category'
      })) : [];
      setSearchResults(results);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length < 2) {
      setSearchResults([]);
    }
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleResultClick(searchResults[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  // Handle search
  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'product') {
      // Navigate to search page with product filter instead of product details
      navigate(`/search?q=${encodeURIComponent(result.name)}&product_id=${result.id}`);
    } else if (result.type === 'brand') {
      navigate(`/search?q=${encodeURIComponent(result.name)}&brand=${result.id}`);
    } else if (result.type === 'category') {
      navigate(`/search?q=${encodeURIComponent(result.name)}&category=${result.id}`);
    }
    onClose();
  };

  // Render search result item
  const renderSearchResult = (result: SearchResult, index: number) => {
    if (!result || typeof result !== 'object') return null;
    
    const isSelected = index === selectedIndex;
    const imageUrl = result.image ? getImageUrl(result.image) : '/placeholder.svg';

    return (
      <div
        key={`${result.type}-${result.id}`}
        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors duration-150 ${
          isSelected 
            ? 'bg-blue-50 border-r-4 border-blue-500' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => handleResultClick(result)}
      >
        {/* Product Image */}
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
          <img
            src={imageUrl}
            alt={result.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {result.name}
              </h4>
              
              {result.type === 'product' && (
                <div className="flex items-center gap-2 mt-1">
                  {result.price && (
                    <span className="text-sm font-semibold text-green-600">
                      {result.price}
                    </span>
                  )}
                  
                  {result.rating && typeof result.rating === 'number' && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">
                        {result.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  
                  {result.stock !== undefined && typeof result.stock === 'number' && (
                    <Badge 
                      variant={result.stock > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {result.stock > 0 ? 'متوفر' : 'غير متوفر'}
                    </Badge>
                  )}
                </div>
              )}

              {(result.category || result.brand) && (
                <div className="flex items-center gap-2 mt-1">
                  {result.category && (
                    <span className="text-xs text-gray-500">
                      {result.category}
                    </span>
                  )}
                  {result.brand && (
                    <span className="text-xs text-gray-500">
                      • {result.brand}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Type Badge */}
            <div className="flex-shrink-0">
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  result.type === 'product' ? 'bg-green-50 text-green-700' :
                  result.type === 'brand' ? 'bg-blue-50 text-blue-700' :
                  'bg-purple-50 text-purple-700'
                }`}
              >
                {result.type === 'product' ? 'منتج' :
                 result.type === 'brand' ? 'ماركة' : 'قسم'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center">
      <div className="bg-white w-full max-w-md mx-4 mt-20 rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="ابحث عن المنتجات الغذائية..."
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="off"
            />
            {isLoading && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="flex flex-col max-h-96 overflow-hidden">
          {searchResults.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="px-4 py-2 bg-gray-50 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    نتائج البحث ({searchResults.length})
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <ArrowUp className="h-3 w-3" />
                    <ArrowDown className="h-3 w-3" />
                    <span>للتنقل</span>
                  </div>
                </div>
              </div>

              {/* Results List - Single scroll container */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {searchResults
                  .filter(result => result && typeof result === 'object')
                  .map((result, index) => renderSearchResult(result, index))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 border-t flex-shrink-0">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>اضغط Enter للبحث الكامل</span>
                  <span>ESC للإغلاق</span>
                </div>
              </div>
            </>
          ) : query.length >= 2 && !isLoading ? (
            <div className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                لم يتم العثور على نتائج لـ "{query}"
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSearch}
              >
                البحث الكامل
              </Button>
            </div>
          ) : query.length < 2 ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                اكتب كلمة أو أكثر للبحث
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MobileSearchModal;
