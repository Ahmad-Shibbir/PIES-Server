const router = require("express").Router();

router.get("/usertest", (req, res)=>{
    res.send("got users")
})

router.post("/usertest", (req, res)=>{
    res.send("post users")
})

router.put("/:id", (req, res)=>{
    res.send("put users")
})

router.delete("/:id", (req, res)=>{
    res.send("delet users")
})

module.exports = router;