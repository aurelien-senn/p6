const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');



exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'user create !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error =>{ console.log('LA');
      res.status(502).json({ error })
    });
  };

  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'user unfind!' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'password incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWTPRIVATEKEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                
                .catch(error => {
                    res.status(504).json({ error })
                });
        })
        .catch(error => res.status(505).json({ error }));
 };