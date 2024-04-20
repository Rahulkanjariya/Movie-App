const jwt = require("jsonwebtoken");
const { USER_SECRECT_KEY } = process.env

async function UserJwtToken(userId){
    try {
        const payload = { id:userId };
        const token = jwt.sign(payload,USER_SECRECT_KEY);
        return token;
    } catch(error){
        return { error: true }
    }
}

module.exports = { UserJwtToken }