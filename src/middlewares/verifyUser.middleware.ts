import { RequestHandler } from "express";
import Tweet from "../model/Tweet.model";
import { StatusCodes } from "http-status-codes";

export const verifyUser: RequestHandler = (req, res, next) => {
  const tweetId = req.params.id;
  const userId = req.userId;
  //as string

  if (!tweetId)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "No tweet found" });
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

          if (tweetUserId === userId) {
            next();
          } else {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({
                message: "You are unauthorized to change someone's tweet.",
              });
          }
        } else {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "No tweet found" });
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
