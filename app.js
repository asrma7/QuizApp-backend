require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const usersRoute = require("./routes/auth.routes");
const questionsRoute = require("./routes/question.routes");
const topicsRoute = require("./routes/topic.routes");
const cookieParser = require("cookie-parser");
const credentials = require("./middlewares/credentials.middleware");
const corsOptions = require("./config/corsOptions");
const {
  uploadFile,
  deleteUploadedFile,
} = require("./controllers/upload.controller");
const multer = require("multer");
const { verifyAdmin } = require("./middlewares/auth.middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.static("public"));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("this is home route");
});

app.post("/api/upload", [verifyAdmin, upload.single("image")], uploadFile);
app.delete("/api/upload/:fileName", verifyAdmin, deleteUploadedFile);

app.use("/auth", usersRoute);
app.use("/questions", questionsRoute);
app.use("/topics", topicsRoute);

const serverport = process.env.SERVERPORT || 3001;
const databaseURL = encodeURIComponent(process.env.DATABASEURL) || "localhost";
const databasePort = encodeURIComponent(process.env.DATABASEPORT) || 27017;
const databaseUsername = encodeURIComponent(process.env.DATABASEUSERNAME) || "";
const databasePassword = encodeURIComponent(process.env.DATABASEPASSWORD) || "";
const databaseName = encodeURIComponent(process.env.DATABASENAME) || "NodeAPP";

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb://${databaseUsername}:${databasePassword}@${databaseURL}:${databasePort}/${databaseName}?authSource=admin`
    );
    app.listen(serverport, () => {
      console.log(`Server is running on port ${serverport}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
