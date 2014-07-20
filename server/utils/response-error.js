/**
 * Created by IronMan on 7/19/14.
 */

var error = {
    MISSING_FIELDS: {
        code: 4001,
        message: 'Request missing required fields.',
        status_code: 400
    },
    INTERNAL_SERVER_ERROR: {
        code: 4000,
        message: 'Internal Server Error. Please try again.',
        status_code: 500
    },
    INVALID_PAIRCODE: {
        code: 4002,
        message: 'Invalid Pair Code. Please verify again.',
        status_code: 403
    }
};

module.exports = error;