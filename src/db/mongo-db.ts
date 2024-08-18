import {SETTINGS} from "../settings";
import {Collection, Db, MongoClient} from "mongodb";
import {BlogDBType} from "../dtos/blogs.dto";
import {PostDBType} from "../dtos/posts.dto";
import {UserDBType} from "../dtos/users.dto";
import {CommentDBType} from "../dtos/comments.dto";

export const client: MongoClient = new MongoClient(SETTINGS.PATH.MONGODB as string) as MongoClient;
export const db: Db = client.db(SETTINGS.VARIABLES.DB_NAME);

// получение доступа к коллекциям
export const blogCollection: Collection<BlogDBType> = db.collection<BlogDBType>(SETTINGS.VARIABLES.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDBType> = db.collection<PostDBType>(SETTINGS.VARIABLES.POST_COLLECTION_NAME)
export const userCollection: Collection<UserDBType> = db.collection<UserDBType>(SETTINGS.VARIABLES.USER_COLLECTION_NAME)
export const commentCollection: Collection<CommentDBType> = db.collection<CommentDBType>(SETTINGS.VARIABLES.COMMENT_COLLECTION_NAME)

// проверка подключения к бд
export const connectToDB = async () => {
    try {
        await client.connect()
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}
