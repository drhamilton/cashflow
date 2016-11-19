let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ExpenseSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
);

ExpenseSchema.pre('save', next => {
    now = new Date();
    if (!this.createdAt){
        this.createdAt = now
    }
    next()
});

module.exports = mongoose.model('expense', ExpenseSchema);
