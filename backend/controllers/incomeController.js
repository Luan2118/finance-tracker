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

    for (const expense of data) {
      const {_id, ...updates} = expense

        await Expense.findByIdAndUpdate(
        _id,
        { $set: updates},
        { new: true}
      )
    }

    res.status(200).json({msg: 'Data updated'})

  } catch (error) {
    next(error)
  }
}

export const deleteIncome = async (req, res, next) => {

  try {
    await Income.deleteOne({_id: req.params.id});
    res.status(200).json({msg: 'Income Deleted'})
  } catch (error) {
    next(error)
  }

}