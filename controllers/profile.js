const bcrypt = require('bcrypt');
const express = require('express');
const { createUserToken } = require('../middleware/auth');
const db = require('../models');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');


//get route that show the persons profile
router.get('/:id', passport.authenticate('jwt', { session: false}), (req, res) => {
    /*
    res.status(200).json({
        message: 'Veiw message'
      })
    //find the user by id : findById()
    let token = req.header.authorization.split(' ')[1];
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    */
   let token = req.header.authorization.split(' ')[1];
   let decoded = jwt.verify(token, process.env.JWT_SECRET);
    db.User.findById(decoded.id)
    .then(user => {
      res.status(201).json(user);
    });
    
});

//put route that lets you update personal details
router.put('/:id', (req, res) => {
    db.User.findById(req.params.id, {name: req.body.name})
    .then(user => {
      res.status(201).json(user);
    });
});


//delete route in case you want to delete your profile
router.delete('/:id', (req, res) => {
    db.User.findByIdAndDelete(req.params.id)
    .then( () => {
      res.status(201).json('Deleted user');
    });
});

module.exports = router;