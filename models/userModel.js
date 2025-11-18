
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const userModel = {
    async findByEmail(email) {
        try {
            const query = 'SELECT * FROM Users WHERE email = ?';
            const [rows] = await pool.query(query, [email]);
            return rows[0]; 
        } catch (error) {
            console.error('Erro ao buscar utilizador por email:', error);
            throw error;
        }
    },

    async findById(id) {
        try {
            const query = 'SELECT id, name, email FROM Users WHERE id = ?';
            const [rows] = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            console.error('Erro ao buscar utilizador por ID:', error);
            throw error;
        }
    },

    async create(name, email, password) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const query = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
            const [result] = await pool.query(query, [name, email, hashedPassword]);
            return { id: result.insertId, name, email };
        } catch (error) {
            console.error('Erro ao criar utilizador:', error);
            throw error;
        }
    }
};

module.exports = userModel;
