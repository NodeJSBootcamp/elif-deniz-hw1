import { RequestHandler } from "express";
import Tweet from "../model/Tweet.model";
import { StatusCodes } from "http-status-codes";

export const verifyUserActions: RequestHandler = (req, res, next) => {
  console.log("verifyUserAction");
  const tweetId = req.params.id;
  const userId = req.userId;
  //as string

  if (!tweetId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No tweet founddd" });
  if (!userId)
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized Access" });

  try {
    Tweet.findOne({ _id: tweetId })
      .exec()
      .then((result) => {
        if (result) {
          const tweetUserId = result.userId.toString();

          if (tweetUserId !== userId) {
            next();
          } else {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ message: "You cannot comment or like your tweet." });
          }
        } else {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "No tweet founds" });
        }
      })
      .catch((err) => {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err.message });
      });
  } catch (err) {
    console.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};
