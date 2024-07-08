const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();
const PORT = 9001;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
        throw error; // Handle error gracefully, terminate if unable to connect
    }
    console.log('Database connected successfully');
});

app.get('/', (req, res) => {
    let sql = `SELECT * FROM users`;
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json(results);
    });
});

app.post('/api/create', (req, res) => {
    try {
        let { name, email, work } = req.body;
        let sql = "INSERT INTO users SET ?";

        connection.query(sql, { name, email, work }, (error, result) => {
            if (error) {
                console.error('Error creating user:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error('Exception in creating user:', error);
        res.status(400).send(error.message);
    }
});

app.get("/api/:id", (req, res) => {
    let sql = `SELECT * FROM users WHERE id = ${req.params.id}`;
    console.log(sql);
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error fetching user:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json(result);
    });
});

app.put('/api/update/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, work } = req.body;
        let sql = `UPDATE users SET name='${name}', email='${email}', work='${work}' WHERE id=${id}`;

        connection.query(sql, (error, result) => {
            if (error) {
                console.error('Error updating user:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.status(200).json(result);
        });
    } catch (error) {
        console.error('Exception in updating user:', error);
        res.status(400).send(error.message);
    }
});

app.delete('/api/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM users WHERE id=${id}`;
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error deleting user:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening at: http://localhost:${PORT}`);
});
