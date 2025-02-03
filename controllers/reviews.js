const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
  console.log("shivam");
  let {id}=req.params;
  
     let listing = await Listing.findById(id);
    
             let newReview=   new Review(req.body.review);
             newReview.author = req.user._id; 
             console.log("shivam",listing);
             listing.reviews.push(newReview);
           await  newReview.save();
          await   listing.save();
          req.flash("success","New review Created");
         res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let { id , reviewId } = req.params;
   await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await Review.findByIdAndDelete(reviewId);
   req.flash("success"," review deleted");
   res.redirect(`/listings/${id}`);
};
