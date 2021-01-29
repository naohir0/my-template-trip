const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
   var id = req.query.id;
   req.logout()
   res.redirect(`/?id=${id}`)
});

module.exports = router;