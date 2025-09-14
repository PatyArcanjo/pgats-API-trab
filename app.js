const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const studentController = require('./controller/studentController');
const authController = require('./controller/authController');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
app.use(bodyParser.json());

// Swagger endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth
app.post('/login', authController.login);

// Students
app.post('/students', authMiddleware, studentController.registerStudent);
app.get('/students/:username', authMiddleware, studentController.getStudent);
app.post('/students/:username/notas', authMiddleware, studentController.addNota);

module.exports = app;
