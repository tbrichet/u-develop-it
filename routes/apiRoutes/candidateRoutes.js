const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

// GET single candidate
// Originally app.get('/api/candidate/:id', (req, res) => {
router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
               AS party_name 
               FROM candidates 
               LEFT JOIN parties 
               ON candidates.party_id = parties.id 
               WHERE candidates.id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: row
      });
    });
  });
  
// Get all candidates
//Originally app.get('/api/candidates', (req, res) => {
router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
               AS party_name 
               FROM candidates 
               LEFT JOIN parties 
               ON candidates.party_id = parties.id`;
    const params = [];
    db.all(sql, params, (err, rows) => {
      if (err) {
        // 500 error message if server error
        res.status(500).json({ error: err.message });
        return;
      }
      // Send response as a JSON object to the browser
      res.json({
        message: 'success',
        data: rows
      });
    });
  });
  
// Delete a candidate
// Originally app.delete('/api/candidate/:id', (req, res) => {
router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
  
      res.json({
        message: 'successfully deleted',
        changes: this.changes
      });
    });
  });
  
// Create a candidate
// Orignally app.post('/api/candidate', ({ body }, res) => {
router.post('/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
                VALUES (?,?,?)`;
  
    const params = [body.first_name, body.last_name, body.industry_connected];
    
    // ES5 function, not arrow function, to use `this`
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: body,
        id: this.lastID
      });
    });
  });

// UPDATE a candidate's party affiliation
// Originally app.put('/api/candidate/:id', (req, res) => {
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
  
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    
    const sql = `UPDATE candidates SET party_id = ? 
                 WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
  
    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
  
      res.json({
        message: 'success',
        data: req.body,
        changes: this.changes
      });
    });
  });

module.exports = router;