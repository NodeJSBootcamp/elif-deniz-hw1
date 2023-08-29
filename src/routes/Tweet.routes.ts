import express from 'express';
const router= express.Router();
import { getTweet, getAllTweets, postTweet, updateTweet, deleteTweet, likeTweet, commentTweet, getUserTweets } from '../controllers/Tweet.controller';
import { verifyJWT } from '../middlewares/verifyJWT.middleware';
import { verifyUserTweet } from '../middlewares/verifyUserTweet.middleware';
import { verifyUserActions } from '../middlewares/verifyUserActions.middleware';


router.use(verifyJWT)
router.get("/all", getAllTweets)
router.get("/getmytweets", getUserTweets) //Only the user can get all his tweets (Middleware)
router.get("/:id", verifyUserTweet, getTweet) //Only the user can get his tweet (Middleware)
router.post("/post", postTweet)
router.patch("/update/:id", verifyUserTweet, updateTweet) //Only the user can update his tweet (Middleware)
router.patch("/delete/:id", verifyUserTweet, deleteTweet) //Only the user can delete his tweet (Middleware)

router.patch("/like/:id",verifyUserActions, likeTweet)  //User cannot like own tweet (Middleware)
router.post("/comment/:id", verifyUserActions, commentTweet) //User cannot comment own tweet (Middleware)



export default router;