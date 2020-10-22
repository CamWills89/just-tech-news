//importing the user model
const User = require("./User");
//importing the post model
const Post = require("./Post");
//importing the vote model
const Vote = require("./Vote");
//importing the Comments model
const Comment = require("./Comment");

// create associations
//there is a "One to Many" relationship because a user
//can have many posts, but a post can only have one user who posted it
//so this creats reference for the id in the User model to link to the
//corresponding foreign key which is the user_id in the post model
User.hasMany(Post, {
  foreignKey: "user_id",
});

//this is the reverse association from the above code
//so the constraint here is that a post can belong to only one user
//we do this by declaring the foreign key link user_id in the post model
Post.belongsTo(User, {
  foreignKey: "user_id",
});

//these will connect User and post to each other THROUGH the vote model
//when we query Post, we see how many votes a user creates
//when we query User, we see all the posts they voted on
//this allows User and Post models to query eac other's info
//in the constext of a vote.
//one user cant vote on 1 post multiple times, this is called a Foreign Key Constraint
User.belongsToMany(Post, {
  through: Vote,
  as: "voted_posts",
  foreignKey: "user_id",
});

Post.belongsToMany(User, {
  through: Vote,
  as: "voted_posts",
  foreignKey: "post_id",
});

//creating one-to-man relationships btwn Vote & User and Vote & Post
//this lets us see a total count of votes for a single post when queried
//Here, we are connecting Vote to User
Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

//Here, we are connecting Vote to Post
Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

//Here, we are connecting Vote to User
User.hasMany(Vote, {
  foreignKey: 'user_id'
});

//Here, we are connecting Vote to Post
Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

//we dont have to specify Comment as a through table, coz we dont need access to Post through Comment
//we just need to see user's comments and which post its for. 

//creating the model associations for Comments
Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

//exporting and object with User, Post, Vote, Comment as properties
module.exports = { User, Post, Vote, Comment };
