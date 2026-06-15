import Income from '../models/income.js'



export const getAllIncome = async (req, res, next) => {
  try {
    const incomes = await Income.find({user: req.user.id});
    res.status(200).json(incomes);
  } catch (error) {
    next(error)
  }
}

export const createIncome =  async (req, res, next ) => {
  try {
    const {category, incomeSourceValue, amountValue, currency, dateValue, emoji} = req.body
    
    const income = new Income({
      category,
      incomeSourceValue,
      amountValue,
      currency,
      dateValue,
      emoji,
      user: req.user.id
    })

    await income.save();
    res.status(201).json({income})
  } catch (error) {
     next(error)
  }
}

export const updateIncome = async (req, res, next ) =>{
  try {
    const data = req.body

    for (const income of data) {
      const {_id, ...updates} = income

        await Income.findOneAndUpdate(
        {_id, user: req.user.id},
        { $set: updates},
        { new: true, runValidators: true}
      )
    }
    
    res.status(200).json({msg: 'Data updated'})

  } catch (error) {
    next(error)
  }
}

export const deleteIncome = async (req, res, next) => {

  try {
    const deleted = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
  });

    if (!deleted) return res.status(404).json({msg: 'Income not found'}) 
      
    res.status(200).json({msg: 'Income Deleted'})
  } catch (error) {
    next(error)
  }

}