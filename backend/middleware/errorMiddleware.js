const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // MySQL specific errors
    if (err.code === 'ER_DUP_ENTRY') {
      const message = 'Duplicate field value entered';
      error = new Error(message);
      error.statusCode = 400;
    }

    // MySQL foreign key error
    if (err.code === 'ER_NO_REFERENCED_ROW') {
      const message = 'Referenced record not found';
      error = new Error(message);
      error.statusCode = 404;
    }

    // Validation errors
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = new Error(message.join(', '));
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({ 
      success: false, 
      error: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware; 