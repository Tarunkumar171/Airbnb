if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}
// console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");

const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(cookieParser("secretCode"));

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    // console.log(res.locals.success);
    res.locals.error=req.flash("error");
    // console.log(req.locals.error);
    res.locals.currUser=req.user;
    next();
})


app.get("/getsignedcookie",(req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.send("signed cookie sent");
})
app.get("/verify",(req,res)=>{
    // console.log(req.cookies);
     console.log(req.signedCookies);
    res.send("verified");
})

main().then((res)=>{
    console.log("connected to DB");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.listen(8080,(()=>{
    console.log("app is listening on port 8080");
}))

app.get("/",(req,res)=>{
    console.log(req.cookies);
    res.send("This is a root directory");
})

app.use((err,req,res,next)=>{
    let{status=500,message="sth went wrong"}=err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs",{err});
})

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// })




// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madeIn","India");
//     res.cookie("login","yes");
//     res.cookie("name","Tarun")
//     res.send("sent you some cookies");
// })

// app.get("/greet",(req,res)=>{
//     let {name="Unknown"}=req.cookies;
//     res.send(`Hi ${name}`);
// })



// app.get("/demouser",async(req,res)=>{
//     const fakeUser=new User({
//         email:"student1@gmail.com",
//         username:"delta-st",
//     })
//     let registeredUser= await User.register(fakeUser,"tarun@842006");
//     res.send(registeredUser);
// })