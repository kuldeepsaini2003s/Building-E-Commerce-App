import multer from "multer";
import fs from "fs";

// Ensure the directory exists
const dir = "public/temp";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true }); // recursive: true creates parent directories if they don't exist
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });