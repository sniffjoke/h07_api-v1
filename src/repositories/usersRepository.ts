import {userCollection} from "../db/mongo-db";
import {ObjectId} from "mongodb";
import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";
import {UserDBType} from "../dtos/users.dto";


export const usersRepository = {

    async getAllUsers(query: any) {
        const users = await usersQueryRepository.findAllUsers(query)
        return {
            ...query,
            items: users.map(user => usersQueryRepository.userMapOutput(user))
        }
    },

    async createUser(newUser: UserDBType): Promise<any> {
        const user = {
            ...newUser,
            createdAt: new Date(Date.now()).toISOString()
        }
        await userCollection.insertOne(user)
        return user
    },

    async deleteUser(id: ObjectId) {
        return await userCollection.deleteOne({_id: id})
    }

}
