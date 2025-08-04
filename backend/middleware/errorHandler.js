const errorHandler = (err, req, res , next ) => {
  if (err.status) {
    return res.status(err.status).json({error: err.message})
  }
 res.status(500).json({error: err.message})
 console.log(err)
}

export default errorHandler;