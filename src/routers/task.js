const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async(req, res) => {
    console.log('hit')
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.status(201).send(task)
    }catch (err) {
        res.status(400).send(e)
    }
})

router.get('/tasks', auth, async(req, res) => {
    try{
        //first method
        // await req.user.populate('tasks')
        // res.send(req.user.tasks)

        // second method
        const task = await Task.find({owner: req.user._id}).populate('owner')
        res.send(task)
    } catch (err) {
        res.status(500).send(err)
    }
})


module.exports = router