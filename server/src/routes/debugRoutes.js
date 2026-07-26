import express from 'express';
import { pdfParseShape } from '../controllers/debugController.js';

const router = express.Router();

router.get('/pdfparse', pdfParseShape);

export default router;
