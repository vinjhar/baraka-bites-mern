import Blog from '../models/blog.model.js';
import slugify from 'slugify';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/blogs';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, metaTitle, metaDescription } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    // Handle cover image - either uploaded file or URL
    let coverImage = '';
    if (req.file) {
      // If file is uploaded, use the file path
      coverImage = `/uploads/blogs/${req.file.filename}`;
    } else if (req.body.coverImage) {
      // If URL is provided, use the URL
      coverImage = req.body.coverImage;
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      coverImage,
      tags: tags ? JSON.parse(tags) : [],
      metaTitle,
      metaDescription,
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { title, content, tags, metaTitle, metaDescription } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    // Get existing blog to handle image update
    const existingBlog = await Blog.findById(req.params.id);
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Handle cover image update
    let coverImage = existingBlog.coverImage;
    if (req.file) {
      // If new file is uploaded, use the new file path
      coverImage = `/uploads/blogs/${req.file.filename}`;
      
      // Delete old image file if it exists and is not a URL
      if (existingBlog.coverImage && existingBlog.coverImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), existingBlog.coverImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else if (req.body.coverImage !== undefined) {
      // If URL is provided or explicitly set to empty, use that
      coverImage = req.body.coverImage;
      
      // If switching from file to URL or removing image, delete old file
      if (existingBlog.coverImage && existingBlog.coverImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(process.cwd(), existingBlog.coverImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        slug, 
        content, 
        coverImage, 
        tags: tags ? JSON.parse(tags) : [],
        metaTitle, 
        metaDescription 
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Delete associated image file if it exists
    if (blog.coverImage && blog.coverImage.startsWith('/uploads/')) {
      const imagePath = path.join(process.cwd(), blog.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};