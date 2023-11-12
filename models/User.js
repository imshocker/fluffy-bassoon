const { Schema, model } = require('mongoose');

const userData = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: "Thought",
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }]
},
{
    toJSON: {
        virtuals: true,
    }
})

userData.virtual("friendcount").get(function(){
    return this.friends.length
});

const User = model("User", userData)
module.exports = User