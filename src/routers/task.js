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


// router.get('/tasks', auth, async(req, res) => {
//     try{
//         //first method
//         // await req.user.populate('tasks')
//         // res.send(req.user.tasks)

//         // second method
//         const task = await Task.find({owner: req.user._id}).populate('owner')
//         res.send(task)
//     } catch (err) {
//         res.status(500).send(err)
//     }
// })


// pagination (get tasks)
// GET /tasks?complete=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async(req, res) => {
    try{
        const match = {}
        const sort = {}  
        
        if(req.query.complete) {
            match.complete = req.query.complete === 'true'
        }

        if(req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })

        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try{
        const _id = req.params.id
        const task = await Task.findOne({_id, owner: req.user._id}).populate('owner')

        if(!task) {
            return res.status(404).send()
        }

        res.send(task)
    }catch(err) {
        res.status(500).send(err)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'complete']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates! '})
    }

    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        
        if(!task) {
            return res.status(400).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})


router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router