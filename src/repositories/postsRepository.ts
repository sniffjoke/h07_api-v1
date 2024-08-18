import {postCollection} from "../db/mongo-db";
import {DeleteResult, ObjectId, UpdateResult} from "mongodb";
import {postsQueryRepository} from "../queryRepositories/postsQueryRepository";
import {PostDBType} from "../dtos/posts.dto";


export const postsRepository = {

    async getAllPosts(query: any) {
        const posts = await postsQueryRepository.postsSortWithQuery(query)
        return {
            ...query,
            items: posts.map((post: any) => postsQueryRepository.postMapOutput(post))
        }
    },

    async createPost(newPost: PostDBType): Promise<any> {
        const post = {
            ...newPost,
            blogId: newPost.blogId,
            createdAt: new Date(Date.now()).toISOString()
        }
        await postCollection.insertOne(post)
        return post
    },

    async updatePostById(id: ObjectId, post: PostDBType): Promise<UpdateResult> {
        const findedPost = await postsQueryRepository.findPostById(id)
        const updates = {
            $set: {
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
            }
        }
        const updatedPost = await postCollection.updateOne({_id: findedPost?._id}, updates)
        return updatedPost
    },

    async postDelete(postId: ObjectId): Promise<DeleteResult> {
        return await postCollection.deleteOne({_id: postId})
    },

    async findAllPostsByBlogId(blogId: string, query: any) {
        const posts = await postsQueryRepository.getAllPostsByBlogIdSortWithQuery(blogId, query)
        return {
            ...query,
            items: posts.map((post: any) => postsQueryRepository.postMapOutput(post))
        }
    }

}
