import db from '../config/database.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const getContests = async (req, res) => {
    try {
        const runningContestsQuery =
            "select c.cid, c.name, c.start_time, c.end_time, json_agg(json_build_object('user_id', u.uid, 'username', u.username)) as authors from contest c inner join contest_author ca on c.cid = ca.contest_id inner join users u on ca.author_id = u.uid where c.start_time <= NOW() and c.end_time >= NOW() group by c.cid;";
        const upcomingContestsQuery =
            "select c.cid, c.name, c.start_time, c.end_time, json_agg(json_build_object('user_id', u.uid, 'username', u.username)) as authors from contest c inner join contest_author ca on c.cid = ca.contest_id inner join users u on ca.author_id = u.uid where c.start_time > NOW() group by c.cid order by c.start_time asc limit 5;";
        const pastContestsQuery =
            "select c.cid, c.name, c.start_time, c.end_time, json_agg(json_build_object('user_id', u.uid, 'username', u.username)) as authors from contest c inner join contest_author ca on c.cid = ca.contest_id inner join users u on ca.author_id = u.uid where c.end_time < NOW() group by c.cid order by c.end_time desc limit 5;";
        const runningContestsResult = await db.query(runningContestsQuery, []);
        const upcomingContestsResult = await db.query(upcomingContestsQuery, []);
        const pastContestsResult = await db.query(pastContestsQuery, []);
        return res.status(200).json({
            contests: {
                running: runningContestsResult.rows,
                upcoming: upcomingContestsResult.rows,
                recent: pastContestsResult.rows,
            },
            message: 'Successfully retrieved contests data',
        });
    } catch (e) {
        console.log('Error occured while processing');
        console.log(e);
    }
};

export const getContestDetail = async (req, res) => {
    try {
        const { contestId } = req.params;
        const contestQueryResult = await db.query('select * from contest where cid=$1', [
            contestId,
        ]);
        if (contestQueryResult.rowCount === 0) {
            return res.status(404).json({ message: 'Invalid contest id' });
        }
        const contestDetails = contestQueryResult.rows[0];
        const contestStartTimestamp = new Date(contestDetails.start_time);
        const currentTimestamp = new Date();
        if (contestStartTimestamp <= currentTimestamp) {
            const contestProblemsResult = await db.query(
                'select pid as problemId, name as problemName from problem where contest_id=$1',
                [contestId]
            );
            contestDetails.problems = contestProblemsResult.rows;
        }
        return res.status(200).json({ contestDetails, message: 'Hello Hostcode' });
    } catch (e) {
        console.log('Error occured while processing');
        console.log(e);
    }
};

export const getContestUserSubmissions = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Hello Hostcode' });
    } catch (e) {
        console.log('Error occured while processing');
        console.log(e);
    }
};

export const getContestStandings = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Hello Hostcode' });
    } catch (e) {
        console.log('Error occured while processing');
        console.log(e);
    }
};
