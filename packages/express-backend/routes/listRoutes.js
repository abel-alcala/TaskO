import express from 'express';
import List from '../models/listModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const list = await List.create(req.body);
        res.status(201).json(list);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.get('/', async (req, res) => {
    try {
        const lists = await List.find().populate('tasks').populate('createdBy');
        res.json(lists);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const list = await List.findById(req.params.id).populate('tasks').populate('createdBy');
        if (!list) {
            return res.status(404).json({message: 'List not found'});
        }
        res.json(list);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const list = await List.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!list) {
            return res.status(404).json({message: 'List not found'});
        }
        res.json(list);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const list = await List.findByIdAndDelete(req.params.id);
        if (!list) {
            return res.status(404).json({message: 'List not found'});
        }
        res.json({message: 'List deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.put('/:id/add-task', async (req, res) => {
    try {
        const list = await List.findByIdAndUpdate(req.params.id, {$push: {tasks: req.body.taskId}}, {new: true}).populate('tasks').populate('createdBy');

        if (!list) {
            return res.status(404).json({message: 'List not found'});
        }

        res.json(list);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.put('/:id/remove-task', async (req, res) => {
    try {
        const list = await List.findByIdAndUpdate(req.params.id, {$pull: {tasks: req.body.taskId}}, {new: true}).populate('tasks').populate('createdBy');

        if (!list) {
            return res.status(404).json({message: 'List not found'});
        }

        res.json(list);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

export default router;
