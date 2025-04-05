import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js'; // make sure routes/index.js exists and exports a router
import repoRoutes from './routes/repositoryRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import commitRoutes from './routes/commitRoutes.js'
import branchRoutes from './routes/branchRoutes.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Test database connection
// sequelize.authenticate()
//   .then(() => {
//     console.log('Database connection established successfully.');
//     // Sync all models (optional if you're using manual SQL schema)
//     return sequelize.sync();
//   })
//   .then(() => {
//     console.log('Database models synchronized.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    // Do NOT sync if using manual schema
    // return sequelize.sync();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// API routes
app.use('/', authRoutes);
app.use('/repo',repoRoutes)
app.use('/branch',branchRoutes)
app.use('/file',fileRoutes)
app.use('/commit',commitRoutes)



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



export { app, sequelize };
