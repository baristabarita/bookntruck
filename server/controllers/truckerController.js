const express = require('express');
const db = require('./db');

const updateTrucker = async (req, res) => {
    try {
        const { truckerID } = req.query;
        const truckerUpdate = req.body.trucker || {}; // Access the 'trucker' property of the request body

        const cols = Object.keys(truckerUpdate);
        const values = Object.values(truckerUpdate);

        if (!truckerID || cols.length === 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid request. Missing parameters.',
            });
        }

        const setClause = cols.map((col) => `${col} = ?`).join(', ');

        // First query to update trucker details
        const sql = `UPDATE trucker SET ${setClause} WHERE trucker_id = ?`;
        db.query(sql, [...values, truckerID], (err, results) => {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Account update unsuccessful',
                    error: err.message,
                });
            } else {
                // Second query to update date_updated
                const dateUpdatedQuery = 'UPDATE trucker SET date_updated = CURRENT_TIMESTAMP() WHERE trucker_id = ?';
                const dateUpdatedData = [truckerID];

                db.query(dateUpdatedQuery, dateUpdatedData, (dateUpdatedErr, dateUpdatedResult) => {
                    if (dateUpdatedErr) {
                        console.error('Error updating date_updated:', dateUpdatedErr);
                        return res.status(500).json({ status: 500, success: false, error: 'Error updating date_updated' });
                    }

                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: 'Successfully updated account',
                        data: results,
                    });
                });
            }
        });
    } catch (error) {
        console.error('Error in updateTrucker:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const retrieveAll = (req, res) => {
    try {
        const sql = "SELECT * FROM trucker";
        db.query(sql, (err, results) => {
            if (err) {

                res.status(500).json({ error: 'Internal server error' })
            } else {
                res.json({
                    success: true,
                    trucker: results,
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
        });
    }
}

const retrieveByParams = (req, res) => {
    try {
        const { col, val } = req.query
        const sql = "SELECT * FROM trucker WHERE ?? = ?"
        db.query(sql, [col, val], (err, results) => {
            if (err) {

                res.status(201).json({ error: 'This Account does not exist' })
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    trucker: results
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
        });
    }
}

const retrieveByTwoParams = (req, res) => {
    try {
        const { col1, val1, col2, val2 } = req.query
        const sql = "SELECT * FROM trucker WHERE ?? = ? AND ?? = ?"
        db.query(sql, [col1, val1, col2, val2], (err, results) => {
            if (err) {

                res.status(201).json({ error: 'This Account does not exist' })
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    trucker: results
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
        });
    }
}

const retrieveByThreeParams = (req, res) => {
    try {
        const { col1, val1, col2, val2, col3, val3 } = req.query
        const sql = "SELECT * FROM trucker WHERE ?? = ? AND ?? = ? AND ?? = ?"
        db.query(sql, [col1, val1, col2, val2, col3, val3], (err, results) => {
            if (err) {

                res.status(201).json({ error: 'This Account does not exist' })
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    trucker: results
                })
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Database Error",
        });
    }
}

const retrieveCountByParams = (req, res) => {
    const { col, val } = req.query;

    const retrieveSpecific = 'SELECT COUNT(*) AS record_count FROM trucker WHERE ?? = ?';

    db.query(retrieveSpecific, [col, val], (err, row) => {
        if (err) {
            console.error('Error retrieving records:', err);
            return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
        } else {
            const recordCount = row[0].record_count;

            return res.status(200).json({
                status: 200,
                success: true,
                truckerCount: recordCount,
            });
        }
    });
}
const retrieveCountByTwoParams = (req, res) => {
    const { col1, val1, col2, val2 } = req.query;

    const retrieveSpecific = 'SELECT COUNT(*) AS record_count FROM trucker WHERE ?? = ? AND ?? = ?';

    db.query(retrieveSpecific, [col1, val1, col2, val2], (err, row) => {
        if (err) {
            console.error('Error retrieving records:', err);
            return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
        } else {
            const recordCount = row[0].record_count;

            return res.status(200).json({
                status: 200,
                success: true,
                truckerCount: recordCount,
            });
        }
    });
}

const retrieveTruckerCount = (req, res) => {
    const { year } = req.query

    const retrieveTruckerCount = 'SELECT YEAR(date_registered) AS reg_year , MONTH(date_registered) AS reg_month, COUNT(trucker_id) AS count_trucker FROM trucker WHERE YEAR(date_signedup) = ? AND trucker_status =  "active" GROUP BY MONTH(date_registered);'

    db.query(retrieveTruckerCount, [year], (err, truckers) => {
        if (err) {
            console.error('Error retrieving truckers:', err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: 'Error retrieving truckers'
            });
        } else {
            const truckerCount = truckers;

            return res.status(200).json({
                status: 200,
                success: true,
                truckerCount: truckerCount,
            });
        }
    })
}

const retrieveTotalCount = (req, res) => {
    const retrieveSpecific = 'SELECT COUNT(*) AS trucker_count FROM trucker';

    db.query(retrieveSpecific, (err, row) => {
        if (err) {
            console.error('Error retrieving records:', err);
            return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
        } else {
            const truckerCount = row[0].trucker_count; // Change record_count to user_count

            return res.status(200).json({
                status: 200,
                success: true,
                totalCount: truckerCount, // Change count to totalCount
            });
        }
    });
};

const deactivateTrucker = async (req, res) => {
    try {
        const { truckerID } = req.query;

        if (!truckerID) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid request. Missing parameters.',
            });
        }

        // SQL query to update the user status and trucker status
        let sql = `UPDATE user, trucker 
                   SET user.status = 'deactivated', 
                       trucker.trucker_status = 'Unavailable', 
                       trucker.is_viewable = 0, 
                       trucker.date_updated = NOW() 
                   WHERE user.user_id = trucker.user_id 
                   AND trucker.trucker_id = ?`;

        // Execute the query
        db.query(sql, [truckerID], (err, result) => {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Account update unsuccessful',
                    error: err.message,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Successfully deactivated trucker',
                    data: result,
                });
            }
        });
    } catch (error) {
        console.error('Error in deactivateTrucker:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const deleteTrucker = async (req, res) => {
    try {
        const { truckerID } = req.query;

        if (!truckerID) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Invalid request. Missing parameters.',
            });
        }

        // SQL query to update the user status and trucker status
        let sql = `UPDATE user, trucker 
                   SET user.status = 'deleted', 
                       trucker.trucker_status = 'Unavailable', 
                       trucker.is_viewable = 0, 
                       trucker.date_updated = NOW() 
                   WHERE user.user_id = trucker.user_id 
                   AND trucker.trucker_id = ?`;

        // Execute the query
        db.query(sql, [truckerID], (err, result) => {
            if (err) {
                console.error('Error updating data:', err);
                res.status(500).json({
                    status: 500,
                    success: false,
                    message: 'Account update unsuccessful',
                    error: err.message,
                });
            } else {
                res.status(200).json({
                    status: 200,
                    success: true,
                    message: 'Successfully deleted trucker',
                    data: result,
                });
            }
        });
    } catch (error) {
        console.error('Error in deleteTrucker:', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

const harddeleteDetails = (req, res) => {
    try {
        const { trucker_id } = req.query;
        const sql = 'DELETE FROM trucker WHERE trucker_id = ?';

        db.query(sql, [trucker_id], (err, results) => {
            if (err) {
                console.error('Error deleting trucker record:', err);
                res.status(200).json({
                    status: 500,
                    success: false,
                    message: 'Error deleting trucker record',
                    error: err.message,
                });
            } else {
                if (results.affectedRows === 0) {
                    res.status(200).json({
                        status: 404,
                        success: false,
                        message: 'Trucker Record not found',
                    });
                } else {
                    res.status(200).json({
                        status: 200,
                        success: true,
                        message: 'Trucker Record deleted successfully',
                    });
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Database Error',
            error: error.message,
        });
    }
};

module.exports = {
    updateTrucker,
    retrieveAll,
    retrieveByParams,
    retrieveByTwoParams,
    retrieveByThreeParams,
    retrieveCountByParams,
    retrieveCountByTwoParams,
    retrieveTruckerCount,
    retrieveTotalCount,
    deactivateTrucker,
    deleteTrucker,
    harddeleteDetails
}