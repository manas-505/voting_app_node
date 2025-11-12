import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


//Define user schema
const userSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
  },
age: {
    type: Number,
    required: true,
    },
email: {
    type: String,
    required: true,
  },
mobile: {
    type: String,
  },
address: {
    type: String,
    required: true,
  },
salary: {
    type: Number,
  },
aadharCardNumber: {
    type: String,
    required: true,
    unique: true,
  },
password: {
    type: String,
    required: true,
  },
role: {
    type: String,
    enum: ['voter', 'admin'],
    default: 'voter',
  },
isVoted: {
    type: Boolean,
    default: false,
  },
});


//userSchema pre-save hook to hash password
userSchema.pre('save', async function (next) {
  const user = this;

  if(!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});


//userSchema method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
};


//Create user model
const User = mongoose.model('User', userSchema);
export default User;