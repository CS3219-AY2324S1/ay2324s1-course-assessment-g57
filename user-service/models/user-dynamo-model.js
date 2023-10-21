const dynamoose = require("dynamoose");

let ddb = new dynamoose.aws.ddb.DynamoDB();

dynamoose.aws.ddb.set(ddb);

const UserModel = dynamoose.model("users", {
  user_id: {
    type: String,
    hashKey: true
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  }
});

module.exports = {
  UserModel
};