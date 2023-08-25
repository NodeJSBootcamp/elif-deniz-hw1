import express from 'express';
const router= express.Router();
import { getTweet, getAllTweets, postTweet, updateTweet, deleteTweet, likeTweet, commentTweet } from '../controllers/Tweet.controller';
import { verifyJWT } from '../middlewares/verifyJWT.middleware';
import { verifyUser } from '../middlewares/verifyUser.middleware';
import { verifyUserActions } from '../middlewares/verifyUserActions.middleware';


router.use(verifyJWT)
router.get("/all", getAllTweets)
router.get("/:id", verifyUser, getTweet) //Only the user can get his tweet (Middleware)
router.post("/post", postTweet)
router.patch("/update/:id", verifyUser, updateTweet) //Only the user can update his tweet (Middleware)
router.patch("/delete/:id", verifyUser, deleteTweet) //Only the user can delete his tweet (Middleware)

router.patch("/like/:id",verifyUserActions, likeTweet)  //User cannot like own tweet (Middleware)
router.post("/comment/:id", verifyUserActions, commentTweet) //User cannot comment own tweet (Middleware)



export default router;