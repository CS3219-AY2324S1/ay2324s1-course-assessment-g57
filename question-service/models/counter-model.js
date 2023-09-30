require('dotenv').config()
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    collectionName: {
        type: String,
        required: true
    },
    sequenceNum: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Counter', counterSchema, process.env.COUNTER_COLLECTION_NAME);
