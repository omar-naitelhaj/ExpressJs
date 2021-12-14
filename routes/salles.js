const express = require('express')
const router = express.Router()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')


router.get('/', async(req,res) => {
    try{
           const salles = await Salle.find()
           res.json(salles)
    }catch(err){
        res.send('Error ' + err)
    }
})
router.post('/', async(req,res) => {
    // const bloc = new Salle({
    //     _id: req.body.bloc._id,
    //     name: req.body.bloc.name,
    //     __v: req.body.bloc.__v,
    // })
    // const salle = new Salle(
    //     req.body
    // )
    // try{
    //     const a1 =  await salle.save() 
    //     res.json(a1)
    // }catch(err){
    //     res.send('Error')
    // }
    Bloc.findById(req.body.bloc._id).then(function(bloc){
        if(bloc != null){
            Salle.create(req.body).then(function(salle){
                res.send(salle);
            });
        }else {
            res.json({
                "erreur":"Bloc n'est pasdisponible"
            }) 
        }
    })

})

router.delete('/:id',async(req,res)=> {
    try{
        const a1 = await Salle.findOneAndDelete(req.params.id)
        res.json(a1)   
    }catch(err){
        res.send('Error')
    }

})
module.exports = router