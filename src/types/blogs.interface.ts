import {ObjectId} from "mongodb";

export interface Blog {
    _id: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt?: string;
    isMembership?: boolean
}
