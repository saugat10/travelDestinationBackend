import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {   
    const secretKey = process.env.JWT_SECRET;

    const token = req.headers.authorization?.split(' ')[1];  // Get the token from the Authorization header

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Forbidden: Invalid token" });
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
};

export default authenticateJWT;