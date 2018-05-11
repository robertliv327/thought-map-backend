import mongoose, { Schema } from 'mongoose';

// create a PostSchema with a title field
const PostSchema = new Schema({
  title: String,
  tags: String,
  content: String,
  cover_url: String,
  x: Number,
  y: Number,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  username: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

// create PostModel class from schema
const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
