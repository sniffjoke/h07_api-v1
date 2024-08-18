import {ObjectId} from "mongodb";


export interface CommentDBType {
    content: string
    commentatorInfo: {
        userId: ObjectId
        userLogin: string
    },
    postId: ObjectId
}
