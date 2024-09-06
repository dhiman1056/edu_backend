// configs/swagger.js
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Edu API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Edu',
    },
    servers: [
      {
        url: 'http://localhost:8000', // Update this with your server URL if different
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files for API documentation
};

// Create Swagger documentation
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Export both swaggerDocs and swaggerUi for easy integration in app.js
export { swaggerDocs, swaggerUi };
