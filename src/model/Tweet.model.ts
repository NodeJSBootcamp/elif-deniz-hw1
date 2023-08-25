import mongoose from "mongoose";

const Schema= mongoose.Schema;

const tweetSchema= new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tweet: {
        type:String,
        required: [true, "Tweet cannot be empty."],
        maxLength: [140, "Tweet must be less than 140 characters"]
    },
    likes: {
        type: Number,
        default: 0
    },
    isDeleted:{
        type: Boolean,
        default: false

    },
    comments:[{
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'

        },
        comment: {
            type: String,
            required: true
        }
    }]
}, {timestamps: true})

const TweetModel= mongoose.model('Tweet', tweetSchema);

export default TweetModel;