import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import subscriptionRouter from "./subscription";
import scriptsRouter from "./scripts";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(subscriptionRouter);
router.use(scriptsRouter);

export default router;
