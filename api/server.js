const express = require('express');
const cors = require('cors');
const usersRouter = require('./users/users-router.js');

const server = express();

server.use(cors());
server.use(express.json());

server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({
    message: 'User Management API',
    endpoints: {
      'GET /api/users': 'Get all users',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create new user',
      'PUT /api/users/:id': 'Update user',
      'DELETE /api/users/:id': 'Delete user'
    }
  });
});

server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = server;