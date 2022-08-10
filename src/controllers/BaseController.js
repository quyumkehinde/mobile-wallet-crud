export const sendSuccess = (res, message, data) => {
    return res.json({
        success: true,
        message: message || 'Success.',
        data: data || {}
    }).status(200);
}

export const sendError = (res, message, statusCode) => {
    return res.json({
        success: false,
        message: message || 'Error occured. Please try again later.',
    }).status(statusCode || 500);
}

export const home = async (req, res) => {
    return sendSuccess(res, 'Welcome to Lendsqr API.');
}
