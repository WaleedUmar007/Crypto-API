const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { response } = require('express');
const res = require('express/lib/response');
const app = express();

const websites = [{
    name: 'BBC',
    url: 'https://www.bbc.com/news/technology',
    base: 'https://www.bbc.com'
},

{
    name: 'NYTimes',
    url:  'https://www.nytimes.com/topic/subject/bitcoin',
    base: 'https://www.nytimes.com/'
},

{
    name: 'NewsBTC',
    url: 'https://www.newsbtc.com/',
    base: ''
}

]

websites.forEach(web=>{
    axios.get(web.url)
         .then((response)=>{
             const html = response.data;
             const $ = cheerio.load(html);
             $('a:contains("Crypto")',html).each(function(){
                 const title = $(this).text();
                 const link = $(this).attr('href');
                 articles.push({
                        title,
                        link: web.base + link,
                        source: web.name
                 })
             })
         })
})

const articles =[];

app.get('/',(req,res)=>{
    res.json ("Welcome to Bitcoin News Scrapper")
});

app.get('/news',(req,res)=>{

    res.json(articles);
});

// display articles from a particular newspaper

app.get('/news/:newspaperId', async (req,res)=>{
    const newspaperId = req.params.newspaperId;

    const siteToVisit = websites.filter(web => web.name === newspaperId)[0].url;
    const websitesBase  = websites.filter(web => web.name === newspaperId)[0].base;
    console.log(siteToVisit);

    axios.get(siteToVisit)
         .then((response)=>{
             const html = response.data;
             const $ = cheerio.load(html);
             const speicificArticles = [];

                $('a:contains("Crypto")',html).each(function(){
                    const title = $(this).text();
                    const link = $(this).attr('href');

                    speicificArticles.push({
                        title,
                        link: websitesBase + link,
                        source: newspaperId
                    })
                })
                res.json(speicificArticles);
         }).catch((err)=>console.log(err));
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});