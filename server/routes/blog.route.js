import express from 'express';
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  upload,
} from '../controllers/blog.controller.js';
import { isAuthenticated} from '../middlewares/auth.middleware.js';
import { permission } from '../middlewares/access.middleware.js';

const router = express.Router();

// Public
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

// Admin-only with file upload support
router.post('/', isAuthenticated, permission, upload.single('coverImage'), createBlog);
router.put('/:id', isAuthenticated, permission, upload.single('coverImage'), updateBlog);
router.delete('/:id', isAuthenticated, permission, deleteBlog);

export default router;