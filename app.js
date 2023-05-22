// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

// Create the Express app
const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/node_blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });

// Define the Post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  category: String,
  tags: [String],
  image: { data: Buffer, contentType: String },
  createdAt: { type: Date, default: Date.now },
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

// Define routes
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.render('posts', { posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/posts/new', (req, res) => {
  res.render('new');
});

app.post('/posts', async (req, res) => {
  const { title, content, author, category, tags, image } = req.body;
  try {
    const post = new Post({
      title,
      content,
      author,
      category,
      tags,
        image,
    });
    const savedPost = await post.save();
    res.redirect('/posts');
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//detail page
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('post', { post });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//edit page
app.get('/posts/:id/edit', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('edit', { post });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

//update page
app.put('/posts/:id', async (req, res) => {
    const { title, content, author, category, tags, image } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        post.title = title;
        post.content = content;
        post.author = author;
        post.category = category;
        post.tags = tags;
        post.image = image;
        await post.save();
        res.redirect('/posts');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
