const mongoose = require('mongoose')


const blocSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Bloc',blocSchema)