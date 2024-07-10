const Joi = require('joi');

module.exports.CampgroundSchema = Joi.object({
    title : Joi.string().alphanum().required(),
    location : Joi.string().alphanum().required(),
    price : Joi.number().min(0).required(),
    img : Joi.string().required(),
    description : Joi.string().required()
}).required();

module.exports.reviewSchema = Joi.object({
    text : Joi.string().required(),
    rating : Joi.number().required().min(1).max(5)
}).required();
