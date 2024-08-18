import {param} from "express-validator";
import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";

export const idUserValidator = param('id')
    .custom(async id => {
        const user: any = await usersQueryRepository.findUserById(new ObjectId(id))
        if (!user) {
            throw new Error('Not found')
        } else {
            return !!user
        }
    }).withMessage('Пост с заданным id не найден!')

