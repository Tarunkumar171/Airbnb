const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new Villa",
//         description:"By the beach",
//         price:1200,
//         location:"jodhpur,rajasthan",
//         country:"india"
//     });
//     await sampleListing.save();
//     console.log("successfully saved");
//     res.send("successful")
// })


router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedin,upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.createListing));


// router.get("/",wrapAsync(listingcontroller.index));

router.get("/new",isLoggedin,listingcontroller.renderNewForm)

router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(isLoggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingcontroller.updateListing))
.delete(isLoggedin,isOwner,wrapAsync(listingcontroller.deleteListing));

// router.get("/:id",wrapAsync(listingcontroller.showListing))

// app.post("/listings",async(req,res)=>{
//     // let {title,description,image,price,location,country}=req.body;
//     // let newListing=req.body.listing;
//     try{
//         const newListing=new Listing(req.body.listing);
//         await newListing.save();
//         res.redirect("/listings");
//     }catch(err){
//         next(err);
//     }
//     // console.log(newListing);
// })

// router.post("/",isLoggedin,validateListing,wrapAsync(listingcontroller.createListing))

router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingcontroller.renderEditForm))

// router.put("/:id",isLoggedin,isOwner,validateListing,wrapAsync(listingcontroller.updateListing))

// router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingcontroller.deleteListing));

module.exports=router;