const express = require('express');
const router = express.Router();

const sessionService = require('../../../services/SessionService');

router.all('/', async function (req, res) {
  const { refreshToken, user } = req;

  try {
    await sessionService.endSession(user, refreshToken);
    res.set('X-Kill-Session', true);
    return res.json({
      status: 1,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('An error occurred. Please try again later.');
  }
});

module.exports = router;
