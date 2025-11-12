import mongoose from 'mongoose';

// define the MongoDB URL to connect to the local database named "hotels"
import dotenv from 'dotenv';
dotenv.config();

const mongoURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/voting_app';


// connect to MongoDB
mongoose.connect(mongoURL);
// mongoose.connect(mongoURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// get the default connection
const db = mongoose.connection;

// event listeners
db.on('error', console.error.bind(console, '‼️‼Error connecting to MongoDB'));
db.on('connected', () => {
  console.log('✅MongoDB Connected');
});
db.on('disconnected', () => {
  console.log('❌MongoDB  Disconnected');
});

// export the db connection
export default db;
