import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Calendar, User, Tag, Share2, AlertCircle } from 'lucide-react';
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
  author?: {
    name: string;
    email: string;
  };
};

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchBlog = async () => {
    if (!slug) {
      setError('Invalid blog URL');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/blogs/${slug}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError('Blog not found');
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return;
      }

      const blogData: Blog = await res.json();
      setBlog(blogData);
      updatePageMeta(blogData);
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError('Failed to load blog. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePageMeta = (blogData: Blog) => {
    // Update document title
    const title = blogData.metaTitle || blogData.title;
    document.title = `${title} - Blog | Baraka Bites`;

    // Update meta description
    if (blogData.metaDescription) {
      let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = blogData.metaDescription;
    }
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

  const getImageUrl = (blog: Blog) => {
    return blog.coverImage || blog.image;
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.metaDescription || `Check out this blog post: ${blog.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying URL to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      console.log('URL copied to clipboard');
    });
  };

  const handleBackNavigation = () => {
    // Check if user came from within the app
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/blog');
    }
  };

  useEffect(() => {
    fetchBlog();
    
    // Reset meta tags when component unmounts
    return () => {
      document.title = 'Baraka Bites';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.remove();
      }
    };
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-cream min-h-screen mt-10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-primary font-medium">Loading blog post...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="bg-cream min-h-screen mt-10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {error === 'Blog not found' ? 'Blog Not Found' : 'Oops! Something went wrong'}
                </h1>
                <p className="text-gray-600 mb-6">
                  {error === 'Blog not found' 
                    ? "Sorry, we couldn't find the blog post you were looking for." 
                    : error || "We're having trouble loading this blog post."}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleBackNavigation}
                    className="w-full bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Go Back
                  </button>
                  <Link
                    to="/blog"
                    className="block w-full text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    View All Blogs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add custom styles to support Quill formatting */}
      <style>{`
        .blog-content .ql-align-center { text-align: center; }
        .blog-content .ql-align-right { text-align: right; }
        .blog-content .ql-align-left { text-align: left; }
        .blog-content .ql-align-justify { text-align: justify; }
        
        .blog-content .ql-size-small { font-size: 0.75em; }
        .blog-content .ql-size-large { font-size: 1.5em; }
        .blog-content .ql-size-huge { font-size: 2.5em; }
        
        .blog-content .ql-font-serif { font-family: Georgia, Times New Roman, serif; }
        .blog-content .ql-font-monospace { font-family: Monaco, Courier New, monospace; }
        
        .blog-content blockquote {
          border-left: 4px solid #ccc;
          margin-bottom: 5px;
          margin-top: 5px;
          padding-left: 16px;
        }
        
        .blog-content .ql-code-block-container {
          font-family: Consolas, 'Courier New', monospace;
          font-size: 85%;
          padding: 0.2em 0.4em;
          background-color: rgba(27, 31, 35, 0.05);
          border-radius: 3px;
        }
        
        .blog-content pre.ql-syntax {
          background-color: #23241f;
          color: #f8f8f2;
          overflow: visible;
          white-space: pre-wrap;
          margin-bottom: 5px;
          margin-top: 5px;
          padding: 5px 10px;
          border-radius: 3px;
        }
        
        .blog-content ul, .blog-content ol {
          padding-left: 1.5em;
        }
        
        .blog-content ul li {
          list-style-type: disc;
        }
        
        .blog-content ol li {
          list-style-type: decimal;
        }
        
        .blog-content a {
          color: #06c;
          text-decoration: underline;
        }
        
        .blog-content a:hover {
          color: #004d9f;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
        }
        
        .blog-content video {
          max-width: 100%;
          height: auto;
        }
        
        .blog-content h1 { font-size: 2em; font-weight: bold; margin: 0.67em 0; }
        .blog-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.75em 0; }
        .blog-content h3 { font-size: 1.17em; font-weight: bold; margin: 0.83em 0; }
        .blog-content h4 { font-size: 1em; font-weight: bold; margin: 1.12em 0; }
        .blog-content h5 { font-size: 0.83em; font-weight: bold; margin: 1.5em 0; }
        .blog-content h6 { font-size: 0.75em; font-weight: bold; margin: 1.67em 0; }
        
        .blog-content p { margin: 1em 0; line-height: 1.6; }
        
        .blog-content strong { font-weight: bold; }
        .blog-content em { font-style: italic; }
        .blog-content u { text-decoration: underline; }
        .blog-content s { text-decoration: line-through; }
        
        .blog-content sub { vertical-align: sub; font-size: smaller; }
        .blog-content sup { vertical-align: super; font-size: smaller; }
      `}</style>

      <div className="bg-cream min-h-screen mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            
            {/* Navigation */}
            <div className="mb-8">
              <button
                onClick={handleBackNavigation}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>

            {/* Blog Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 leading-tight">
                {blog.title}
              </h1>

              {/* Blog Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Published {formatDate(blog.createdAt)}</span>
                </div>

                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">•</span>
                    <span>Updated {formatDate(blog.updatedAt)}</span>
                  </div>
                )}

                {blog.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>By Baraka Bites</span>
                  </div>
                )}

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors ml-auto"
                  title="Share this post"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <Tag className="w-4 h-4 text-gray-500" />
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Featured Image */}
            {getImageUrl(blog) && (
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={getImageUrl(blog)}
                  alt={blog.title}
                  className="w-full h-64 md:h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}

            {/* Blog Content */}
            <article className="bg-white rounded-xl shadow-sm p-8 md:p-12">
              <div className="prose prose-lg md:prose-xl max-w-none blog-content">
                <div 
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }} 
                />
              </div>
            </article>

            {/* Footer Actions */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-gray-600 text-sm">
                    Enjoyed this post? Share it with your friends!
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Share Post
                  </button>
                  <Link
                    to="/blog"
                    className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors text-sm font-medium"
                  >
                    More Posts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;