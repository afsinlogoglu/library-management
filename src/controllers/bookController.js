const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBook = async (req, res) => {
  const user = await prisma.book.create({
    data: req.body,
  });
  res.status(201).json(user);
};

const listBooks = async (req, res) => {
  const users = await prisma.book.findMany({
    include: { barrowedBy: true },
  });
  res.status(200).json(users);
};

const borrowBook = async (req, res) => {
    const { userId } = req.params;
    const { bookId } = req.params;
  
    try {
        //check if user and book exist
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      const book = await prisma.book.findUnique({
        where: { id: parseInt(bookId) },
      });
  
      if (!user || !book) {
        return res.status(404).json({ error: 'User or book not found' });
      }
  
      // check if the book is already borrowed by the user
      const existingBorrow = await prisma.borrow.findFirst({
        where: { bookId: parseInt(bookId), userId: parseInt(userId), returnedAt: null },
      });
  
      if (existingBorrow) {
        return res.status(400).json({ error: 'Book is already borrowed by this user' });
      }
  
      // borrow the book
      const borrow = await prisma.borrow.create({
        data: {
          userId: parseInt(userId),
          bookId: parseInt(bookId),
          borrowedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
      });
  
      res.status(201).json({ message: 'Book borrowed successfully', borrow });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while borrowing the book' });
    }
  };
  
  const returnBook = async (req, res) => {
    const { userId, bookId } = req.params;
    const { rating } = req.body;
  
    try {
      // check if user and book exist
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });
      const book = await prisma.book.findUnique({
        where: { id: parseInt(bookId) },
      });
  
      if (!user || !book) {
        return res.status(404).json({ error: 'User or book not found' });
      }
  
      // check if the book is borrowed by the user
      const borrowRecord = await prisma.borrow.findFirst({
        where: { bookId: parseInt(bookId), userId: parseInt(userId), returnedAt: null },
      });
  
      if (!borrowRecord) {
        return res.status(400).json({ error: 'Book was not borrowed by this user or already returned' });
      }
  
      // return the book
      await prisma.borrow.update({
        where: { id: borrowRecord.id },
        data: {
          returnedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          rating: parseFloat(rating),
        },
      });
  
      // update the book's average rating
      const allRatings = await prisma.borrow.findMany({
        where: { bookId: parseInt(bookId), rating: { not: null } },
        select: { rating: true },
      });
  
      const newAverageRating = allRatings.reduce((acc, curr) => acc + curr.rating, 0) / allRatings.length;
  
      await prisma.book.update({
        where: { id: parseInt(bookId) },
        data: { averageRating: newAverageRating },
      });
  
      res.status(200).json({ message: 'Book returned successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while returning the book' });
    }
  };

module.exports = {
  createUser,
  listUsers,
  barrowBook,
  returnBook,
};