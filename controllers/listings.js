const Listing=require("../models/listing.js");

module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","requested listing does not exist")
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing=async(req,res)=>{
    // let {title,description,image,price,location,country}=req.body;
    // let newListing=req.body.listing;

    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid data");
    // }

    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(404,result.error);
    // }
        let url=req.file.path;
        let filename=req.file.filename;
        const newListing=new Listing(req.body.listing);

        // if(!newListing.title){
        //     throw new ExpressError(404,"title is missing");
        // }
        //   if(!newListing.description){
        //     throw new ExpressError(404,"description is missing");
        // }
        //   if(!newListing.price){
        //     throw new ExpressError(404,"price is missing");
        // }
        //   if(!newListing.location){
        //     throw new ExpressError(404,"location is missing");
        // }
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success","new listing added successfully");
        res.redirect("/listings");
    // console.log(newListing);
};


module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","requested listing does not exist")
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}


module.exports.updateListing=async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid data");
    // }
    let{id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }

    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
}


module.exports.deleteListing=async(req,res)=>{
    let{id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}