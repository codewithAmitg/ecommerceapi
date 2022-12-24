// not found
const notFound = (req, res, next) =>{
    const originalUrl = req.originalUrl == 'undefined' ? '': req.originalUrl;
    const error= new Error(`Not Found : ${originalUrl}`);
    res.status(404);
    next(error);
}

// Error Handler

const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    console.log(err);
    res.json({
        message: err?.message,
        stack:err?.stack,
    });
};

module.exports = {errorHandler, notFound };