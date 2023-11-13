const router = require('express').Router()

const { 
    getUsers, 
    createUser, 
    updateUser, 
    deleteUser, 
    deleteFriend, 
    addFriend, 
    getSingleUser 
} = require('../../controllers/userControl')

router.route('/').get(getUsers).post(createUser)

router.route('/:userId')
.get(getSingleUser)
.put(updateUser)
.delete(deleteUser)

router.route('/:userId/friends/:friendId')
.post(addFriend)
.delete(deleteFriend)

module.exports = router;