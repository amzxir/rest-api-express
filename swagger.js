// swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'My Express API with Swagger',
    },
    servers: [
      {
        url: 'http://127.0.0.1:3002',
      },
    ],
  },
  apis: ['./swagger-docs.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
