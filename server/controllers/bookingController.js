const express = require('express');
const db = require('./db');
const multer = require('multer');
const path = require('path');

const createBooking = (req, res) => {
  const { est_finish_date, delivery_address, book_price, pullout_doc, trucker_id, client_id, container_id, payment_id } = req.body;

  const insertQuery = 'INSERT INTO booking (est_finish_date, delivery_address, status, book_price, pullout_doc, trucker_id, client_id, container_id, payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

  const status = "Pending";
  const data = [est_finish_date, delivery_address, status, book_price, pullout_doc, trucker_id, client_id, container_id, payment_id];
  try {
    db.query(insertQuery, data, (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).json({ status: 500, success: false, error: 'Error inserting data' });
      }

      if (result.affectedRows > 0) {
        return res.status(200).json({
          status: 200,
          success: true,
          data: result,
        });
      } else {
        return res.status(500).json({ status: 500, success: false, error: 'Record insertion failed' });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ status: 500, success: false, error: 'An error occurred' });
  }
}

const updateBooking = (req, res) => {
  const { booking_id, ...updateData } = req.body;

  // Construct the SQL query dynamically based on the provided clause
  let updateQuery = 'UPDATE booking SET ';
  let data = [];
  let updateClauseIndex = 0;

  for (const [key, value] of Object.entries(updateData)) {
    updateQuery += `${key}=?`;
    if (updateClauseIndex < Object.keys(updateData).length - 1) {
      updateQuery += ', ';
    }
    data.push(value);
    updateClauseIndex++;
  }

  updateQuery += ` WHERE booking_id=?`;
  data.push(booking_id);

  console.log('SQL Query:', updateQuery);
  console.log('SQL Data:', data);

  // First query to update booking details
  db.query(updateQuery, data, (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error updating data' });
    }

    if (result.affectedRows > 0) {
      // Second query to update date_updated
      const dateUpdatedQuery = 'UPDATE booking SET date_updated = NOW() WHERE booking_id = ?';
      const dateUpdatedData = [booking_id];
      
      db.query(dateUpdatedQuery, dateUpdatedData, (dateUpdatedErr, dateUpdatedResult) => {
        if (dateUpdatedErr) {
          console.error('Error updating date_updated:', dateUpdatedErr);
          return res.status(500).json({ status: 500, success: false, error: 'Error updating date_updated' });
        }
      
        return res.status(200).json({
          status: 200,
          success: true,
          data: result,
        });
      });
      
    } else {
      return res.status(500).json({ status: 500, success: false, error: 'Updating record failed' });
    }
  });
};


const retrieveAll = (req, res) => {
  const retrieveRecs = 'SELECT * FROM booking'

  db.query(retrieveRecs, (err, rows) => {
    if (err) {
      console.error('Error retrieving all records:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error retrieving all records' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        records: rows,
      });
    }
  });
}

const retrieveByParams = (req, res) => {
  const { col, val, orderVal, order } = req.query;

  const orderValue = orderVal ? orderVal : col;
  const orderBy = order ? order : 'ASC';

  const retrieveSpecific = `SELECT * FROM booking WHERE ?? = ? ORDER BY ${orderValue} ${orderBy}`;

  db.query(retrieveSpecific, [col, val], (err, rows) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
    } else {
      const records = rows.map(row => {
        // Convert est_finish_date to a specific time zone
        const estFinishDate = new Date(row.est_finish_date);
        estFinishDate.setMinutes(estFinishDate.getMinutes() - estFinishDate.getTimezoneOffset());
        row.est_finish_date = estFinishDate.toISOString().split('T')[0];
        return row;
      });

      return res.status(200).json({
        status: 200,
        success: true,
        records: records,
      });
    }
  });
}


const retrieveByTwoParams = (req, res) => {
  const { col1, val1, col2, val2, orderVal, order } = req.query;

  const orderValue = orderVal ? orderVal : col1;
  const orderBy = order ? order : 'ASC';

  const retrieveSpecific = `SELECT * FROM booking WHERE ?? = ? AND ?? = ? ORDER BY ${orderValue} ${orderBy}`;

  db.query(retrieveSpecific, [col1, val1, col2, val2], (err, row) => {

    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        records: row,
      });
    }
  });
}

const retrieveThreeParams = (req, res) => {
  const { col1, val1, col2, val2, col3, val3 } = req.query;

  const retrieveSpecific = 'SELECT COUNT(*) as count FROM booking WHERE ?? = ? AND ?? = ? AND ??  = ?';
  db.query(retrieveSpecific, [col1, val1, col2, val2, col3, val3], (err, rows) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({
        status: 500,
        success: false,
        error: 'Error retrieving records'
      });
    } else {
      // Extract the count from the result

      const count = rows[0].count;


      return res.status(200).json({
        status: 200,
        success: true,
        count: count,
      });
    }
  });
};

const retrieveCountByParams = (req, res) => {
  const { col, val } = req.query;

  const retrieveSpecific = 'SELECT COUNT(*) as count FROM booking WHERE ?? = ?';

  db.query(retrieveSpecific, [col, val], (err, rows) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({
        status: 500,
        success: false,
        error: 'Error retrieving records'
      });
    } else {
      // Extract the count from the result
      const count = rows[0].count;

      return res.status(200).json({
        status: 200,
        success: true,
        count: count,
      });
    }
  });
};

const retrieveCountByTwoParams = (req, res) => {
  const { col1, val1, col2, val2 } = req.query;

  const retrieveSpecific = 'SELECT COUNT(*) as count FROM booking WHERE ?? = ? AND ?? = ?';
  db.query(retrieveSpecific, [col1, val1, col2, val2], (err, rows) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({
        status: 500,
        success: false,
        error: 'Error retrieving records'
      });
    } else {
      // Extract the count from the result
      const count = rows[0].count;
      return res.status(200).json({
        status: 200,
        success: true,
        count: count,
      });
    }
  });
};

const retrieveCountByThreeParams = (req, res) => {
  const { col1, val1, col2, val2, col3, val3 } = req.query;

  const retrieveSpecific = 'SELECT COUNT(*) as count FROM booking WHERE ?? = ? AND ?? = ? AND ?? = ?';
  db.query(retrieveSpecific, [col1, val1, col2, val2, col3, val3], (err, rows) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({
        status: 500,
        success: false,
        error: 'Error retrieving records'
      });
    } else {
      // Extract the count from the result
      const count = rows[0].count;
      return res.status(200).json({
        status: 200,
        success: true,
        count: count,
      });
    }
  });
};

const retrieveTotalCount = (req, res) => {
  const retrieveSpecific = 'SELECT COUNT(*) AS booking_count FROM booking';

  db.query(retrieveSpecific, (err, row) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
    } else {
      const bookingCount = row[0].booking_count; // Change record_count to user_count

      return res.status(200).json({
        status: 200,
        success: true,
        totalCount: bookingCount, // Change count to totalCount
      });
    }
  });
};

const retrieveBookingsThisMonth = (req, res) => {
  const { trucker_id } = req.query;
  const retrieveRecs = `
    SELECT DATE(CONVERT_TZ(booking_date,'+00:00','SYSTEM')) as date, COUNT(*) as count
    FROM booking
    WHERE MONTH(CONVERT_TZ(booking_date,'+00:00','SYSTEM')) = MONTH(CURRENT_DATE())
    AND YEAR(CONVERT_TZ(booking_date,'+00:00','SYSTEM')) = YEAR(CURRENT_DATE())
    AND trucker_id = ?
    GROUP BY DATE(CONVERT_TZ(booking_date,'+00:00','SYSTEM'))
    ORDER BY DATE(CONVERT_TZ(booking_date,'+00:00','SYSTEM'))`;

    db.query(retrieveRecs, [trucker_id], (err, rows) => {
      if (err) {
        console.error('Error retrieving all records:', err);
        return res.status(500).json({ status: 500, success: false, error: 'Error retrieving all records' });
      } else {
        // Convert dates to 'YYYY-MM-DD' format in local time
        const records = rows.map(record => {
          const date = new Date(record.date);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
          const day = String(date.getDate()).padStart(2, '0');
          return {
            date: `${month}/${day}/${year}`,
            count: record.count
          };
        });
    
        return res.status(200).json({
          status: 200,
          success: true,
          records: records,
        });
      }
    });
    
    
}


const completeBooking = (req, res) => {
  const { booking_id } = req.body;

  const completeBookingQuery = `
    UPDATE booking
    SET status = 'Completed', date_updated = NOW(), finish_date = NOW()
    WHERE booking_id = ?;
  `;

  const setIdleAssetQuery = `
    UPDATE asset
    SET status = 'Idle', booking_id = NULL, date_updated = NOW()
    WHERE booking_id = ?;
  `;

  db.query(completeBookingQuery, [booking_id], (err, result) => {
    if (err) {
      console.error('Error completing booking:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error completing booking' });
    } else {
      db.query(setIdleAssetQuery, [booking_id], (err, result) => {
        if (err) {
          console.error('Error setting asset to idle:', err);
          return res.status(500).json({ status: 500, success: false, error: 'Error setting asset to idle' });
        } else {
          return res.status(200).json({
            status: 200,
            success: true,
            message: 'Booking completed and asset set to idle successfully',
          });
        }
      });
    }
  });
}
const deleteBooking = (req, res) => {
  const { booking_id } = req.body;

  const deleteQuery = 'DELETE FROM booking WHERE booking_id = ?';

  db.query(deleteQuery, book_id, (err, result) => {
    if (err) {
      console.error('Error deleting record:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error deleting records' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        data: result,
      });
    }
  });
}

const setInvisible = (req, res) => {
  const { booking_id } = req.body;

  const setInvisibleQuery = `
    UPDATE booking b
    INNER JOIN payment p ON b.payment_id = p.payment_id
    SET b.is_visible = 0, p.is_visible = 0, b.date_updated = NOW(), p.date_updated = NOW()
    WHERE b.booking_id = ?;
  `;

  db.query(setInvisibleQuery, [booking_id], (err, result) => {
    if (err) {
      console.error('Error setting records to invisible:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error setting records to invisible' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Records set to invisible successfully',
      });
    }
  });
}

const cancelBooking = (req, res) => {
  const { booking_id } = req.body;

  const cancelBookingQuery = `
    UPDATE booking b
    INNER JOIN payment p ON b.payment_id = p.payment_id
    SET b.status = 'Cancelled', p.payment_status = 'Cancelled', b.date_updated = NOW(), p.date_updated = NOW()
    WHERE b.booking_id = ?;
  `;

  db.query(cancelBookingQuery, [booking_id], (err, result) => {
    if (err) {
      console.error('Error cancelling booking:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error cancelling booking' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Booking and payment cancelled successfully',
      });
    }
  });
}

//For File Upload/Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension);
  },
});

const upload = multer({ storage: storage }).single('file');

const submitFile = (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ status: 500, success: false, error: 'Multer error' });
    } else if (err) {
      return res.status(500).json({ status: 500, success: false, error: 'An error occurred during file upload' });
    }

    // File uploaded successfully, you can access the file details in req.file
    const filePath = req.file.path;

    // Update the corresponding booking record with the file path
    const bookingId = req.body.booking_id; // Assuming you're sending the booking_id in the request body
    const fileType = req.body.file_type; // Assuming you're sending the file_type in the request body

    let updateField;
    let updateFilePathQuery;

    // Determine which field to update based on the file type
    if (fileType === 'pullout_doc') {
      updateField = 'pullout_doc';
    } else if (fileType === 'eir_doc') {
      updateField = 'eir_doc';
    } else {
      return res.status(400).json({ status: 400, success: false, error: 'Invalid file type' });
    }

    // Update the corresponding field in the booking record
    updateFilePathQuery = `UPDATE booking SET ${updateField} = ? WHERE booking_id = ?`;

    db.query(updateFilePathQuery, [filePath, bookingId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating file path in the database:', updateErr);
        return res.status(500).json({ status: 500, success: false, error: 'Error updating file path in the database' });
      }

      return res.status(200).json({ status: 200, success: true, filePath: filePath });
    });
  });
};



module.exports = {
  createBooking,
  updateBooking,
  retrieveAll,
  retrieveByParams,
  retrieveByTwoParams,
  retrieveThreeParams,
  retrieveCountByParams,
  retrieveCountByTwoParams,
  retrieveCountByThreeParams,
  retrieveTotalCount,
  retrieveBookingsThisMonth,
  completeBooking,
  deleteBooking,
  setInvisible,
  cancelBooking,
  submitFile,
}