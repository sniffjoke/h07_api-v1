import {Request, Response} from 'express';
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/usersRepository";
import {usersQueryHelper} from "../helpers/usersHelper";
import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";


export const getUsersController = async (req: Request<any, any, any, any>, res: Response) => {
    const query = await usersQueryHelper(req.query)
    const users = await usersRepository.getAllUsers(query)
    const {
        pageSize,
        pagesCount,
        totalCount,
        page,
        items
    } = users
    res.status(200).json({
        pageSize,
        pagesCount,
        totalCount,
        page,
        items
    })
}

export const getUserByIdController = async (req: Request, res: Response) => {
    const id = new ObjectId(req.params.id)
    const user = await usersQueryRepository.userOutput(id)
    res.status(200).json(user)
}

export const createUserController = async (req: Request, res: Response) => {
    try {
        const uniqueEmail = await usersQueryRepository.validateUserByEmail(req.body.email)
        const uniqueLogin = await usersQueryRepository.validateUserByLogin(req.body.login)
        if (uniqueEmail) {
            res.status(401).json({
                errorsMessages: [
                    {
                        message: "Данный email уже существует",
                        field: "email"
                    }
                ]
            })
            return
        }
        if (uniqueLogin) {
            res.status(401).json({
                errorsMessages: [
                    {
                        message: "Данный login уже существует",
                        field: "login"
                    }
                ]
            })
            return
        }
        const newUser = await usersRepository.createUser(req.body)
        const newUserOutput = usersQueryRepository.userMapOutput(newUser)
        res.status(201).json(newUserOutput)

    } catch (e) {
        res.status(500).send(e)
    }
}

export const deleteUserByIdController = async (req: Request, res: Response) => {
    try {
        const id = new ObjectId(req.params.id)
        await usersRepository.deleteUser(id)
        res.status(204).send('Удалено');
    } catch (e) {
        res.status(500).send(e)
    }
}

