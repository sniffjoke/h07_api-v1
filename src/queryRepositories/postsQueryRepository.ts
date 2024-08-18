import {ObjectId} from "mongodb";
import {postCollection} from "../db/mongo-db";
import {Post} from "../types/posts.interface";


export const postsQueryRepository = {

    async findPostById(id: ObjectId) {
        return await postCollection.findOne({_id: id})
    },

    async postOutput(id: ObjectId) {
        const post = await this.findPostById(id)
        return this.postMapOutput(post as any)
    },

    postMapOutput(post: Post) {
        const {createdAt, blogName, title, shortDescription, content, _id, blogId} = post
        return {
            id: _id,
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt
        }
    },

    async postsSortWithQuery(query: any) {
        const posts = await postCollection
            .find()
            .sort(query.sortBy, query.sortDirection)
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
            .toArray()
        return posts
    },

    async getAllPostsByBlogIdSortWithQuery(blogId: string, query: any) {
        const posts = await postCollection
            .find({blogId})
            .sort(query.sortBy, query.sortDirection)
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
            .toArray()
        return posts
    }

}
