import jwt from 'jsonwebtoken';


//Middleware to authenticate JWT token
const jwtAuthMiddleware = (req, res, next) => {
    //
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(401).json({ error: 'Token not Found' });
    }

    const token =req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        //verify the jwt token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Attach decoded user data to request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

//Function to generate JWT token
const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export { jwtAuthMiddleware, generateToken };
