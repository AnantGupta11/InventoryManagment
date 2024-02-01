import { body, validationResult } from "express-validator";
const validateRequest=async(req,res,next)=>{
    

    //setup rules for validation
    const rules=[
        body('name').notEmpty().withMessage("Name is required"),
        body('price').isFloat({gt:0}).withMessage("Price should be a Positive value"),
        //body('imageUrl').isURL().withMessage('Invalid url')
        body('imageUrl').custom((value, {req})=>{
          if(!req.file){
            throw new Error('Image is required');
          }
          return true;
        })
      ];

    //run those rules
    await Promise.all(rules.map(rule=>rule.run(req)));
    //check if there are any error after running the rules
    var validationErrors= validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.render('new-product', {
        errorMessage: validationErrors.array()[0].msg,
      });
    }
    next();
}

export default validateRequest;