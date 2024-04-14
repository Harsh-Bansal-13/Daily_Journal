//jshint esversion:6
const temp = require("dotenv").config();
const port = process.env.PORT || 4000;
const url = process.env.URL_MONGODB;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose");

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB Atlas database");
  })
  .catch((err) => {
    console.log(url);
    console.log("MongoDB Atlas server not connected");
    console.error(err);
  });

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

var _ = require("lodash");

const homeStartingContent =
  "This is Daily Journal webpage. Here You can write anything or share latest news about various events Happening in the country. It's Like a Notice Board where you can post anything";
const aboutContent ="Welcome to Daily Journal, your go-to destination for staying informed, engaged, and inspired. At Daily Journal, we believe in the power of knowledge to connect people, spark conversations, and drive positive change. Our platform is more than just a website—it's a vibrant community where individuals from all walks of life come together to share, discover, and explore the world around them.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}).then((data) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: data,
    });
  });
});
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postID", function (req, res) {
  const requestedPostId = req.params.postID;

  Post.findOne({ _id: requestedPostId }).then((data) => {
    res.render("post", {
      title: data.title,
      content: data.content,
      _id: data._id, // Pass _id to the template
    });
  });
});
app.post("/delete/:postId", function (req, res) {
  const postId = req.params.postId;

  Post.findByIdAndRemove(postId)
    .then((deletedPost) => {
      if (deletedPost) {
        console.log("Successfully deleted the post with ID:", postId);
        res.redirect("/");
      } else {
        console.log("Post not found with ID:", postId);
        res.sendStatus(404); // Not Found
      }
    })
    .catch((err) => {
      console.log("Error deleting the post:", err);
      res.sendStatus(500); // Internal Server Error
    });
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save();

  res.redirect("/");
});

app.listen(port, function () {
  console.log("Server started on port 3000");
});
