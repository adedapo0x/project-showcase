const catchAsync = (fnc) => {
    return (req, res, next) => {
        fnc(req, res, next).catch(next)
    }
}

module.exports = catchAsync

