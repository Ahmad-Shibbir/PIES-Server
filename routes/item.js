const express = require('express');
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
  
const router = express.Router();
// const jwt = require('jsonwebtoken');
const Item = require('../models/Item');

// Middleware to authenticate user using JWT
// const authenticateUser = (req, res, next) => {
//   // Extract the token from the request headers or query parameters
//   const token = req.headers.authorization || req.query.token;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   try {
//     // Verify and decode the token
//     const decoded = jwt.verify(token, 'your-secret-key');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
// };

// Create a new item
router.post('/items', verifyToken, async (req, res) => {
  try {
    const { itemName, description, itemType } = req.body;
    const owner = req.user.id;

    const newItem = new Item({
      itemName,
      description,
      owner,
      itemType
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// GET ALL ITEMS

// router.post('/items', verifyToken, async (req, res) => {
//     try {
//       const { itemName, description, itemType } = req.body;
//       const owner = req.user.id;
//       console.log(owner);
  
//       const newItem = new Item({
//         itemName,
//         description,
//         owner,
//         itemType
//       });
  
//       const savedItem = await newItem.save();
//       res.status(201).json(savedItem);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to create item' });
//     }
//   });


// Get all items

// 


router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().populate('owner', 'username');
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get a specific item by ID
router.get('/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId).populate('owner', 'username');
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Update an item
router.put('/items/:id', verifyToken, async (req, res) => {
  try {
    const itemId = req.params.id;
    const { itemName, description, itemType, availability } = req.body;
    const ownerId = req.user.id;

    const item = await Item.findById(itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.owner.toString() !== ownerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    item.itemName = itemName;
    item.description = description;
    item.itemType = itemType;
    item.availability = availability;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete an item
router.delete('/items/:id', verifyToken, async (req, res) => {
    try {
      const itemId = req.params.id;
      const ownerId = req.user.id;
  
      const item = await Item.findById(itemId);
      
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      if (item.owner.toString() !== ownerId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
  
      const result = await Item.deleteOne({ _id: itemId });
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });
  

// router.delete('/items/:id', verifyToken, async (req, res) => {
//   try {
//     const itemId = req.params.id;
//     const ownerId = req.user.id;

//     const item = await Item.findById(itemId);
    
//     if (!item) {
//       return res.status(404).json({ error: 'Item not found' });
//     }

//     if (item.owner.toString() !== ownerId) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     console.log(item)
//     await item.remove();
//     res.json({ message: 'Item deleted successfully' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Failed to delete item' });
//   }
// });

module.exports = router;
