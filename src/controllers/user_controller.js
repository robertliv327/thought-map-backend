import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send('You must provide email and password');
  }

  User.findOne({ email: req.body.email }).then((result) => {
    if (result != null) {
      return res.status(420).send('User already exists');
    } else {
      const user = new User();
      user.username = username;
      user.email = email;
      user.password = password;
      user.save().then((r) => {
        res.send({ token: tokenForUser(r) });
      }).catch((error) => {
        res.status(500).json({ error });
      });
    }
  });
};

// encodes a new token for a user object
function tokenForUser(user) {
  console.log(user);
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
