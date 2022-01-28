const mongoose = require('mongoose')


const Creaneauschema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    debut: {
        type: String,
        required: true
    },
    fin: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('creneau',Creaneauschema)