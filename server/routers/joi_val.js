import Joi from 'joi'
// Define the validation schema
const schema = Joi.object({
    name: Joi.string()
        .pattern(/^[A-Za-z0-9_]+$+' '/) 
        .min(5)
        .max(30)
        .required(),
    
    username: Joi.string()
        .email()
        .pattern(/^[a-z0-9._%+\-]+@gmail\.com$/i) 
        .required(),

    password: Joi.string()
        .min(5)
        .required(),

        confirmPassword: Joi.string()
        .valid(Joi.ref('password')) 
        .required()
        .messages({ 'any.only': 'Passwords do not match!' }) 
});

// Export the schema
export{ schema};
