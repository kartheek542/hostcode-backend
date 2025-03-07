import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[-1];
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

const isLetter = (char) => {
    const val = char.charCodeAt(0);
    if ((val <= 122 && val >= 97) || (val <= 90 && val >= 65)) {
        return true;
    }
    return false;
};

const isDigit = (char) => {
    const val = char.charCodeAt(0);
    if (val <= 57 && val >= 48) {
        return true;
    }
    return false;
};

export const validateUsername = (username) => {
    if (typeof username !== 'string') {
        return false;
    }
    if (username.length === 0) {
        return false;
    }
    for (let i = 0; i < username.length; i++) {
        const c = username[i];
        if (c !== '_' && !isLetter(c) && !isDigit(c)) {
            return false;
        }
    }
    return true;
};

export const validatePassword = (password) => {
    if (typeof password !== 'string') {
        return false;
    }
    if (password.length === 0) {
    }
    for (let i = 0; i < username.length; i++) {
        const c = username[i];
        if (c !== '_' && !isLetter(c) && !isDigit(c)) {
            return false;
        }
    }
    return true;
};
