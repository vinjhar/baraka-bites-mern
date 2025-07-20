import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller.js';
import { isAuthenticated} from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/admin.middleware.js';

const router = express.Router();

// Public
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

// Admin-only
router.post('/', isAuthenticated, isAdmin, createBlog);
router.put('/:id', isAuthenticated, isAdmin, updateBlog);
router.delete('/:id', isAuthenticated, isAdmin, deleteBlog);

export default router;
