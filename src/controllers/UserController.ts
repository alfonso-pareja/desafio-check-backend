import { Request, Response } from "express";
import { CreateUserDto } from "src/dtos/CreateUserDto";
import { User } from "../database/models/User";

export class UserController {

    /**
     * 
     * @param req 
     * @param response 
     */
    static async createUser(req: Request, response: Response){
        const userData: CreateUserDto = req.body;

        const newUser = await User.create({ ...userData, created: '' });

        response.status(201).json(newUser);
    }

    /**
     * 
     * @param req 
     * @param response 
     */
    static async getUser(req: Request, response: Response){

    }


  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}
