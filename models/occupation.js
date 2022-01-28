const mongoose = require('mongoose')


const Occupationschema = new mongoose.Schema({

    salle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salle'
    },
    creneau: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'creneau'
    },
    date: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
})

module.exports = mongoose.model('occupation', Occupationschema)