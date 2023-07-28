const express = require('express');
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const app = express();
const sqlite = require('sqlite3').verbose();
const url = require('url');
const db = new sqlite.Database('./quote.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) {
        return console.log(err);
    }
});

let sql;

app.use(bodyParser.json());

app.post('/quote', (req, res) => {
    try {
        const { movie, quote, character } = req.body;
        sql = 'INSERT INTO quote(movie, quote, character) VALUES (?, ?, ?)';
        db.run(sql, [movie, quote, character], (err) => {
            if (err) {
                return res.json({
                    status: 300,
                    success: false,
                    error: err,
                });
            } else {
                console.log('Record created successfully... ', movie, quote, character);
            }
        });
        return res.json({
            status: 200,
            success: true,
        });
    } catch(error) {
        console.log(error);
        return res.json({
            status: 400,
            success: false,
        });
    }
});

app.get('/quote', (req, res) => {
    sql = 'SELECT * FROM quote;';
    try {
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.json({
                    status: 300,
                    success: false,
                    error: err,
                });
            }

            if (rows.length < 1) {
                return res.json({
                    status: 300,
                    success: false,
                    error: 'No match',
                });
            }

             return res.json({
                status: 200,
                success: true,
                data: rows,
             });
        });
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        });
    }
});

app.listen(3000, console.log('Listening on port 3000'));
