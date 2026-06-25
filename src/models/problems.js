const mongoose = require('mongoose');
const { Schema } = mongoose;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },

    tags: [{
        type: String
    }],

    publicTestCases: [{
        input: {
            type: Schema.Types.Mixed,
            required: true
        },
        output: {
            type: Schema.Types.Mixed,
            required: true
        },
        explanation: String
    }],

    hiddenTestCases: [{
        input: {
            type: Schema.Types.Mixed,
            required: true
        },
        output: {
            type: Schema.Types.Mixed,
            required: true
        },
        explanation: String
    }],

    codeTemplates: [{
        language: {
            type: String,
            required: true
        },
        boilerplateCode: {
            type: String,
            required: true
        }
    }],

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});


const Problem=mongoose.model('problem',problemSchema);
module.exports=Problem;