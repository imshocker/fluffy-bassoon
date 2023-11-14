const { User, Thought } = require('../models');

const userControl = {
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getSingleUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createUser: async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove user's thoughts
      await Thought.deleteMany({ username: user._id });

      // Remove user from friends' lists
      await User.updateMany({ friends: user._id }, { $pull: { friends: user._id } });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  addFriend: async (req, res) => {
    const { userId, friendId } = req.params;
    try {
      const user = await User.findById(userId);
      const friend = await User.findById(friendId); 

      if (!user || !friend) {
        return res.status(404).json({ error: 'User or friend not found' });
      }

      // Check if the friend is not already added
      if (!user.friends.includes(friend._id)) {
        user.friends.push(friend._id);
        friend.friends.push(user._id);          //when a friend is added to a user, the friend's friend count is also updated.

        await user.save();
        await friend.save();

        res.json({ message: 'Friend added successfully' });
      } else {
        res.status(400).json({ error: 'Friend already added' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteFriend: async (req, res) => {
    const { userId, friendId } = req.params;
    try {
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ error: 'User or friend not found' });
      }

      // Check if the friend is in the user's friends list
      if (user.friends.includes(friend._id)) {
        user.friends.pull(friend._id);
        friend.friends.pull(user._id);

        await user.save();
        await friend.save();

        res.json({ message: 'Friend deleted successfully' });
      } else {
        res.status(400).json({ error: 'Friend not found in the user\'s friend list' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = userControl;