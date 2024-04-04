import express from 'express';
const router = express.Router();
import passport from 'passport';

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Login successful', user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful' });
});

export default router;
