const { validationResult } = require('express-validator');
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
    return res.status(422).json({
      message: 'Validation failed.',
      errors: errors.array()
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully!',
    post: { 
       _id: new Date().toISOString(), 
       title: title, 
       content: content,
       creator: { name: 'John Doe' },
       createdAt: new Date().toISOString() 
      }
  });
};
