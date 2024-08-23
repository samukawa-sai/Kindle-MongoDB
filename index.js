const express=require("express")
const app = express()
app.use(express.urlencoded({extended:true}))
const mongoose=require("mongoose")

//connecting to MongoDB
mongoose.connect("mongodb+srv://samukawa:world315@cluster0.zzh2r.mongodb.net/blogUserDatabase?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Success: Connected to MongoDB")
    })
    .catch((error) => {
        console.error("Failure: Unconnected to MongoDB")
    })

//defining Schema and Model
const Schema = mongoose.Schema
const BlogSchema = new Schema({
    title:String,
    summary:String,
    image:String,
    textBody:String,
})

const BlogModel = mongoose.model("Blog",BlogSchema)

//blog function


//create blog
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

//read all blogs
app.get("/",async(req,res)=>{
    const allBlogs = await BlogModel.find()
    console.log("allblog data : ",allBlogs)
    res.send("all blog data has read")
})

//read single blog
app.get("/blog/:id",async(req,res)=>{
    const singleBlog = await BlogModel.findById(req.params.id)
    console.log("single blog data : ",singleBlog)
    res.send("single Blog pages")
})

//update blog
app.get("/blog/update/:id",async(req,res)=>{
    const singleBlog = await BlogModel.findById(req.params.id)
    console.log("singleBlog contents : ",singleBlog)
    res.send("single Blog editted pages")
})


// app.post("/blog/update/:id", (req, res) => {
//     BlogModel.updateOne({ _id: req.params.id }, req.body)
//         .then(()=>{
//             console.log("console.log(Finish!)")
//             res.send("finish!!")
//         })
//         .catch((error)=>{
//             console.error("Error detected : "+error.message)
//             res.status(500).send("Errror")
//         })
//     res.send("finish")
// });


app.post("/blog/update/:id", async (req, res) => {
    try {
        await BlogModel.updateOne({ _id: req.params.id }, req.body);
        res.send("OKOK finished")
    } catch (error) {
        res.send(error.message);
    }
});

//delete blog
app.get("/blog/delete/:id",async(req,res)=>{
    const singleBlog = await BlogModel.findById(req.params.id)
    console.log("singleBlog contents : ",singleBlog)
    res.send("Delete single Blog pages")
})

app.post("/blog/delete/:id",async(req,res)=>{
    try{
        await BlogModel.deleteOne({_id:req.params.id})
        console.log("success of delete")
        res.send("success of delete")
    }catch(error){
        res.send("error message : "+error)
    }
})


//connecting to port
app.listen(5000,()=>{
    console.log("Listening on localhost port 5000")
})