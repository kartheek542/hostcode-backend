import db from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const getAllProblems = async (req, res) => {
    try {
        const problemsResult = await db.query('select * from problem');
        return res.status(200).json({ message: problemsResult.rows });
    } catch (e) {
        console.log('Error occured while processing');
        console.log(e);
    }
};

export const getProblemDetail = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Hello Hostcode' });
    } catch (e) {
        console.log('Error occured while processing');
        console.log(e);
    }
};

export const getSupportedLanguages = async (req, res) => {
    try {
        const supportedLanguagesResult = await db.query('select * from supported_language', []);
        return res.status(200).json({
            languages: supportedLanguagesResult.rows,
            message: 'Successfully retrieved supported languages',
        });
    } catch (e) {
        console.log('Error occured while retrieving supported languages');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};

export const submitProblem = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Hello Hostcode' });
    } catch (e) {
        console.log('Error occured while processing');
        console.log(e);
    }
};
