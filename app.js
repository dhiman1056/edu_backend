import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/connectdb.js';
import userRoutes from './routes/userRoutes.js';
import orgRoutes from './routes/orgRoutes.js';
import userProfileRoutes from './routes/userProfileRoutes.js';
import productRoutes from './routes/productRoutes.js';
import productCartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import { swaggerDocs, swaggerUi } from './configs/swagger.js';
import errorHandler from './errorhandlers/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//cors policy
app.use(cors());

//db connection
connectDB(DATABASE_URL);

//api will return json
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/user",userRoutes);
app.use("/api/org",orgRoutes);
app.use("/api/userProfile",userProfileRoutes);
app.use("/api/products",productRoutes);
app.use('/api/cart',productCartRoutes);
app.use('/api/order',orderRoutes);

// Place the error handler after all other middleware and routes
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/api-docs`)
})