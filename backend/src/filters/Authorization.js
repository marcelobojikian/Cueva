const { promisify } = require("util");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {

    const token = req.headers.authorization;

    try {

        if (!token) {
            return res.status(401).send({ message: "No token provided" });
        }

        const decoded = await promisify(jwt.verify)(token, "secret");
        req.userId = decoded.id;

        return next();

    } catch (err) {
        return res.status(401).send({ message: "Token invalid" });
    }
    
};