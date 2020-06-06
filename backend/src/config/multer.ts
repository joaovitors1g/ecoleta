import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', 'uploads'),
    filename(req, file, cb) {
      const hash = randomBytes(6).toString('hex');

      const filename = `${hash}_${file.originalname}`;

      cb(null, filename);
    },
  }),
};
