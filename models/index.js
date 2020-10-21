//importing the user model
const User = require("./User");
//importing the post model
const Post = require("./Post");

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

//exporting and object with User as a property
module.exports = { User, Post };
