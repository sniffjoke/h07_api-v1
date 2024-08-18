import {ObjectId} from "mongodb";

export interface Post {
    _id: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt?: string;
}
