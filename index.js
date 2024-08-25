const express=require("express")
const session=require("express-session")
const app = express()
app.use(express.urlencoded({extended:true}))
const mongoose=require("mongoose")
const flash = require("connect-flash")

app.set("view engine","ejs")
app.use("/public", express.static("public"))
app.use(flash())

//Session
app.use(session({
    secret:"secretKey",
    resave:false,
    saveUninitialized: false,
    cookie:{maxAge:30000},
}))

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

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
})

const BlogModel = mongoose.model("Blog",BlogSchema)
const UserModel = mongoose.model("User",UserSchema)

//create blog
app.get("/blog/create",(req,res)=>{
    if(req.session.userID){
        res.render("blogCreate")
    }else{
        res.redirect("/user/login")
    }
})

app.post("/blog/create",async (req,res)=>{
    console.log("POSTリクエストが実行されました")
    try{
        const savedBlogData = await BlogModel.create(req.body);
        console.log("成功",savedBlogData);
        res.send("投稿完了").redirect("/")
    }catch(err){
        res.render("error",{message:"/blog/createのエラー"})
        console.log("失敗",err);
        res.status(500).send("エラーの発生"+ err)
    }
})

//update blog
app.get("/blog/update/:id",async(req,res)=>{
    const singleBlog = await BlogModel.findById(req.params.id)
    res.render("blogUpdate",{singleBlog})
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
        req.flash("success","update has finished")
        res.redirect("/")
    } catch (error) {
        res.render("error",{message:"/blog/updateのエラー"});
    }
});

//delete blog
app.get("/blog/delete/:id",async(req,res)=>{
    const singleBlog = await BlogModel.findById(req.params.id)
    console.log("singleBlog contents : ",singleBlog)
    res.render("blogDelete",{singleBlog})
})

app.post("/blog/delete/:id",async(req,res)=>{
    try{
        await BlogModel.deleteOne({_id:req.params.id})
        console.log("success of delete")
        res.send("success of delete")
    }catch(error){
        console.log("failure")
        res.send("error message : "+error)
    }
})


//User function
//Create user
app.get("/user/create",async(req,res)=>{
    await res.render("userCreate")
})

app.post("/user/create",async(req,res)=>{
    try{
        savedUserModel = await UserModel.create(req.body)
        console.log("savedUserModel : "+ savedUserModel),
        res.send("Success of User Registration")
    }catch(error){
        console.log("failure of User registration")
        res.status(500).send("Error detected"+ error);
    }
})

//userLogin
app.get("/user/login",(req,res)=>{
    res.render("login")
})

app.post("/user/login",async(req,res)=>{
    try{
        const savedUserData = await UserModel.findOne({email:req.body.email})
        if(savedUserData){
            //ユーザーが存在した場合の処理
            if(req.body.password === savedUserData.password){
                //セッションIDをmongoDBの個別idで統一
                req.session.userID = savedUserData._id
                res.send("ログイン成功")
            }else{
                res.send("パスワードが違います")
            }
        }else{
            res.send("ユーザーが存在していません")
        }
    }catch(error){
        res.send(error)
    }
})

//blog function
//read all blogs
app.get("/",async(req,res)=>{
    const allBlogs = await BlogModel.find()
    res.render("index",{allBlogs:allBlogs,session:req.session.userId})
})

//read single blog
app.get("/blog/:id",async(req,res)=>{
    const singleBlog = await BlogModel.findById(req.params.id)
    res.render("blogRead",{singleBlog:singleBlog, session:req.session.userId})
})

//connecting to port
app.listen(5000,()=>{
    console.log("Listening on localhost port 5000")
})