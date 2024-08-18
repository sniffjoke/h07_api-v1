import {Request, Response} from 'express';
import {ObjectId} from "mongodb";
import {commentsRepository} from "../repositories/commentsRepository";
import {commentsQueryHelper} from "../helpers/commentsHelper";
import {commentsQueryRepository} from "../queryRepositories/commentsQueryRepository";
import {postsQueryRepository} from "../queryRepositories/postsQueryRepository";
import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";
import {authService} from "../services/auth.service";


export const getCommentsController = async (req: Request<any, any, any, any>, res: Response) => {
    const query = await commentsQueryHelper(req.query)
    const comments = await commentsRepository.getAllComments(query)
    const {
        pageSize,
        pagesCount,
        totalCount,
        page,
        items
    } = comments
    res.status(200).json({
        pageSize,
        pagesCount,
        totalCount,
        page,
        items
    })
}

export const getAllCommentsByPostId = async (req: Request<any, any, any, any>, res: Response) => {
    const postId = req.params.id;
    const query = await commentsQueryHelper(req.query, postId)
    const comments = await commentsRepository.getAllCommentsByPostId(query)
    const {
        pageSize,
        pagesCount,
        totalCount,
        page,
        items
    } = comments
    res.status(200).json({
        pageSize,
        pagesCount,
        totalCount,
        page,
        items
    })

}

export const getCommentByIdController = async (req: Request, res: Response) => {
    const id = new ObjectId(req.params.id)
    const comment = await commentsQueryRepository.commentOutput(id)
    res.status(200).json(comment)
}

export const createCommentByPostIdWithParams = async (req: Request, res: Response) => {
    try {
        const post = await postsQueryRepository.findPostById(new ObjectId(req.params.id))
        const token = authService.getToken(req.headers.authorization)
        if (token === undefined) {
            res.status(401).send('Нет авторизации')
            return
        }
        const decodedToken: any = authService.decodeToken(token)
        if (decodedToken === null) {
            res.status(401).send('Нет авторизации')
            return
        }
        const user = await usersQueryRepository.getUserById(new ObjectId(decodedToken._id))
        const newComment = await commentsRepository.createComment({
            content: req.body.content,
            postId: post!._id,
            commentatorInfo: {
                userId: user!._id,
                userLogin: user!.login
            }
        })
        const newCommentMap = commentsQueryRepository.commentMapOutput(newComment)
        res.status(201).json(newCommentMap)
    } catch (e) {
        res.status(500).send(e)
    }
}

// export const createCommentController = async (req: Request, res: Response) => {
//     try {
//         const newComment = await commentsRepository.createComment(req.body)
//         const newCommentMap = commentsQueryRepository.commentMapOutput(newComment as IComment)
//         res.status(201).json(newCommentMap)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// }

export const updateCommentController = async (req: Request, res: Response) => {
    try {
        const commentId = new ObjectId(req.params.id)
        await commentsRepository.updateCommentById(commentId, req.body)
        res.status(204).send('Обновлено')
    } catch (e) {
        res.status(500).send(e)
    }
}

export const deleteCommentController = async (req: Request, res: Response) => {
    try {
        const commentId = new ObjectId(req.params.id)
        await commentsRepository.deleteComment(commentId)
        res.status(204).send('Удалено');
    } catch (e) {
        res.status(500).send(e)
    }

}

