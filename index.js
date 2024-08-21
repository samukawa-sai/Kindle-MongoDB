const express=require("express")
const app = express()
app.use(express.urlencoded({extended:true}))
const mongoose=require("mongoose")

mongoose.connect("mongodb+srv://samukawa:world315@cluster0.zzh2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Success: Connected to MongoDB")
    })
    .catch((error) => {
        console.error("Failure: Unconnected to MongoDB")
    })

const Schema = mongoose.Schema
const BlogSchema = new Schema({
    title:String,
    summary:String,
    image:String,
    textBody:String,
})

const BlogModel = mongoose.model("Blog",BlogSchema)

app.get("/",(req,res)=>{
    res.send("こんにちは")
})

app.get("/blog/create",(req,res)=>{
    res.sendFile(__dirname+"/views/blogCreate.html")
})

app.post("/blog/create",async (req,res)=>{
    console.log("POSTリクエストが実行されました")
    try{
        const savedBlogData = await BlogModel.create(req.body);
        console.log("成功",savedBlogData);
        res.send("投稿完了")
    }catch(err){
        console.log("失敗",err);
        res.status(500).send("エラーの発生");
    }
})

app.listen(5000,()=>{
    console.log("Listening on localhost port 5000")
})