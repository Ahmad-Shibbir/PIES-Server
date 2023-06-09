const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
//verifyTokenAndAdmin,
router.get("/",  async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});



// *************************
// USER COMPLAIN SECTION
// *************************


//GET ALL complained USER
//verifyTokenAndAdmin,
router.get("/complained", async (req, res) => {
  try {
    const users = await User.find({ isComplained: true });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//ADD COMPLAIN to user
router.post("/addcomplain/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isComplained = true;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//REMOVE COMPLAIN to user
router.post("/removecomplain/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isComplained = false;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//TOGGLE COMPLAIN to user (if true make false and vice versa )
router.post("/togglecomplain/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isComplained = !user.isComplained;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});



// *************************
// USER Search and Filter
// *************************

// Search users
router.get('/search',  async (req, res) => {
  try {
    const { query } = req.query;

    // Search for users matching the query
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Filter users
router.get('/filter',  async (req, res) => {
  try {
    const { username, email } = req.query;

    // Create a filter object based on the provided criteria
    const filter = {};
    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }
    if (email) {
      filter.email = { $regex: email, $options: 'i' };
    }

    // Find users matching the filter
    const users = await User.find(filter);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter users' });
  }
});



module.exports = router;