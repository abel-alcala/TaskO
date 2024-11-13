import express from 'express';
import Task from '../models/taskModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('list');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('list');
        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }
        res.json(task);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({message: 'Task not found'});
        }
        res.json({message: 'Task deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

export default router;
