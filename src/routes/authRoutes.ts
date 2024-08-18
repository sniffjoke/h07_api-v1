import express from "express";
import {getMeController, loginController} from "../controllers/authController";
import {errorMiddleware} from "../middlewares/errorMiddleware";
import {authMiddlewareWithBearer} from "../middlewares/authMiddleware";


const router = express.Router();

router.route('/login')
    .post(
        loginController
    );

router.route('/registration-confirmation')
    .post(
        loginController
    );
router.route('/registration')
    .post(
        loginController
    );
router.route('/registration-email-resending')
    .post(
        loginController
    );


router.route('/me')
    .get(
        authMiddlewareWithBearer,
        errorMiddleware,
        getMeController
    );

export default router
