import mongoose from "mongoose";
import Income from '../models/income.js'

async function validateId(req, res, next)  {
  const id = req.params.id;
  
  if(!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Income with this id: ${id} not found`)
    error.status = 404;
    return next(error)
    
  }
  const income = await Income.findById(id)
  
  if(!income) {
    const error = new Error(`Income with this id: ${id} not found`)
    error.status = 404;
    return next(error)
  }

  next()
} 

export default validateId;