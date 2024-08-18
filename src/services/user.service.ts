import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";
import {userCollection} from "../db/mongo-db";


export const userService = {

    async validateUser(userLoginOrEmail: string) {
        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(userLoginOrEmail)) {
            return  await usersQueryRepository.validateUserByLogin(userLoginOrEmail)
        } else {
            return  await usersQueryRepository.validateUserByEmail(userLoginOrEmail)
        }
    },

    async activate(confirmationCode: any) {
        const user = await userCollection.findOne({'emailConfirmation.confirmationCode': `${confirmationCode}`})
        console.log(user)
        if (!user) {
            throw new Error('User not found')
        }
        await userCollection.updateOne(user, {$set: {'emailConfirmation.isConfirmed': true}})
    }

}
