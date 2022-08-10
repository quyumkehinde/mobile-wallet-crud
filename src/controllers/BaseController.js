import { response } from "express";

export const successResponse = (message, data) => {
    return response.status(200).json({
        success: true,
        message: message || 'Success.',
        data: data || {}
    });
}

export const errorResponse = (message, statusCode) => {
    return response.status(statusCode || 500).json({
        success: false,
        message: message || 'Error occured. Please try again later.',
    });
}

export const home = () => successResponse('Welcome to Lendsqr API');
export const notFound = () => errorResponse('Please check the link and try again.', 404);