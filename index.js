const express=require("express");
const URL=require("./models/url");
const path=require('path');

const app=express();
const PORT=8000;

const {connectToMongoDB}=require('./connection');

const cookieParser=require('cookie-parser');
const staticRoute=require('./routes/StaticRouter');
const urlRoute=require("./routes/url");
const userRoute=require("./routes/user");
const {restrictToLoggedinUserOnly}=require('./middleware/auth');

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(()=>
    console.log("MongoDB Connected")
);

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.use("/",staticRoute);
app.get('/test',async(req,res)=>{
    const allUrls=await URL.find({});
    res.render("home",{
        urls:allUrls,
    });
    // return res.end(
    //     `<html>
    //     <body>
    //     <h1>Urls</h1>
    //         <ol>
    //         ${allUrls.map((url)=>`<li>${url.shortID} - ${url.redirectURL}</li>`).join("")}
    //         </ol>
    //     </body>
    //      </html>
    //     `
    // );
});

app.get("/url/:shortID", async(req,res) => {
    const shortID = req.params.shortId;
    const user = await URL.findOneAndUpdate(
        {
            shortID,
        },
        // {
        //     $push:{
        //         visitHistory:{
        //             timestamp:Date.now(),
        //         },
        //     },
        // }
    );
    res.redirect(user.redirectURL);
});

app.use("/url",restrictToLoggedinUserOnly,urlRoute);
app.use("/user",userRoute);

app.listen(PORT,()=>console.log("Server Started"));