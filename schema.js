//  //WE CREATE SCHEMA FOR "{LISTING}" AND THEN WE "{REQUIRED}" THIS TO "{APP.JS}" AND THEN WE MADE "{VALIDATE LISTING}" METHOD
// const Joi = require('joi');

// module.exports =  listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price:Joi.number().required().min(0),
//         image:Joi.string().allow(" ",null)
//     }).required()
// });

// module.exports.reviewSchema = Joi.object({
//     review:Joi.object({
//         rating:Joi.number().required().min(1).max(5),
//         comment:Joi.string().required()
//     }).required()
// });

// schema.js - Replace the whole file with this

const Joi = require('joi');

// 1. Define the listing schema
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).unknown() // Allows the image object to be validated
    }).required()
});

// 2. Define the review schema
const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

// 3. THE MOST IMPORTANT PART: Export both schemas together in one object.
module.exports = { listingSchema, reviewSchema };
