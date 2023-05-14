const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const { json } = require("express");
const multer = require("multer");
const path = require("path");
const mongoClient = mongodb.MongoClient;
const app = express();
const URL =
  "mongodb+srv://kartheeswari:kar123Viji@cluster0.iwhgked.mongodb.net";
const DB = "infodazz";

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/volume");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("pdf"), async (req, res, next) => {
  const obj = JSON.parse(JSON.stringify(req.body));

  console.log(obj);

  console.log(req.file);
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

    const data = await db.collection("articles").insertOne(obj);
    
    let pdffile = await db
    .collection("articles")
    .updateOne(
      { article: obj.article},
      { $set: { pdfdata: req.file } }
    );

    await connection.close();

    res.json({ message: "success"  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "try again later" });
  }
});

app.listen(process.env.PORT || 3000);
