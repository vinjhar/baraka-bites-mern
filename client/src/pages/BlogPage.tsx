import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, Pencil, Trash2, Plus, Eye, AlertCircle } from 'lucide-react';
import BlogFormModal from '../components/BlogFormModal';
import { useNavigate } from 'react-router-dom';

type Blog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  coverImage?: string; // Added to match form modal
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt?: string;
};

type ApiResponse = {
  blogs?: Blog[];
  blog?: Blog;
  message?: string;
  success?: boolean;
};

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<string>('');
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data: ApiResponse = await res.json();
      
      // Handle different API response structures
      if (data.blogs) {
        setBlogs(data.blogs);
      } else if (Array.isArray(data)) {
        setBlogs(data as Blog[]);
      } else {
        setBlogs([]);
      }
    } catch (err) {
      console.error("Failed to fetch blogs", err);
      setError('Failed to load blogs. Please try again later.');
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAdminStatus = useCallback(async () => {
    if (!token) {
      setIsAdmin(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data?.user?.isAdmin === true);
      } else {
        setIsAdmin(false);
        // If token is invalid, remove it
        if (res.status === 401) {
          localStorage.removeItem('token');
        }
      }
    } catch (err) {
      console.error("Failed to fetch user info", err);
      setIsAdmin(false);
    }
  }, [token]);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog? This action cannot be undone.");
    if (!confirmDelete) return;

    setDeleteLoading(id);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (res.ok) {
        setBlogs(prev => prev.filter(b => b._id !== id));
        // Show success message briefly
        setError('');
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete blog');
      }
    } catch (err) {
      console.error("Delete failed", err);
      setError(err instanceof Error ? err.message : 'Failed to delete blog');
    } finally {
      setDeleteLoading('');
    }
  };

  const handleModalSuccess = useCallback(() => {
    setShowModal(false);
    setEditingBlog(null);
    fetchBlogs();
  }, [fetchBlogs]);

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  const getImageUrl = (blog: Blog) => {
    return blog.coverImage || blog.image;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    document.title = 'Blog - Baraka Bites';
    checkAdminStatus();
    fetchBlogs();
  }, [checkAdminStatus, fetchBlogs]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-cream py-16 min-h-screen mt-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8 mt-8">
              <Loader2 className="w-12 h-12 text-primary/50 mx-auto mb-4 animate-spin" />
              <p className="text-primary font-medium">Loading blog articles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream py-16 min-h-screen mt-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Baraka Bites <span className="text-gold">Blog</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover delicious recipes, cooking tips, and food stories from our kitchen to yours.
            </p>
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex justify-end mb-6">
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add New Blog
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Blog Content */}
          {blogs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-primary mb-2">No blogs published yet</h3>
                <p className="text-gray-600 mb-4">
                  {isAdmin ? "Ready to share your first story? Click 'Add New Blog' to get started!" : "Check back soon for delicious content!"}
                </p>
                {isAdmin && (
                  <button
                    onClick={handleAddNew}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Create First Blog
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {blogs.map(blog => (
                <article key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Blog Image - Smaller and on the side for larger screens */}
                    {getImageUrl(blog) && (
                      <div className="md:w-80 md:flex-shrink-0">
                        <div className="h-48 md:h-full w-full overflow-hidden">
                          <img 
                            src={getImageUrl(blog)} 
                            alt={blog.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Blog Content */}
                    <div className="p-6 flex-1">
                      <div className="mb-3">
                        <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-500 text-sm">
                          Published on {formatDate(blog.createdAt)}
                          {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                            <span className="ml-2">• Updated {formatDate(blog.updatedAt)}</span>
                          )}
                        </p>
                      </div>

                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {blog.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta Description Preview */}
                      {blog.metaDescription && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {blog.metaDescription}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                        <button
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                          onClick={() => navigate(`/blog/${blog.slug}`)}
                        >
                          <Eye className="w-4 h-4" /> Read More
                        </button>
                        
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleEdit(blog)}
                              className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 transition-colors"
                            >
                              <Pencil className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              disabled={deleteLoading === blog._id}
                              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              {deleteLoading === blog._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <BlogFormModal
          onClose={() => {
            setShowModal(false);
            setEditingBlog(null);
          }}
          onSuccess={handleModalSuccess}
          existingBlog={editingBlog}
        />
      )}
    </div>
  );
};

export default BlogPage;