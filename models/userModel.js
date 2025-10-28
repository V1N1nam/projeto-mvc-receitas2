// Importa o pool de conexões com o banco de dados.
// Ajuste o caminho se o seu arquivo de configuração estiver noutro local.
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const userModel = {
    // Encontra um utilizador pelo email (usado no login)
    async findByEmail(email) {
        try {
            const query = 'SELECT * FROM Users WHERE email = ?';
            const [rows] = await pool.query(query, [email]);
            return rows[0]; // Retorna o primeiro utilizador encontrado ou undefined
        } catch (error) {
            console.error('Erro ao buscar utilizador por email:', error);
            throw error;
        }
    },

    // Encontra um utilizador pelo ID
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

    // Cria um novo utilizador (usado no registo)
    async create(name, email, password) {
        try {
            // Criptografa a senha antes de salvar
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            const query = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
            const [result] = await pool.query(query, [name, email, hashedPassword]);
            return { id: result.insertId, name, email }; // Retorna o novo utilizador
        } catch (error) {
            console.error('Erro ao criar utilizador:', error);
            throw error;
        }
    }
};

module.exports = userModel;
