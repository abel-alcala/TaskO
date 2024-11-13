import mongoose from 'mongoose';

const listSchema = new mongoose.Schema({
    listID: {
        type: String, required: true, unique: true,
    }, listName: {
        type: String, required: true,
    }, tasks: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Task',
    }], color: {
        type: Number, required: false,
    }, createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    },
}, {
    timestamps: true,
});

const List = mongoose.model('List', listSchema);
export default List;
