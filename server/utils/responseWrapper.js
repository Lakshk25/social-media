const success = (statusCode, result) =>{
    return {
        status: 'ok',
        statusCode,
        result
    }
}

const failure = (statusCode, message) =>{
    return {
        status: 'fail',
        statusCode,
        message
    }
}

module.exports = {
    success, failure
}