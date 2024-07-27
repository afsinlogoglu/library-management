const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);
const bookRoutes = require('./routes/bookRoutes');
app.use('/api', bookRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
