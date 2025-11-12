import express from 'express';
const router = express.Router();

//import routes(create, read, update, delete of schema)
import User from './../models/user.js';

import { jwtAuthMiddleware, generateToken } from './../jwt.js';


//Signup route

router.post('/signup', async (req, res) => {
  try {
    const data = req.body;             // Get data from client
    const newUser = new User(data);   // Create a new Person document

    const savedUser = await newUser.save(); // Save it to MongoDB (no callback)

    console.log('User saved successfully:', savedUser);

    const payload = {
      id: savedUser._id,
    };
    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log('Generated JWT token:', token);

    res.status(200).json(savedUser); // Send success response


  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ error: 'Error saving user to database' });
  }
});



//Login route
router.post('/login', async (req, res) => {
  try {
    //Extract username and password from request body
    const { aadharCardNumber, password } = req.body;
    
    //Find user by aadharCardNumber
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    //If user not found, send error response
    if (!user) {
      return res.status(401).json({ error: 'Invalid aadharCardNumber or password' });
    }
    
    const payload = {
      id: savedUser._id,
    };
    console.log(JSON.stringify(payload));
    res.json({token})

  } catch (error) {
    console.error('Error saving user to database:', error);
    res.status(500).json({ error: 'Error saving user to database' });
  }
});


//profile route (protected)
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user; //Extract user data from request object (set by jwtAuthMiddleware)
    const userId = userData.id;
    const user = await User.findById(userId); //Fetch user from database excluding password field
    res.status(200).json(user); //Send user data as JSON response
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});


//PUT route to update user by ID
    router.put('/profile/password',jwtAuthMiddleware, async (req, res) => {
      try {
        const userId = req.user;  // Extract person ID from token
        const{currentPassword, newPassword} = req.body; // Get updated data from request body
        const user = await User.findById(userId); // Find the user by ID
        if (!user || !(await user.comparePassword(currentPassword))) {
          return res.status(401).json({ error: 'Current password is incorrect' });
        }

        user.password = newPassword;  // Update the password
        await user.save(); // Save the updated user document
        console.log('Password updated successfully for user:', user);
        res.status(200).json({ message: 'Password updated successfully' }); // Send success response
      } catch (error) {
        console.error('Error updating password in database:', error);
        res.status(500).json({ error: 'Error updating password in database' });
      }
 });

export default router;















