const sanitizeHTML = require('sanitize-html');
const BaseJoi = require('joi');

const extension = (joi) => ({
    type: 'string',
    base: BaseJoi.string(),
    messages:{
        'string.escapeHTML' : '{{#label}} must not include HTML'
    },
    rules:{
        escapeHTML : {
            validate(value,helpers){
                const clean = sanitizeHTML(value,{
                    allowedTags : [],
                    allowedAttributes : {}
                });
                if(clean!== value)
                    return helpers.error('string.escapeHTML',{value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);


module.exports.CampgroundSchema = Joi.object({
    title : Joi.string().required().escapeHTML(),
    location : Joi.string().required().escapeHTML(),
    price : Joi.number().min(0).required(),
    
    description : Joi.string().required().escapeHTML(),
    deleteI : Joi.array()
}).required();

module.exports.reviewSchema = Joi.object({
    text : Joi.string().required().escapeHTML(),
    rating : Joi.string().required()
}).required();

module.exports.userSchema = Joi.object({
    email : Joi.string().required().escapeHTML()
});