const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categories: {
        type: [String]
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
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});
    
module.exports = mongoose.model('Question', questionSchema);