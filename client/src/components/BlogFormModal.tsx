import React, { useState, useEffect, useMemo } from 'react';
import { X, AlertCircle, Eye, EyeOff } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type Blog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  coverImage?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt?: string;
};

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  existingBlog?: Blog | null;
};

const BlogFormModal: React.FC<Props> = ({ onClose, onSuccess, existingBlog }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    tags: '',
    metaTitle: '',
    metaDescription: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  const token = localStorage.getItem('token');
  const isEditing = Boolean(existingBlog);

  // React Quill modules configuration
  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'video'], 
      ['blockquote', 'code-block'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  // React Quill formats (removed image)
  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'direction', 'align',
    'link', 'video', // Removed 'image' from here
    'blockquote', 'code-block'
  ];

  // Initialize form data
  useEffect(() => {
    if (existingBlog) {
      setFormData({
        title: existingBlog.title || '',
        content: existingBlog.content || '',
        coverImage: existingBlog.coverImage || existingBlog.image || '',
        tags: existingBlog.tags?.join(', ') || '',
        metaTitle: existingBlog.metaTitle || '',
        metaDescription: existingBlog.metaDescription || '',
      });
    }
  }, [existingBlog]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle React Quill content change
  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Blog title is required');
      return false;
    }
    
    // Check if content is empty (React Quill returns '<p><br></p>' for empty content)
    const strippedContent = formData.content.replace(/<[^>]*>/g, '').trim();
    if (!strippedContent) {
      setError('Blog content is required');
      return false;
    }
    
    if (formData.title.trim().length > 200) {
      setError('Title must be less than 200 characters');
      return false;
    }
    
    if (formData.metaDescription && formData.metaDescription.length > 160) {
      setError('Meta description should be less than 160 characters for better SEO');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${existingBlog!._id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs`;

      const processedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const body = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        coverImage: formData.coverImage.trim() || undefined,
        tags: processedTags.length > 0 ? processedTags : undefined,
        metaTitle: formData.metaTitle.trim() || undefined,
        metaDescription: formData.metaDescription.trim() || undefined,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} blog`);
      }

      onSuccess();
    } catch (err) {
      console.error('Blog submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Close modal on Escape key
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getCharacterCount = (text: string, limit?: number) => {
    const count = text.length;
    const limitText = limit ? ` / ${limit}` : '';
    const isOverLimit = limit && count > limit;
    
    return (
      <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
        {count}{limitText}
      </span>
    );
  };

  // Get word count from HTML content
  const getWordCount = (htmlContent: string) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    const words = textContent ? textContent.split(/\s+/).length : 0;
    return words;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">
            {isEditing ? 'Edit Blog' : 'Create New Blog'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className={`grid ${showPreview ? 'grid-cols-2' : 'grid-cols-1'} gap-6 p-6`}>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Enter an engaging blog title..."
                  required
                  disabled={loading}
                />
                <div className="flex justify-end mt-1">
                  {getCharacterCount(formData.title, 200)}
                </div>
              </div>

              {/* Content with React Quill */}
              <div>
                <label className="block font-medium mb-2 text-gray-700">
                  Blog Content <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog content here..."
                    style={{
                      height: showPreview ? '180px' : '250px',
                    }}
                    readOnly={loading}
                  />
                </div>
                {/* Add spacing after Quill editor */}
                <div style={{ marginTop: showPreview ? '60px' : '80px' }}>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Use the toolbar to format your content with headings, lists, links, and more
                    </p>
                    <span className="text-xs text-gray-500">
                      {getWordCount(formData.content)} words
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block font-medium mb-2 text-gray-700">Cover Image URL</label>
                <input
                  type="url"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  value={formData.coverImage}
                  onChange={e => handleInputChange('coverImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={loading}
                />
                {formData.coverImage && (
                  <div className="mt-2">
                    <img 
                      src={formData.coverImage} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block font-medium mb-2 text-gray-700">Tags</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  value={formData.tags}
                  onChange={e => handleInputChange('tags', e.target.value)}
                  placeholder="recipe, cooking, dessert (comma-separated)"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple tags with commas
                </p>
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">SEO Settings</h3>
                
                {/* Meta Title */}
                <div className="mb-4">
                  <label className="block font-medium mb-2 text-gray-700">Meta Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    value={formData.metaTitle}
                    onChange={e => handleInputChange('metaTitle', e.target.value)}
                    placeholder="Custom title for search engines (optional)"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If empty, the blog title will be used
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block font-medium mb-2 text-gray-700">Meta Description</label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    value={formData.metaDescription}
                    onChange={e => handleInputChange('metaDescription', e.target.value)}
                    placeholder="Brief description for search engines (recommended: 120-160 characters)"
                    disabled={loading}
                  />
                  <div className="flex justify-end mt-1">
                    {getCharacterCount(formData.metaDescription, 160)}
                  </div>
                </div>
              </div>
            </form>

            {/* Preview */}
            {showPreview && (
              <div className="border-l pl-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  
                  {/* Title Preview */}
                  <div>
                    <h4 className="text-xl font-bold text-primary">
                      {formData.title || 'Blog Title'}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      Published on {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  {/* Image Preview */}
                  {formData.coverImage && (
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview" 
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}

                  {/* Tags Preview */}
                  {formData.tags && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.split(',').map((tag, index) => (
                        tag.trim() && (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="prose prose-sm max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: formData.content || '<p>Your blog content will appear here...</p>' 
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            type="button"
            className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Blog' : 'Create Blog'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogFormModal;