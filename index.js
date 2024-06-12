const mongoose = require("mongoose")
const express = require("express")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/users")
const postRoute = require("./routes/posts")
const multer = require("multer")
const categoryRoute = require("./routes/categories")

dotenv.config()
const app = express()
app.use(express.json())

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose
  .connect(process.env.MONGO_URL, connectionParams)
  .then(() => {
    console.log("DB Connected Successfully")
  })
  .catch((err) => console.log("DB Conn failed" + err))

const storage = multer.diskStorage({
  destination: (file, req, call) => {
    call(null, "./uploads")
  },
  filename: (file, req, call) => {
    call(null, "hii.jpeg")
  },
})

const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded")
})

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)

app.listen("5000", () => {
  console.log("Server Started")
})
