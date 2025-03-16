import db from '../config/database.js';

export const createContestStandingsView = async (contest_id) => {
    try {
        const viewQuery = `CREATE MATERIALIZED VIEW contest_${contest_id}_standings AS with problem_attempts as ( select cr.user_id as user_id, p.pid as problem_id, COALESCE(BOOL_OR(s.submission_status_id = 2), FALSE) as is_solved, COUNT(*) FILTER (WHERE s.submission_status_id != 2 and s.submission_status_id != 1) as failed_attempts from contest_registration cr INNER JOIN problem p on p.contest_id = cr.contest_id LEFT JOIN submission s on p.pid = s.problem_id and s.submitted_by = cr.user_id where p.contest_id = ${contest_id} GROUP BY cr.user_id, p.pid ) select pa.user_id, u.username, SUM( CASE WHEN pa.is_solved THEN p.score - pa.failed_attempts ELSE 0 END) as total_score, array_agg( jsonb_build_object( 'problem_id', pa.problem_id, 'solved', pa.is_solved, 'failed_attempts', pa.failed_attempts)) as problems from problem_attempts pa inner join problem p on pa.problem_id = p.pid inner join users u on pa.user_id = u.uid group by pa.user_id, u.username;`;
        await db.query(viewQuery);
        const viewIndexQuery = `CREATE UNIQUE INDEX contest_${contest_id}_standings_user_id_idx ON contest_${contest_id}_standings (user_id);`
        await db.query(viewIndexQuery);
    } catch (e) {
        console.log('Error occured while creating view for contest:', contest_id);
        console.log(e);
    }
};
