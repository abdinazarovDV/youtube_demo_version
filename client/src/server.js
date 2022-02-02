const express = require('express');
const app = express();
const PORT = process.env.PORT || 8808
const path = require('path')
const ejs = require('ejs')

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(express.static( path.join(__dirname, 'public')))
app.set('views',  path.join(__dirname, 'views'))



app.get('/', (req, res) => res.render('index'))
app.get('/login', (req, res) => res.render('login'))
app.get('/register', (req, res) => res.render('register'))
app.get('/admin', (req, res) => res.render('admin'))

app.listen(PORT, () => console.log("Server http://192.168.226.18:" + PORT))