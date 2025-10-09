import express from 'express';
import { getHero } from '../controllers/impact.controller.ts';

const router = express.Router();

router.get('/hero', getHero);

export default router;




