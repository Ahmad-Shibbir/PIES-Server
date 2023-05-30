const express = require('express');
const Borrow = require('../models/Borrow');
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
const router = express.Router();

// Create a new borrow
router.post('/borrows/:id', verifyToken, async (req, res) => {
  try {
    const {  _id,itemName, description, owner, itemImg, itemStat } = req.body;
    const itemId= req.params.id;
    const borrow = new Borrow({
        itemId,
      itemName,
      description,
      owner,
      borrower: req.user.id,
      itemImg,
      itemStat
    });

    const newBorrow = await borrow.save();
    res.status(201).json(newBorrow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create borrow' });
  }
});

// Get all borrows
router.get('/borrows', async (req, res) => {
  try {
    const borrows = await Borrow.find();
    res.json(borrows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get borrows' });
  }
});

// Get a single borrow by ID
router.get('/borrows/:id', async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.id);
    
    if (!borrow) {
      return res.status(404).json({ error: 'Borrow not found' });
    }

    res.json(borrow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get borrow' });
  }
});

// Update a borrow by ID
router.put('/borrows/:id', async (req, res) => {
  try {
    const { itemName, description, owner, borrower, itemImg, itemStat } = req.body;

    const updatedBorrow = await Borrow.findByIdAndUpdate(
      req.params.id,
      { itemName, description, owner, borrower, itemImg, itemStat },
      { new: true }
    );
    
    if (!updatedBorrow) {
      return res.status(404).json({ error: 'Borrow not found' });
    }

    res.json(updatedBorrow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update borrow' });
  }
});

// Delete a borrow by ID
router.delete('/borrows/:id', async (req, res) => {
  try {
    const deletedBorrow = await Borrow.findByIdAndDelete(req.params.id);

    if (!deletedBorrow) {
      return res.status(404).json({ error: 'Borrow not found' });
    }

    res.json(deletedBorrow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete borrow' });
  }
});

module.exports = router;
