const express = require("express");

const {connectToMongoDB} = require("./connect");
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8001;
connectToMongoDB("mongodb://localhost:27017/short-url")
.then(()=>console.log("mongodb connected..."));
const URL = require("./models/url");

// middleware
app.use(express.json());

// controllers
app.use("/url",urlRoute); // POST /URL

app.get("/:shortId", async (req,res)=>{     // GET /:id
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