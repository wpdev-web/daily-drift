const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const Post = require('../modal/post');
exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
      });
    })
    .catch(err => {
      console.error('Error fetching posts:', err);
      if (!err.statusCode) {
        err.statusCode = 500; // Internal Server Error
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error=new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422; // Unprocessable Entity
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422; // Unprocessable Entity
    throw error;
  }
  const imageUrl = req.file.path.replace('\\', '/'); // Ensure the path is correct
  console.log('Image URL:', imageUrl);
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: 'John Doe' }
  });
  post.save()
    .then(result => {
      console.log('Post created:', result);
        res.status(201).json({
          message: 'Post created successfully!',
          post: result
      });
    })
    .catch(err => {
      console.error('Error creating post:', err);
      if (!err.statusCode) {
        err.statusCode = 500; // Internal Server Error
      }
      next(err);
    });

};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post not found.');
        error.statusCode = 404; // Not Found
        throw error;
      }
      res.status(200).json({message:'Post Fetched', post: post });
    })
    .catch(err => {
      console.error('Error fetching post:', err);
      if (!err.statusCode) {
        err.statusCode = 500; // Internal Server Error
      }
      next(err);
    });
}

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422; // Unprocessable Entity
    throw error;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image; // Use existing image URL if not updated
  if (req.file) {
    imageUrl = req.file.path.replace('\\', '/'); // Ensure the path is correct
  }
    console.log('Image URL:', imageUrl);
  if (!imageUrl) {
    const error = new Error('No image provided.');
    error.statusCode = 422; // Unprocessable Entity
    throw error;
  }

  
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post not found.');
        error.statusCode = 404; // Not Found
        throw error;
      }
      if (post.imageUrl !== imageUrl) {
        clearImage(post.imageUrl); // Clear old image if it has changed
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then(result => {
      res.status(200).json({
        message: 'Post updated successfully!',
        post: result
      });
    })
    .catch(err => {
      console.error('Error updating post:', err);
      if (!err.statusCode) {
        err.statusCode = 500; // Internal Server Error
      }
      next(err);
    });
}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Post not found.');
        error.statusCode = 404; // Not Found
        throw error;
      }
      clearImage(post.imageUrl); // Clear image before deleting post
      return Post.findByIdAndDelete(postId);
    })
    .then(() => {
      res.status(200).json({ message: 'Post deleted successfully!' });
    })
    .catch(err => {
      console.error('Error deleting post:', err);
      if (!err.statusCode) {
        err.statusCode = 500; // Internal Server Error
      }
      next(err);
    });
};

const clearImage = (imagePath) => {
  const fullPath = path.join(__dirname, '..', imagePath); 
  fs.unlink(fullPath, err => {
    if (err) {
      console.error('Error deleting image:', err);
    } else {
      console.log('Image deleted successfully:', fullPath);
    }
  });
};  
