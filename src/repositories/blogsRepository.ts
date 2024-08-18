import {blogCollection} from "../db/mongo-db";
import {ObjectId, UpdateResult} from "mongodb";
import {blogsQueryRepository} from "../queryRepositories/blogsQueryRepository";
import {BlogDBType} from "../dtos/blogs.dto";
import {Blog} from "../types/blogs.interface";


export const blogsRepository = {

    async getAllBlogs(query: any) {
        const blogs = await blogsQueryRepository.blogsSortWithQuery(query)
        return {
            ...query,
            items: blogs.map(blog => blogsQueryRepository.blogMapOutput(blog))
        }
    },

    async createBlog(newBlog: BlogDBType): Promise<Omit<Blog, '_id'>> {
        const blog = {
            ...newBlog,
            isMembership: false,
            createdAt: new Date(Date.now()).toISOString()
        }
        await blogCollection.insertOne(blog)
        return blog
    },

    async updateBlogById(id: ObjectId, blog: BlogDBType): Promise<UpdateResult> {
        const findedBlog = await blogsQueryRepository.findBlogById(id)
        const updates = {
            $set: {
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
            }
        }
        const updatedBlog = await blogCollection.updateOne({_id: findedBlog?._id}, updates)
        return updatedBlog
    },

    async deleteBlog(id: ObjectId) {
        return await blogCollection.deleteOne({_id: id})
    }

}
