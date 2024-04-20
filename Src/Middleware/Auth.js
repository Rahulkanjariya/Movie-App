const jwt = require("jsonwebtoken");
const { USER_SECRECT_KEY } = process.env


const UserVerifyToken = (req, res, next) => {
    const userToken = req.body.token || req.query.token || req.headers["token"];

    if (!userToken) {
        return res.status(400).json({ 
            succuss:false,
            message:"Token not authorized" 
        })
    };
    try {
        const decode = jwt.verify(userToken, USER_SECRECT_KEY);
        req.user = decode._id
    } catch (error) {
        return res.status(400).json({
            succuss:false,
            message:"Invalid token"
        })
    };
    return next()
};

module.exports = { UserVerifyToken };