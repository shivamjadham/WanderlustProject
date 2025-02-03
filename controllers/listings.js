const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.category = async (req,res)=>{
    let {c} = req.params;
    const listing= await Listing.find({category:{$in: c}});
    res.render("listings/index.ejs",{listing});
};

module.exports.renderNewForm =  (req,res)=>{
    res.render("listings/new.ejs");
 };

 module.exports.showListing = async (req,res)=>{
     
     let {id} = req.params;
      const listing= await  Listing.findById(id)
      .populate({path:"reviews",
         populate:{
             path:"author",
         },
      })
      .populate("owner");
      if(!listing){
         req.flash("success"," Listing you requested for does not exist");
         res.redirect("/listings");
      }
      console.log(listing);
      res.render("listings/show.ejs",{listing});
 }

 module.exports.createListing = async(req,res ,next)=>{ 
   let url = req.file.path;
   let filename  = req.file.filename;

    const newListing= new Listing({
        title:req.body.listing.title,
        description:req.body.listing.description,
        image: {
            filename: filename, 
            url: req.body.listing.image 
        },
        price:req.body.listing.price,
        country:req.body.listing.country,
        location:req.body.listing.location,
    });

   newListing.owner =req.user._id;
   newListing.image = {url , filename};
    await newListing.save();

    req.flash("success","New Listing Created");
  
    res.redirect("/listings");

}

module.exports.renderEditFrom = async(req,res)=>{
    let {id}=req.params;
  let listing  =await Listing.findById(id);
  if(!listing){
    req.flash("success"," Listing you requested for does not exist");
    res.redirect("/listings");
 }
   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");         
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
  
    let {id}=req.params;
   
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename  = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

req.flash("success"," Listing Updated");
   res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success"," Listing is deleted");
    res.redirect("/listings");
}