const express = require('express')
const router = express.Router()
const Question = require('../models/question-model')

// Read questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find()
        res.json(questions)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getQuestion, (req, res) => {
    res.json(res.question)
})

// Add a question
router.post('/', async (req, res) => {
    const question = new Question({
        title: req.body.title,
        categories: req.body.categories,
        complexity: req.body.complexity,
        description: req.body.description,
        link: req.body.link
    })
    try {
        const newQuestion = await question.save()
        res.status(201).json(newQuestion)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Update a question
router.patch('/:id', getQuestion, async (req, res) => {
    if (req.body.title != null) {
        res.question.title = req.body.title
    }
    if (req.body.categories != null) {
        res.question.categories = req.body.categories
    }
    if (req.body.complexity != null) {
        res.question.complexity = req.body.complexity
    }
    if (req.body.description != null) {
        res.question.description = req.body.description
    }
    if (req.body.link != null) {
        res.question.link = req.body.link
    }
    try {
        const updatedQuestion = await res.question.save()
        res.json(updatedQuestion)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Delete a question
router.delete('/:id', getQuestion, async (req, res) => {
    try {
        await res.question.deleteOne()
        res.json({ message: 'Deleted question' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// middleware
async function getQuestion(req, res, next) {
    let question
    try {
        question = await Question.findById(req.params.id)
        if (question == null) {
            return res.status(404).json({ message: 'Cannot find question' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.question = question
    next()
}

module.exports = router