import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true, // should contain HTML or markdown
    },
    coverImage: {
      type: String, // URL to uploaded image or external URL
      required: false, // Made optional since image can be uploaded or URL
    },
    tags: {
      type: [String],
      default: [],
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Blog', BlogSchema);