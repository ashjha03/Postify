const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Post = require('./model/Schema')
const dotenv = require('dotenv');

const DB = 'mongodb+srv://ashjha03:QEmXL617Ynt494Xp@cluster0.smpdbqt.mongodb.net/postify?retryWrites=true&w=majority'

dotenv.config()
mongoose.set('strictQuery', false)

mongoose.connect(DB)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err))

app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

app.get('/', async (req, res) => {
    const posts = await Post.find()
    res.render('home', {posts})
})

app.get('/post/:id', async (req, res) => {
    const {id} = req.params
    const post = await Post.findById(id)
    res.render('post', {post})
})

app.get('/post/:id/edit', async (req, res) => {
    const {id} = req.params
    const post = await Post.findById(id)
    res.render('editForm', {post})
})

app.post('/newPost', async (req, res) => {
    const data = req.body;
    const post = new Post(data)
    await post.save()
    res.redirect('/')
})

app.put('/post/:id', async (req, res) => {
    const {id} = req.params
    const data = req.body
    await Post.findByIdAndUpdate(id, data)
    res.redirect('/post/'+id)
})

app.delete('/post/:id', async (req, res) => {
    const {id} = req.params
    const post = await Post.findById(id)
    await post.delete()
    res.redirect('/')
})

app.listen(3000, () => {
    console.log(`Serving on port 3000`)
})