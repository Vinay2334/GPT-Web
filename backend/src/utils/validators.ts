import { Request, Response, NextFunction } from 'express';
import {body, ValidationChain, validationResult} from 'express-validator'

export const validate = (validations:ValidationChain[])=>{
    return async (req:Request, res:Response, next:NextFunction)=>{
        for(let validation of validations){
            const result = await validation.run(req)
            if(!result.isEmpty()){
                break;
            }
        }
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        return res.status(422).json({errors:errors.array()});
    };
};
export const loginvalidator = [
    body("email").trim().isEmail().withMessage("Don't forget to add your correct email so we can stay in touch!"),
    body("password").trim().isLength({min: 8}).withMessage("Your password needs to be at least 8 characters long. Almost there!")
];

export const signupvalidator = [
    body("name").notEmpty().withMessage("Oops! Looks like you missed the name field. We’d love to know what to call you!"),
    ...loginvalidator,
];

export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Please!!Don't Forget to Type a Message"),
];