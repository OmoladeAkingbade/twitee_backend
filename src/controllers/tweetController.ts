import { Request, Response } from "express";
import { Twit } from "../entities/twitEntity";
import { Comment } from "../entities/commentEntity";
import { getConnection, getRepository } from "typeorm";
import { User } from "../entities/userEntity";

export const createTwit = async (req: Request, res: Response) => {
  try {
    const user = req.user.id;
    console.log(req.user);

    const twit = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Twit)
      .values([
        {
          twit: req.body.twit,
          user_id: user,
        },
      ])
      .returning("*")
      .execute();
    const data = twit.raw;
    res.status(201).json({
      status: "success",
      message: "twit created",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
    });
  }
};

export const deleteTwit = async (req: Request, res: Response) => {
  try {
    // findOneAndDelete({ userid: req.user.id, id: req.params.id  })
    const user = req.user.id;
    const data = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Twit)
      .where("userIdId = :userIdId AND id = :id", {
        userIdId: user,
        id: req.params.id,
      })
      .execute();


    res.status(201).json({
      status: "success",
      message: "twit deleted!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
    });
  }
};


export const getAllTwits = async (req: Request, res: Response) => {
  try{
    const twits = await getRepository(Twit)
    .createQueryBuilder("twit")
    .getMany();

    res.status(201).json({
      status: "success",
      message: "All twits!",
      twits
    });
  }
  catch(err){
    console.log(err);
    res.status(500).json({
    status: "error",
    });
  }
}



export const getTwits = async (req: Request, res: Response) => {
  try {
    const twits = await getRepository(Twit)
      .createQueryBuilder("twit")
      .leftJoinAndSelect("twit.user_id", "user.id")
      .where("twit.id = :id", { id: req.params.id })
      .getOne();

    const comments = await getRepository(Comment)
      .createQueryBuilder("comment")
      .where("comment.twit = :twit", { twit: req.params.id })
      .getMany();

  

    res.status(201).json({
      status: "success",
      message: "A twit and it's comment!",
      twits: {
        twits,
        comments,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
    });
  }
};

// const timber = await getRepository(User)
//     .createQueryBuilder("user")
//     .where("user.id = :id OR user.name = :name", { id: 1, name: "Timber" })
//     .getOne();
