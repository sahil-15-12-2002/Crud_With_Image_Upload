const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("mongodb connection successfully established");
  })
  .catch((error) => {
    console.log(`error:${error}`);
  });

const userdata = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("userdata", userdata);
const imgdata = new mongoose.Schema(
  {
    imagename: {
      type: String,
    },
  },
  { timestamps: true }
);
const Imagedata = mongoose.model("imgdata", imgdata);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const newfile = new Imagedata({ imagename: req.file.filename });
    const savefile = await newfile.save();
    res.send("File uploaded successfully!", newfile, savefile);
    console.log("File uploaded successfully!", newfile, savefile);
  } catch (error) {
    res.send(error);
  }
});
app.get("/getuploads", async (req, res) => {
  try {
    const data = await Imagedata.find();
    console.log(data);
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

app.post("/postdata", async (req, res) => {
  try {
    const data = new User(req.body);
    const savedata = await data.save();
    res.send(savedata);
  } catch (error) {
    res.send(error);
  }
});

app.get("/getdata", async (req, res) => {
  try {
    const data = await User.find({});
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/deletedata/:id", async (req, res) => {
  try {
    const data = await User.findByIdAndDelete(req.params.id);
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

app.put("/editdata/:id", async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

const Port = process.env.Port;
app.listen(Port, () => {
  console.log(`server is running ${Port}`);
});
