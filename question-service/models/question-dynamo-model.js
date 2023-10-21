const dynamoose = require("dynamoose");

const ddb = new dynamoose.aws.ddb.DynamoDB();

dynamoose.aws.ddb.set(ddb);

const QuestionModel = dynamoose.model("questions", {
  id: {
    type: Number,
    rangeKey: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    hashKey: true
  },
  categories: {
    type: Array, 
    schema: [String]
  },
  complexity: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  description: {
    type: String,
    required: true
  },
  link: {
    type: String
  },
});

const MetadataModel = dynamoose.model("metadata", {
    type: String,
    lastID: Number
});

module.exports = {
    QuestionModel,
    MetadataModel
};