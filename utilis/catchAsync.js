function catchAsync (asyncF) {

return (req, res, next) => {

    asyncF(req, res, next).catch(err => {
            return next(err);
    });

}

}
module.exports = catchAsync;