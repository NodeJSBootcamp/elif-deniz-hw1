import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Tweet from "../model/Tweet.model";

export const postTweet = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;
  const tweet = req.body.tweet;
  if (!userId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Not authorized to post tweet" });
  }

  if (!tweet) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Tweet is required" });
  }

  try {
    Tweet.create({ userId, tweet })
      .then((result) => {
        if (!result) {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Tweet cannot posted" });
        } else {
          res.status(StatusCodes.CREATED).json(result);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const updateTweet = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tweetId = req.params.id;
    const tweet = req.body.tweet;
    if (!tweetId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "No tweet found" });
    }

    if (!tweet) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Tweet is required" });
    }

    Tweet.updateOne({ _id: tweetId, isDeleted: false }, { tweet })
      .then((result) => {
        if (!result)
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error! Tweet was not updated" });

        res.status(StatusCodes.OK).json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const deleteTweet = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tweetId = req.params.id;
    if (!tweetId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "No tweet found" });
    }
    //soft delete
    Tweet.updateOne({ _id: tweetId, isDeleted: false }, { isDeleted: true })
      .then((result) => {
        if (!result || result.modifiedCount === 0)
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Error! Tweet was not deleted" });

        res.status(StatusCodes.OK).json({ result });
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const getTweet = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tweetId = req.params.id;
    if (!tweetId) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "No tweet found" });
    }
    Tweet.findOne({ _id: tweetId, isDeleted: false })
      .then((result) => {
        if (!result)
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "No tweet found" });

        res.status(StatusCodes.OK).json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const getAllTweets = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    Tweet.find({ isDeleted: false })
      .then((result) => {
        if (!result) {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: " No tweets found!" });
        }
        res.status(StatusCodes.OK).json({ allTweets: result });
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const likeTweet = (req: Request, res: Response, next: NextFunction) => {
  const tweetId = req.params.id;

  try {
    Tweet.findOneAndUpdate(
      { _id: tweetId, isDeleted: false },
      { $inc: { likes: 1 } }
    )
      .then((result) => {
        if (!result) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Tweet not found" });
        }

        return res.status(StatusCodes.OK).json(result);
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};

export const commentTweet = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const tweetId = req.params.id;
    const { comment } = req.body;

    Tweet.findOneAndUpdate(
      { _id: tweetId, isDeleted: false },
      { $push: { comments: { comment, userId } } }
    )
      .exec()
      .then((result) => {
        if (!result) {
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: "Comment not added" });
        }
        res.status(StatusCodes.OK).json(result);
      })
      .catch((err) => {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err });
  }
};
