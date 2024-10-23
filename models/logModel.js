import mongoose from "mongoose";

const logSchema = mongoose.Schema({
    actionType: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true,
    },
    additionalData: {
        type: Object,
    },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);
export default Log;