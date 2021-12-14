const mongoose = require('mongoose')


const salleShema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    bloc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bloc'
     },
    
})

module.exports = mongoose.model('Salle',salleShema)