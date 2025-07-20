import Income from '../models/income.js'



export const getAllIncome = async (req, res, next) => {
  try {
    const incomes = await Income.find();
    res.status(200).json(incomes);
  } catch (error) {
    next(error)
  }
}

export const createIncome =  async (req, res, next ) => {
  try {
    const {incomeSourceValue, amountValue, currency, dateValue, emoji} = req.body

    if (!incomeSourceValue || !amountValue || !currency || !dateValue || !emoji) {
      const error = new Error('Please fill all fields!')
      error.status = 400;
      return next(error)
    }

    const income = new Income({
      incomeSourceValue,
      amountValue,
      currency,
      dateValue,
      emoji
    })

    const newIncome = await income.save();
    res.status(201).json({income})
  } catch (error) {
     next(error)
  }
}

export const updateIncome = async (req, res, next ) =>{
  try {
    await Income.deleteMany({})
    const newIncome = await Income.insertMany(req.body)

    res.status(200).json(newIncome)

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