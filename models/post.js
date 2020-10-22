const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// create our Post model
class Post extends Model {
  //we use JS static keyword to indicate that upvote is based on the Post model.
  //and is not an instance method, but a model method
  //req.body will be passed in as body and and object of models as models
  static upvote(body, models) {
    // create the vote, we need to pass both the user's id and the post's id
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id,
    }).then(() => {
      // then find the post we just voted on
      return Post.findOne({
        where: {
          id: body.post_id,
        },
        attributes: [
          "id",
          "post_url",
          "title",
          "created_at",
          //the sequelize .findAndCountAll() wont work here, coz we're counting associated table's data and not the post itself
          // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
          //.literal(), lets us run regular SQL queries
          [
            sequelize.literal(
              "(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)"
            ),
            "vote_count",
          ],
        ],
      });
    });
  }
}

// create fields/columns for Post model
Post.init(
  //define the post schema
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      //validate that the urll is a verified link
      validate: {
        isURL: true,
      },
    },
    //this column determines who posted the article
    //reference established relationship btwn this post and the user
    //by creating a reference to the User model
    //specifically the id column defiuned by the key property which is the primary key
    //the user_id is is the foreign key and it the matching link
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;
