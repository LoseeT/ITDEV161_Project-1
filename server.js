import express from 'express';
import connectDatabase from './config/db.js';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from './models/Users.js';
import mongoose from 'mongoose';

// Initialize express application
const app = express();

// Connect database
connectDatabase().then(() => {
  // Clean up database and update indexes
  (async () => {
    try {
      // Remove documents with null player values
      await User.deleteMany({ player: null });
      console.log('Cleaned up documents with null player values');
      
      // Create a new unique index for player
      await User.collection.createIndex({ player: 1 }, { unique: true });
      console.log('Indexes updated successfully');
    } catch (error) {
      console.error('Error during database setup:', error);
    }
  })();
});

// Configure Middleware
app.use(express.json({ extended: false }));
app.use(cors({ origin: 'http://localhost:3001'}));

// API endpoints
app.get('/', (req, res) => 
    res.send('http get request sent to root api endpoint')
);

/**
 * @route POST api/users
 * @desc Register user
 */
app.post('/api/users',
  [
    check('name', 'Please enter your name')
      .not()
      .isEmpty(),
    check('player', 'Please enter your player name')
      .not()
      .isEmpty(),
    check('score', 'Please enter a valid score').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    } else {
      const { name, player, score } = req.body;
      try {
        console.log(`Checking for existing player: ${player}`);
        let user = await User.findOne({ player: player });
        console.log(`Query result: ${user}`);
        if (user) {
          console.log(`Player already exists: ${player}`);
          return res
            .status(400)
            .json({ errors: [{ msg: 'Player already exists' }] });
        }

        // Create a new user
        user = new User({
          name: name,
          player: player,
          score: score
        });

        // Save to the db and return
        await user.save();
        
        // Generate and return a JWT token
        const payload = {
          user: {
            id: user.id
          }
        }

        jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: '10hr' },
          (err, token) => {
            if (err) {
              console.error('JWT Error:', err.message);
              throw err;              
            }
            res.json({ token: token });
          }
        );
      } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).send('Server error');
      }
    }
});

const port = 3001;
app.listen(port, () => console.log(`Express server running on port ${port}`));