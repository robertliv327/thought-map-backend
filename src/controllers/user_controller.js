import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

export const signin = (req, res, next) => {
  res.send({ token: tokenForUser(req.user) });
};

export const signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send('You must provide email and password');
  }

  // TODO:
  // here you should do a mongo query to find if a user already exists with this email.
  // if user exists then return an error. If not, use the User model to create a new user.
  User.findOne({ email: req.body.email }).then((result) => {
    return res.status(422).send('User already exists');
  }).catch((error) => {
    res.status(500).json({ error });
  });

  const user = new User();
  user.email = email;
  user.password = password;
  user.save().then((result) => {
    res.send({ token: tokenForUser(req.user) });
  }).catch((error) => {
    res.status(500).json({ error });
  });
};

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
