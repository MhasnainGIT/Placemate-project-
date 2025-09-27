import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

const singleUpload = upload.single("file");
export default singleUpload;