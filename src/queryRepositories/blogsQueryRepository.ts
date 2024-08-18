import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";
import {Blog} from "../types/blogs.interface";

// сразу отправляем в качестве ответа

export const blogsQueryRepository = {
    async findBlogById(id: ObjectId) {
        return await blogCollection.findOne({_id: id})
    },

    async blogOutput(id: ObjectId) {
        const blog = await this.findBlogById(id)
        return this.blogMapOutput(blog as Blog)
    },

    blogMapOutput(blog: Blog) {
        const {_id, createdAt, name, websiteUrl, isMembership, description} = blog
        return {
            id: _id,
            name,
            websiteUrl,
            isMembership,
            createdAt,
            description
        }
    },

    async blogsSortWithQuery (query: any) {
        const queryName = query.searchNameTerm !== null ? query.searchNameTerm : ''
        const filter = {
            name: {$regex: queryName, $options: "i"},
        }
        const blogs = await blogCollection
            .find(filter)
            .sort(query.sortBy, query.sortDirection)
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
            .toArray()
        return blogs
    }
}
