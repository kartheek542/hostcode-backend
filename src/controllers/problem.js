import db from '../config/database.js';

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
        const { problemId } = req.params;
        const validateContestResult = await db.query(
            'select c.start_time from problem p inner join contest c on p.contest_id = c.cid where p.pid = $1',
            [problemId]
        );
        if (validateContestResult.rowCount === 0) {
            return res.status(404).json({ message: 'Invalid problem id' });
        }
        const currentTimestamp = new Date();
        const contestStartTimestamp = new Date(validateContestResult.rows[0].start_time);
        if (currentTimestamp < contestStartTimestamp) {
            return res.status(403).json({ message: "Contest hasn't started yet" });
        }
        const problemResult = await db.query('select * from problem where pid = $1', [problemId]);
        return res.status(200).json({ problem: problemResult.rows[0], message: 'Hello Hostcode' });
    } catch (e) {
        console.log('Error occured while retrieving problem detail');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
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
