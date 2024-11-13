import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String, required: true,
    }, notes: {
        type: String,
    }, dueDate: {
        type: Date,
    }, completed: {
        type: Boolean, default: false,
    }, remindDate: {
        type: Date,
    }, taskID: {
        type: String, unique: true, required: true,
    }, priority: {
        type: String, enum: ['Low', 'Medium', 'High'],
    }, list: {
        type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true,
    },
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
