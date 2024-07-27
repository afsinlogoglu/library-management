const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const moment = require('moment');


const createUser = async (req, res) => {
    const { name } = req.body;
    const user = await prisma.user.create({
      data: {
        name,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
    });
    res.status(201).json(user);
  };
  
  const listUsers = async (req, res) => {
    const users = await prisma.user.findMany({
      include: { borrowedBooks: true },
    });
    res.status(200).json(users);
  };

module.exports = {
  createUser,
  listUsers,
};
