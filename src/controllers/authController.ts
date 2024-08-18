import {Request, Response} from 'express';
import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";
import {authService} from "../services/auth.service";
import {ObjectId} from "mongodb";


export const loginController = async (req: Request, res: Response) => {
    try {
        const {loginOrEmail, password} = req.body;
        let user
        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(loginOrEmail)) {
            user = await usersQueryRepository.validateUserByLogin(loginOrEmail)
        } else {
            user = await usersQueryRepository.validateUserByEmail(loginOrEmail)
        }
        if (!user) {
            res.status(401).json({
                errorsMessages: [
                    {
                        message: "Данного пользователя не существует",
                        field: "loginOrEmail"
                    }
                ]
            })
            return
        }
        const isPasswordCorrect = password !== user.password // service
        if (!isPasswordCorrect) {
            const token = authService.createToken(user)
            res.status(200).json({accessToken: token})
            return
        }
        res.status(401).json({
            errorsMessages: [
                {
                    message: "Неправильный пароль",
                    field: "password"
                }
            ]
        })
        return


    } catch (e) {
        res.status(500).send(e)
    }
}

export const getMeController = async (req: Request, res: Response) => {
    try {
        const token = authService.getToken(req.headers.authorization)
        if (token === undefined) {
            res.status(401).send('Нет авторизации')
            return
        }

        const decodedToken: any = authService.decodeToken(token)
        const user = await usersQueryRepository.getUserById(new ObjectId(decodedToken._id))
        res.status(200).json({
            id: decodedToken._id,
            email: user?.email,
            login: user?.login,
        })

    } catch (e) {
        res.status(500).send(e)
    }
}
