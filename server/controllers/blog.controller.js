import Blog from '../models/blog.model.js';
import slugify from 'slugify';

export const createBlog = async (req, res) => {
  try {
    const { title, content, coverImage, tags, metaTitle, metaDescription } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    const blog = await Blog.create({
      title,
      slug,
      content,
      coverImage,
      tags,
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
    const { title, content, coverImage, tags, metaTitle, metaDescription } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, slug, content, coverImage, tags, metaTitle, metaDescription },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
