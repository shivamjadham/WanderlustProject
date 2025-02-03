const express = require("express");
const router = express.Router();

const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");


const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js");

const ListingController = require("../controllers/listings.js");

const {storage} = require("../cloudConfig.js");

const multer  = require('multer');
const upload = multer({storage });

//new Route   
router.get("/new",isLoggedIn,ListingController.renderNewForm);

//category
router.get("/category/:c",isLoggedIn,ListingController.category);

router 
   .route("/")
   .get(wrapAsync(ListingController.index))  // Index.route
   .post(isLoggedIn, upload.single('listing[image]'),validateListing ,wrapAsync(ListingController.createListing));  // Creat route
 

router
    .route("/:id")
    .get(wrapAsync(ListingController.showListing)) // Show Route 
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(ListingController.updateListing))  //update route
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(ListingController.destroyListing));   //Delete route



//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditFrom));


module.exports = router;