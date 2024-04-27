import { Request } from "express";
import multer, { Multer, StorageEngine } from "multer";
import { userpicsPath } from "../app";
import { setUserpic } from "../controllers/users";
import { Router } from "express";

export const userpicsRouter = Router();

const storage: multer.StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userpicsPath);
  },
  filename: function (req: Request & { user: { _id: string } }, file, cb) {
    console.log(req.user._id);
    const uniqueSuffix = "avatar_" + req.user._id;
    cb(null, uniqueSuffix);
  },
});

const upload: Multer = multer({
  storage: storage,
});

userpicsRouter.post("", upload.single("avatar"), setUserpic);