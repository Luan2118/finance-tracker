import mongoose from "mongoose";

function validateId(Model) {
  return async (req, res, next) =>{
  const id = req.params.id;
  
  if(!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`${Model.modelName} with this id: ${id} not found`)
    error.status = 404;
    return next(error)
    
  }
  

  const data = await Model.findById(id)
  
  if(!data) {
    const error = new Error(`${Model.modelName} with this id: ${id} not found`)
    error.status = 404;
    return next(error)
  }
  
  next()
  } 
}


export default validateId;