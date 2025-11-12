import express from 'express';
const router = express.Router();
//import routes(create, read, update, delete of schema)
import User from './../models/user.js';


import { jwtAuthMiddleware, generateToken } from './../jwt.js';
import Candidate from './../models/candidate.js';
import passport from 'passport';

//Function to check if user is admin
const checkAdmin = async (userID) => {
  try {
    const user = await User.findById(userID);
    if(user.role === 'admin') {
      return true;
    }
  } catch (error) {
    return false;
  }
};

//post route to create a new candidate

router.post('/',jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdmin(req.user.id)) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    const data = req.body;             // reques data holds the candidate details
    const newCandidate = new Candidate(data);   // Create a new Person document

    const savedCandidate = await newCandidate.save(); // Save it to MongoDB (no callback)

    console.log('Candidate saved successfully:', savedCandidate);


    res.status(200).json(savedCandidate); // Send success response


  } catch (error) {
    console.error('Error saving Candidate to database:', error);
    res.status(500).json({ error: 'Error saving Candidate to database' });
  }
});




//PUT route to update user by ID
    router.put('/:candidateID',jwtAuthMiddleware, async (req, res) => {
      try {
        if (!await checkAdmin(req.user.id)) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
        const candidateID = req.params.candidateID; // Extract  ID from URL parameter
        const updatedCandidateData = req.body;    // Get updated data from request body

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, { new: true }); // Update the Person document
        runValidators: true;//

        if (!response) {
          return res.status(404).json({ error: 'Candidate not found' });
        }  

        console.log('Candidate updated successfully:', response);
        res.status(200).json(); // Send the updated data as JSON
      } catch (error) {
        console.error('Error updating password in database:', error);
        res.status(500).json({ error: 'Error updating password in database' });
      }
 });



 //DELETE route to delete user by ID
   router.delete('/:candidateID',jwtAuthMiddleware, async (req, res) => {
      try {
        if (!await checkAdmin(req.user.id)) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
        const candidateID = req.params.candidateID; // Extract  ID from URL parameter
        const updatedCandidateData = req.body;    // Get updated data from request body

        const response = await Candidate.findByIdAndDelete(candidateID, updatedCandidateData, { new: true }); // Update the Person document
        runValidators: true;//

        if (!response) {
          return res.status(404).json({ error: 'Candidate not found' });
        }  

        console.log('Candidate deleted successfully:', response);
        res.status(200).json(); // Send the updated data as JSON
      } catch (error) {
        console.error('Error updating password in database:', error);
        res.status(500).json({ error: 'Error updating password in database' });
      }
 });



 //start voting for a candidate
 router.post('/vote/:candidateID',jwtAuthMiddleware, async (req, res) => {
        //Admin cannot vote
        //user can vote only once
        const candidateID = req.params.candidateID; // Extract  ID from URL parameter
        const userID = req.user.id;
        try {
            const candidate = await Candidate.findById(candidateID);
            if (!candidate) {
                return  res.status(404).json({ error: 'Candidate not found' });
            }
            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user.role === 'admin') {
                return res.status(403).json({ error: 'Admins cannot vote' });
            }
            if (user.isVoted) {
                return res.status(403).json({ error: 'User has already voted' });
            }
            candidate.votes.push({ user: userID });

            candidate.voteCount++;
            await candidate.save();


            user.isVoted = true;
            await user.save();

            res.status(200).json({ message: 'Vote cast successfully' });
        } catch (error) {
            console.error('Error casting vote:', error);
            res.status(500).json({ error: 'Error casting vote' });; 

        }
    });


//vote counting route
router.get('/vote/count', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: -1 }); // descending order

    const voteRecords = candidates.map((data) => ({
      party: data.party,
      count: data.voteCount
    }));

    return res.status(200).json(voteRecords);
  } catch (error) {
    console.error('Error fetching vote counts:', error);
    res.status(500).json({ error: 'Error fetching vote counts' });
  }
});


  





        export default router;















