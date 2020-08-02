const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const crypto = require("crypto")
const redis = require("redis");
const client = redis.createClient();
exports.hashPassword = function hashPassword() {
    //In Pre Save Middleware This Refers To Document
    if (!this.isModified("password")) return;
    const salt = bcrypt.genSaltSync(13);
    const hashedPw = bcrypt.hashSync(this.password, salt)
    this.password = hashedPw;
    this.passwordConfirmation = undefined;
}
exports.verifyPassword = (plainPassword, hashedPw) => bcrypt.compareSync(plainPassword, hashedPw);
exports.generateToken = function generateToken(user, res) {
   const token = jwt.sign({username: user.username, id: user._id}, process.env.JWT_SECRET);
    res.cookie("jwt", token);
    return token;
}
exports.tokenVerify = async token => {
    const tokenVeri = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    return tokenVeri;
}
exports.hashReset = (salt) => {
if (!salt) { 
var salt = crypto.randomBytes(12).toString("hex");
} 
const hashedToken = crypto.createHash("sha256").update(salt).digest("hex");
return {
plainToken:salt,
hashedToken
}
 
}

exports.blackListToken = (token, res) => {
    const x = client.LPUSH("blacklistedTokens" , token);
 res.cookie("jwt", "");
    return x;
}

exports.isBlacked = async (token) => {
     const x = await  promisify(client.LRANGE).bind(client)("blacklistedTokens", 0 , -1)
    if (x.includes(token)) return true;
    return false;
}

