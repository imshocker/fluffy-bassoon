const { Thought, User } = require('../models');
const moment = require('moment');

const thoughtControl = {
  getThoughts: async (req, res) => {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getSingleThought: async (req, res) => {
    const { thoughtId } = req.params;
    try {
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  addThought: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const thought = await Thought.create(req.body);
      user.thoughts.push(thought._id);
      await user.save();

      res.status(201).json(thought);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateThought: async (req, res) => {
    const { thoughtId } = req.params;
    try {
      const thought = await Thought.findByIdAndUpdate(thoughtId, req.body, { new: true });
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }
      res.json(thought);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteThought: async (req, res) => {
    const { thoughtId } = req.params;
    try {
      const thought = await Thought.findByIdAndDelete(thoughtId);
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      // Remove thought from user's thoughts array
      const user = await User.findById(thought.username);
      if (user) {
        user.thoughts.pull(thoughtId);
        await user.save();
      }

      res.json({ message: 'Thought deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  addReaction: async (req, res) => {
    const { thoughtId } = req.params;
    try {
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      thought.reactions.push(req.body);
      await thought.save();

      res.status(201).json(thought);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteReaction: async (req, res) => {
    const { thoughtId, reactionId } = req.params;
    try {
      const thought = await Thought.findById(thoughtId);
      if (!thought) {
        return res.status(404).json({ error: 'Thought not found' });
      }

      thought.reactions.pull({ _id: reactionId });
      await thought.save();

      res.json({ message: 'Reaction deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = thoughtControl;