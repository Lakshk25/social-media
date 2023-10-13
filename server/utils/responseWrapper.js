const success = (statusCode, result) =>{
    return {
        status: 'ok',
        statusCode,
        result
    }
}

const failure = (statusCode, message) =>{
    return {
        status: 'ok',
        statusCode,
        message
    }
}

module.exports = {
    success, failure
}