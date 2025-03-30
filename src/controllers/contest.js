import db from '../config/database.js';
import { createContestStandingsView } from '../utils/contest.js';

export const getContests = async (req, res) => {
    try {
        const runningContestsQuery =
            "select c.cid, c.name, c.start_time, c.end_time, json_agg(json_build_object('user_id', u.uid, 'username', u.username)) as authors from contest c inner join contest_author ca on c.cid = ca.contest_id inner join users u on ca.author_id = u.uid where c.start_time <= NOW() and c.end_time >= NOW() group by c.cid;";
        const upcomingContestsQuery =
            "select c.cid, c.name, c.start_time, c.end_time, json_agg(json_build_object('user_id', u.uid, 'username', u.username)) as authors from contest c inner join contest_author ca on c.cid = ca.contest_id inner join users u on ca.author_id = u.uid where c.start_time > NOW() group by c.cid order by c.start_time asc limit 5;";
        const pastContestsQuery =
            "select c.cid, c.name, c.start_time, c.end_time, json_agg(json_build_object('user_id', u.uid, 'username', u.username)) as authors from contest c inner join contest_author ca on c.cid = ca.contest_id inner join users u on ca.author_id = u.uid where c.end_time < NOW() group by c.cid order by c.end_time desc limit 5;";
        const runningContestsResult = await db.query(runningContestsQuery);
        const upcomingContestsResult = await db.query(upcomingContestsQuery);
        const pastContestsResult = await db.query(pastContestsQuery);
        return res.status(200).json({
            contests: {
                running: runningContestsResult.rows,
                upcoming: upcomingContestsResult.rows,
                recent: pastContestsResult.rows,
            },
            message: 'Successfully retrieved contests data',
        });
    } catch (e) {
        console.log('Error occured while fetching contests');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
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
                'select pid as problem_id, name as problem_name from problem where contest_id=$1',
                [contestId]
            );
            contestDetails.problems = contestProblemsResult.rows;
        }
        return res
            .status(200)
            .json({ contestDetails, message: 'Successfully retieved contest details' });
    } catch (e) {
        console.log('Error occured while fetching details of the contest');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};

export const getContestUserSubmissions = async (req, res) => {
    try {
        const { user_id } = req;
        const { contestId } = req.params;
        const contestResult = await db.query('select * from contest where cid = $1', [contestId]);
        if (contestResult.rowCount === 0) {
            return res.status(404).json({ message: 'Invalid contest id' });
        }
        const userContestSubmissionsResult = await db.query(
            'select s.sid as submission_id, p.pid as problem_id, p.name as problem_name, sl.language, ss.label as submission_status_lablel from contest c inner join problem p on p.contest_id = c.cid inner join submission s on p.pid = s.problem_id inner join submission_status ss on ss.status_id = s.submission_status_id inner join supported_language sl on s.language_id = sl.lid where c.cid = $1 and s.submitted_by = $2; ',
            [contestId, user_id]
        );
        return res.status(200).json({
            submissions: userContestSubmissionsResult.rows,
            message: 'Successfully retrieved user submissions of the contest',
        });
    } catch (e) {
        console.log('Error occured while retrieving user submissions of the contest');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};

export const getContestStandings = async (req, res) => {
    try {
        const { contestId } = req.params;
        const { pageSize, pageNum } = req.query;
        if (pageNum === null || pageNum === undefined) {
            return res.status(400).json({ message: 'Please pass pageNum query parameter' });
        }
        if (pageSize === null || pageSize === undefined) {
            return res.status(400).json({ message: 'Please pass pageSize query parameter' });
        }
        const totalRecordsResult = await db.query(
            `select count(*) as total_records from contest_${contestId}_standings`
        );
        const standingsResult = await db.query(
            `select * from contest_${contestId}_standings order by total_score desc, user_id offset $1 limit $2`,
            [(pageNum - 1) * pageSize, pageSize]
        );
        return res.status(200).json({
            totalRecords: totalRecordsResult.rows[0].total_records,
            standings: standingsResult.rows,
            message: 'Successhully retrieved standings of the contest',
        });
    } catch (e) {
        console.log('Error occured while retrieving standing of the contest');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};

export const registerUserContest = async (req, res) => {
    try {
        const { contestId } = req.params;
        const { user_id } = req;
        const validateContest = await db.query('select * from contest where cid=$1', [contestId]);
        if (validateContest.rowCount === 0) {
            return res.status(404).send({ message: 'Invalid contest_id' });
        }
        const contest = validateContest.rows[0];
        const startTime = new Date(contest.start_time);
        const now = new Date();
        if (startTime <= now) {
            return res
                .status(400)
                .send({ message: 'Could not register as contest is running or completed' });
        } else {
            const alreadyRegisteredContestResult = await db.query(
                'select * from contest_registration where contest_id = $1 and user_id = $2',
                [contestId, user_id]
            );
            if (alreadyRegisteredContestResult.rowCount === 0) {
                await db.query(
                    'insert into contest_registration(user_id, contest_id) values($1, $2)',
                    [user_id, contestId]
                );
                return res.status(200).send({ message: 'Registered Successfully' });
            } else {
                return res
                    .status(400)
                    .send({ message: 'Could not register as user is already registered' });
            }
        }
    } catch (e) {
        console.log('Error occured while registering user for the contest');
        console.log(e);
        return res.status(500).json({ message: 'Error occurred while processing' });
    }
};
