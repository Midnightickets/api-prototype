const mongoose = require('mongoose')

const { Schema } = mongoose

const listenerSchema = new Schema({
    specs: {
        type: Object,
        required: true,
    },
},
    { timestamps: true }
)

const Listener = mongoose.model('Listener', listenerSchema)

Listener.createIndexes();
module.exports = {
    Listener,
    listenerSchema,
}