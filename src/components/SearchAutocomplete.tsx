import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUp, ArrowDown, Package, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { getImageUrl } from '@/config/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

interface SearchAutocompleteProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  placeholder = "ابحث عن المنتجات الغذائية...",
  className = "",
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      } else {
        setSearchResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Perform search
  const performSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const response = await api.searchAutocomplete(searchQuery, 4);
      // Ensure results is an array and has valid data
      const results = Array.isArray(response?.results) ? response.results.map((item: any) => ({
        ...item,
        type: item.type as 'product' | 'brand' | 'category'
      })) : [];
      setSearchResults(results);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setIsOpen(false);
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
      setIsOpen(false);
    }
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || searchResults.length === 0) {
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
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle search
  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      setIsOpen(false);
      setQuery('');
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
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  // Handle input focus
  const handleFocus = () => {
    if (searchResults.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
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
                      {result.price} د.ك
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

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 min-w-[400px]">
        <Search className="h-5 w-5 text-gray-400 ml-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="bg-transparent flex-1 outline-none text-sm placeholder-gray-500"
          autoComplete="off"
        />
        {isLoading && (
          <div className="ml-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
        <Button 
          size="sm" 
          className="rounded-full mr-2"
          onClick={handleSearch}
          disabled={!query.trim()}
        >
          بحث
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <Card 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 shadow-lg border-0 overflow-hidden"
        >
          <CardContent className="p-0">
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
            <div className="overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {isOpen && searchResults.length === 0 && query.length >= 2 && !isLoading && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border-0">
          <CardContent className="p-4 text-center">
            <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              لم يتم العثور على نتائج لـ "{query}"
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={handleSearch}
            >
              البحث الكامل
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchAutocomplete;
