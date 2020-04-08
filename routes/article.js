const express = require('express');
const Article = require('./../models/article');
const router = express.Router()

router.get('/new',function(req,res){
    res.render('new', {article : new Article ()});
});

router.get('/',function(req,res){
    res.send('chal gya')
});

router.get('/:slug',async function(req,res){
    const article = await Article.findOne({ slug:req.params.slug});
    if (article==null) res.redirect('/');
    res.render('show',{article:article});
});

router.post('/',async(req,res,next)=>{
   req.article = new Article()
   next()
},saveandredirect('new'))

router.put('/:id',async(req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    next()
 },saveandredirect('edit'))

router.delete('/:id', async (req,res)=>{
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

router.get('/edit/:id',async function(req,res){
    const article = await Article.findById(req.params.id)
    res.render('edit', {article : article});
});


function saveandredirect(path){
    return async (req,res) => {
        let article = req.article
        article.title = req.body.title
        article.author = req.body.author
        article.description = req.body.description
        article.markdown = req.body.markdown
        try{
            article = await article.save();
            res.redirect(`/articles/${article.slug}`);
        } catch(e){
            res.render(`${path}`,{article:article});
        }

    }
}
module.exports = router
