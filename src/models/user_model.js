import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// create a PostSchema with a title field
const UserSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: { type: String },
  username: { type: String },
});

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.pre('save', function beforeUserSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });

  // // generate salt and hash password
  // const salt = bcrypt.genSaltSync(10);
  // const hash = bcrypt.hashSync(user.password, salt);
  //
  // // overwrite plain text password with encrypted password
  // user.password = hash;
  // return next();
});

//  note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (error, comparisonResult) => {
    if (error) return callback(error);
    return callback(null, comparisonResult);
  });
};

// create PostModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
