import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";


export const userService = {

    async validateUser(userLoginOrEmail: string) {
        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(userLoginOrEmail)) {
            return  await usersQueryRepository.validateUserByLogin(userLoginOrEmail)
        } else {
            return  await usersQueryRepository.validateUserByEmail(userLoginOrEmail)
        }
    }

}
