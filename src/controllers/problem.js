import db from '../config/database.js';
import { sendMessageToSQS, uploadCodeToS3 } from '../utils/aws.js';

export const getAllProblems = async (req, res) => {
    try {
        const {pageNum, pageSize} = req.query;
        if(pageNum === null || pageNum === undefined) {
            return res.status(400).json({message: "Please pass pageNum query parameter"})
        }
        if(pageSize === null || pageSize === undefined) {
            return res.status(400).json({message: "Please pass pageSize query parameter"})
        }
        const totalPagesResult = await db.query("select count(*) as total_records from problem p inner join contest c on c.cid = p.contest_id where c.end_time < NOW()")
        const problemsResult = await db.query('select p.pid as problem_id, p.name as problem_name, p.score as problem_score from problem p inner join contest c on c.cid = p.contest_id where c.end_time <= NOW() offset $1 limit $2', [(pageNum - 1) * pageSize, pageSize]);
        console.log("Completed querying")
        console.log(totalPagesResult.rows);
        console.log(problemsResult.rows);
        return res
            .status(200)
            .json({
                totalRecords: parseInt(totalPagesResult.rows[0].total_records),
                problems: problemsResult.rows,
                message: "Successfully retrieved problems"
            });
    } catch (e) {
        console.log('Error occured while retrieving all problems');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
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
        const { user_id } = req;
        const { problemId, languageId, code } = req.body;
        const insertSubmission = await db.query(
            'insert into submission(problem_id, language_id, submission_status_id, submitted_by, code) values($1, $2, 1, $3, $4) returning sid',
            [problemId, languageId, user_id, code]
        );
        const submissionId = insertSubmission.rows[0].sid;
        console.log("Submission id is", submissionId);
        // upload the code to s3
        await uploadCodeToS3(submissionId, problemId, languageId, code);
        // queue the submission in sqs
        await sendMessageToSQS(submissionId, problemId, languageId);
        return res.status(200).json({ message: 'You have successfully submitted your code.' });
    } catch (e) {
        const { constraint } = e;
        if (constraint !== null && constraint !== undefined && constraint === 'submission_problem_id_fkey') {
            return res.status(404).json({
                message: 'Invalid problemId',
            });
        }
        if (constraint !== null && constraint !== undefined && constraint === 'submission_language_id_fkey') {
            return res.status(404).json({
                message: 'Invalid languageId',
            });
        }
        console.log('Error occured while submitting code to the problem');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};
