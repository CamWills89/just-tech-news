const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");

//this uses the template engine/ so we use res.render to send the homepage template.
//we can enter an object a 2nd argument, which includes the data we want to send
router.get("/", (req, res) => {
  console.log(req.session);
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      console.log(dbPostData[0]);
      // pass a single post object into the homepage template
      //we use sequelizes get method to serialize the data so we can use it in handlebars
      //we didnt need to do this with api routes, bcoz res.json() already does that for us
      //we map through the post data to return an array of all the posts to send to the html
      //but this array will break the page, but handlebarsJs has helpers that allow
      // us to lopo over arrays, which we add in homepage.handlebars
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("homepage", { posts });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

module.exports = router;
