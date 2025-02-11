const shortid=require('shortid');
const URL=require("../models/url");
const { json } = require("express");

async function handleGenerateNewShortUrl(req,res) {
    const body=req.body;
    if(!body.url) return res.status(400).json({error:"url is required"});
    const shortId=shortid.generate();
    const result=await URL.create({
        shortID:shortId,
        redirectURL:body.url,
        visitHistory:[],
    });

    return res.render("home",{
        id:shortId,
    });
    // return res.json({id:shortId});
}

module.exports={
    handleGenerateNewShortUrl,
};