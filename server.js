const express = require('express')
const articleRouter = require('./routes/article');
const Article = require('./models/article');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/blogs'
mongoose.connect(MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

app.set('view engine','ejs')

app.get('/',async function(req,res){
    const articles = await Article.find().sort({createat : 'desc'})
    res.render('index',{ articles:articles});
});

app.use('/articles',articleRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server is running on PORT ${PORT}`));