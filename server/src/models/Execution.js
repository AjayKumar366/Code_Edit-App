import mongoose from 'mongoose';

const executionSchema = new mongoose.Schema({
    code: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Code',
        required: true, 
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },

    language: {
        type: String,
        required: true,
    },

    sourceCode: {
        type: String,
        required: true,
    },

    stdin: {
        type: String,
        default: '',
    },

    stdout: {
        type: String,
        default: '',
    },

    compileOutput: {
        type: String,
        default: '',
    },

    status: {
        type: String,
        required: true,
    },

    time: {
        type: Number,
        default: null,
    },

    memory: {
        type: Number,
        default: null,
    },
}, {timestamps: true});

const Execution = mongoose.model('Execution', executionSchema);

export default Execution;