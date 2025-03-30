export const calculateFinalTestResult = (tests) => {
    let ce = 0,
        ac = 0,
        wa = 0,
        tle = 0,
        re = 0;
    tests.forEach(({ testStatus }) => {
        if (testStatus === 'CE') {
            ce++;
        } else if (testStatus === 'WA') {
            wa++;
        } else if (testStatus === 'AC') {
            ac++;
        } else if (testStatus === 'RE') {
            re++;
        } else if (testStatus === 'TLE') {
            tle++;
        }
    });
    if (ce > 0) {
        return 'CE';
    }
    if (re > 0) {
        return 'RE';
    }
    if (tle > 0) {
        return 'TLE';
    }
    if (wa > 0) {
        return 'WA';
    }
    return 'AC';
};

export const getSubmissionStatusId = (status) => {
    if (status === 'AC') {
        return 2;
    }
    if (status === 'WA') {
        return 1;
    }
    if (status === 'TLE') {
        return 1;
    }
    if (status === 'RE') {
        return 1;
    }
    if (status === 'CE') {
        return 1;
    }
};
