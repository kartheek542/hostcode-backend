import db from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    try {
        const { username, firstName, lastName, dob, password, mobile, email, organization } =
            req.body;
        const checkUserExistsResult = await db.query('select * from users where username=$1', [
            username,
        ]);
        if (checkUserExistsResult.rowCount > 0) {
            return res.status(409).send({ message: 'A user with that username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'insert into users(username, password, first_name, last_name, email, mobile, dob, organization) values($1, $2, $3, $4, $5, $6, $7, $8)',
            [username, hashedPassword, firstName, lastName, email, mobile, dob, organization]
        );
        return res.status(200).json({ message: 'User registered successfully' });
    } catch (e) {
        const { constraint } = e;
        if (constraint !== null && constraint !== undefined && constraint === 'users_email_key') {
            return res.status(409).json({
                message: 'A user with that email already exists',
            });
        }
        if (constraint !== null && constraint !== undefined && constraint === 'users_mobile_key') {
            return res.status(409).json({
                message: 'A user with that mobile number already exists',
            });
        }
        console.log('Error occured while registering user');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { euname, password } = req.body;
        const userRecordResult = await db.query(
            'select * from users where username=$1 or email=$2',
            [euname, euname]
        );
        if (userRecordResult.rowCount === 1) {
            const userRecord = userRecordResult.rows[0];
            const isPasswordMatched = await bcrypt.compare(password, userRecord.password);
            if (!isPasswordMatched) {
                return res
                    .status(401)
                    .json({ message: 'Invalid username or password, Please try again' });
            }
            const jwtToken = jwt.sign(
                {
                    username: userRecord.username,
                    user_id: userRecord.uid,
                    email: userRecord.email,
                },
                process.env.JWT_SECRET
            );
            return res.status(200).json({
                message: 'User logged in successfully',
                hostcodeAccessToken: jwtToken,
            });
        } else {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (e) {
        console.log('Error occured while logging in user');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};
