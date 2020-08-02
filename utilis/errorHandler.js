1                       //The Centralized Error Handler


function handleProd(err, res) {

}

function handleDev(err, res) {
            console.log(err);
    res.status(err.statusCode).json({
        statusCode:err.statusCode,
        status:err.status,
        message:err.message

    })

}


    displayErr = err => {
    console.log(err);
          //Defaults Section
        err.statusCode = err.statusCode || 400;
        err.status =  err.status || "Failed"
        //Development Only
        err.message = err.message || "Please Check Error Handler"
        //End SECTIOn
        return err;

}

exports.handleErr = (err, req, res, next) => {
        err = displayErr(err);

    if (process.env.NODE_ENV == "development") {
        handleDev(err, res);
    }


}
exports.displayErr = displayErr;