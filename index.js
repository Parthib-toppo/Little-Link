const express = require("express");
const path = require("path");

const {connectToMongoDB} = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");

const app = express();
const PORT = 8001;
connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log("mongodb connected..."));
const URL = require("./models/url");
app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// controllers
app.use("/url",urlRoute); // POST /URL
app.use("/",staticRoute);

app.get("/url/:shortId", async (req,res)=>{     // GET /:id
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            }
        }
    })

    res.redirect(entry.redirectURL);
})

app.listen(PORT, ()=>console.log(`Server started at PORT: ${PORT}`));