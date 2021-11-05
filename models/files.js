import mongoose from 'mongoose';

// data model to organise data in db
const Schema = mongoose.Schema;
const fileSchema = new Schema({
    fileName: {type: String, required: true},
    path: {type: String, required: true},
    size: {type: Number, required: true,},
    uuid: {type: String, required: true},
    sender: {type: String, required: false},
    receiver: {type: String, required: false},
}, {timestamps: true} );

export default mongoose.model('Files', fileSchema);