import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ResourceController } from '../controllers/resourceController.js';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.get('/', ResourceController.getAll);
router.post('/', upload.single('file'), ResourceController.create);
router.delete('/:id', ResourceController.delete);

export { router as resourceRoutes };