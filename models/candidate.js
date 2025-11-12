import mongoose from 'mongoose';

//Define Candidate schema
const candidateSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
  },
party: {
    type: String,
    required: true,
  },
age: {
    type: Number,
    required: true,
    },
votes: [
    {//data save in array of objects
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        votedAt: {
            type: Date,
            default: Date.now,
        },
    },
],
voteCount: {
    type: Number,
    default: 0,
  },

});



//Create candidate model
const Candidate = mongoose.model('Candidate', candidateSchema);
export default Candidate;