const express = require('express');
const db = require('./db');

const createAsset = (req, res) => {
  const { asset_category, asset_name, brand, type, measurements, weight, plate_number, trucker_id } = req.body;

  let sql = '';
  let params = [];
  console.log("Received request body:", req.body);
  if (asset_category === 'Truck') {
    sql = 'INSERT INTO asset (asset_category, asset_name, brand, type, plate_number, trucker_id) VALUES (?, ?, ?, ?, ?, ?)';
    params = [asset_category, asset_name, brand, type, plate_number, trucker_id];
  } else if (asset_category === 'Trailer') {
    sql = 'INSERT INTO asset (asset_category, type, measurements, weight, plate_number, trucker_id) VALUES (?, ?, ?, ?, ?, ?)';
    params = [asset_category, type, measurements, weight, plate_number, trucker_id];
  } else {
    return res.status(400).json({ error: 'Invalid asset category' });
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Asset created successfully', affectedRows: result.affectedRows });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

const updateAsset = (req, res) => {
  const { asset_id, asset_category, asset_name, brand, type, measurements, weight, plate_number, status } = req.body;

  let sql = '';
  let params = [];

  if (asset_category === 'Truck') {
    sql = 'UPDATE asset SET asset_name=?, brand=?, type=?, plate_number=?, status=? WHERE asset_id=?';
    params = [asset_name, brand, type, plate_number, status, asset_id];
  } else if (asset_category === 'Trailer') {
    sql = 'UPDATE asset SET type=?, measurements=?, weight=?, plate_number=?, status=? WHERE asset_id=?';
    params = [type, measurements, weight, plate_number, status, asset_id];
  } else {
    return res.status(400).json({ error: 'Invalid asset category' });
  }

  console.log('SQL Query:', sql);
  console.log('SQL Data:', params);

  // First query to update asset details
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows > 0) {
      // Second query to update date_updated
      const dateUpdatedQuery = 'UPDATE asset SET date_updated = CURRENT_TIMESTAMP() WHERE asset_id = ?';
      const dateUpdatedData = [asset_id];

      db.query(dateUpdatedQuery, dateUpdatedData, (dateUpdatedErr, dateUpdatedResult) => {
        if (dateUpdatedErr) {
          console.error('Error updating date_updated:', dateUpdatedErr);
          return res.status(500).json({ status: 500, success: false, error: 'Error updating date_updated' });
        }

        return res.status(200).json({ message: 'Asset updated successfully', affectedRows: result.affectedRows });
      });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

const setAssetBooking = (req, res) => {
  const { asset_id, status, booking_id } = req.body;
  let sql = '';
  let params = [];
  sql = 'UPDATE asset SET status=?, booking_id=? WHERE asset_id=?';
  params = [status, booking_id, asset_id];
  console.log('SQL Asset Query:', sql);
  console.log('SQL Asset Data:', params);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Asset assigned successfully', affectedRows: result.affectedRows });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}

const retrieveAll = (req, res) => {
  const retrieveRecs = 'SELECT * FROM asset'

  db.query(retrieveRecs, (err, rows) => {
    if (err) {
      console.error('Error retrieving all records:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error retrieving all records' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        data: rows,
      });
    }
  });
}

const retrieveByParams = (req, res) => {
  const { col, val } = req.query;

  const retrieveSpecific = 'SELECT * FROM asset WHERE ?? = ?';

  db.query(retrieveSpecific, [col, val], (err, row) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        data: row,
      });
    }
  });
}

const retrieveByTwoParams = (req, res) => {
  const { col1, val1, col2, val2 } = req.query;

  const retrieveSpecific = `SELECT * FROM asset WHERE ?? = ? AND ?? = ? ORDER BY asset_id ASC`;

  db.query(retrieveSpecific, [col1, val1, col2, val2], (err, rows) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        data: rows,
      });

    }
  });
}

const retrieveByThreeParams = (req, res) => {
  const { col1, val1, col2, val2, col3, val3 } = req.query;

  const retrieveSpecific = 'SELECT * FROM asset WHERE ?? = ? AND ?? = ? AND ??  = ?';
  db.query(retrieveSpecific, [col1, val1, col2, val2, col3, val3], (err, rows) => {
    if (err) {
      console.error('Error retrieving records:', err);
      return res.status(500).json({
        status: 500,
        success: false,
        error: 'Error retrieving records'
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        data: rows,
      });
    }
  });
};

const retrieveCountByTwoParams = (req, res) => {
  const { col1, val1, col2, val2 } = req.query;

  const retrieveSpecific = 'SELECT COUNT(*) AS asset_count FROM asset WHERE ?? = ? AND ?? = ?';

  db.query(retrieveSpecific, [col1, val1, col2, val2], (err, row) => {
      if (err) {
          console.error('Error retrieving records:', err);
          return res.status(500).json({ status: 500, success: false, error: 'Error retrieving records' });
      } else {
          const assetCount = row[0].asset_count;

          return res.status(200).json({
              status: 200,
              success: true,
              totalCount: assetCount,
          });
      }
  });
};

const setAssetInvisible = (req, res) => {
  const { asset_id } = req.body;

  const setInvisibleQuery = `
    UPDATE asset
    SET is_visible = 0, date_updated = NOW()
    WHERE asset_id = ?;
  `;

  db.query(setInvisibleQuery, [asset_id], (err, result) => {
    if (err) {
      console.error('Error setting asset record to invisible:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error setting asset record to invisible' });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Asset record set to invisible successfully',
      });
    }
  });
}

const deleteAsset = (req, res) => {
  const { asset_id } = req.body;

  const deleteQuery = 'DELETE FROM asset WHERE asset_id = ?';

  db.query(deleteQuery, asset_id, (err, result) => {
    if (err) {
      console.error('Error deleting record:', err);
      return res.status(500).json({ status: 500, success: false, error: 'Error deleting record' });
    } else {
      if (result.affectedRows > 0) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: 'Asset deleted successfully',
        });
      } else {
        return res.status(500).json({ status: 500, success: false, error: 'Asset not found or could not be deleted' });
      }
    }
  });
};

module.exports = {
  createAsset,
  updateAsset,
  setAssetBooking,
  retrieveAll,
  retrieveByParams,
  retrieveByTwoParams,
  retrieveByThreeParams,
  retrieveCountByTwoParams,
  setAssetInvisible,
  deleteAsset,
}