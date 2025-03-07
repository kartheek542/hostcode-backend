import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Please provide a valid token' });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.username = user.username;
            req.user_id = user.user_id;
            req.email = user.email;
            next();
        });
    } catch (e) {
        console.log('Error occurred while authenticating');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while authenticating' });
    }
};
