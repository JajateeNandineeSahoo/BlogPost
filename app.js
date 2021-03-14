const express=require("express");
const mongoose=require("mongoose");
const path = require('path');
const methodOverride=require("method-override");
const ejsMate = require('ejs-mate');
const Post = require('./models/post');

mongoose.connect('mongodb://localhost:27017/blog', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app=express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/post', async (req, res) => {
    const posts = await Post.find({});
    res.render('home', {posts});
})

app.get('/post/new', (req, res) => {
    res. render('new');
})

app.post('/post', async (req, res) => {
    const posts = new Post({
        title: req.body.title,
        body: req.body.body
    });
    await posts.save();
    res.redirect('/post');
})

app.get('/post/profile', async (req, res) => {
    const posts = await Post.find({});
    res.render('profile', {posts});
})

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.render('show', { post:post });
})

app.get('/post/:id/edit', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('edit', { post });
})

app.put('/post/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body });
    res.redirect('/post');
});

app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/post');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})