module.exports = {
    errorResponse: function(message,res) {
        return res.status(500).json({ result: {}, message: message , success:0, statusCode:500});
    },
}


