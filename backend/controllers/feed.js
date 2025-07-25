const { validationResult } = require('express-validator');
const Post = require('../modal/post');
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ 
       _id: 'p1',
       title: 'First Post', 
       content: 'This is the first post!',
        imageUrl: 'images/Foto.jpg',
        creator: { name: 'John Doe' },
        createdAt: new Date().toISOString()
      }]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error=new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422; // Unprocessable Entity
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/Foto.jpg',
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
