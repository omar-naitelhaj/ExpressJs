const express = require('express')
const router = express.Router()
const Bloc = require('../models/bloc')
const Salle = require('../models/salle')



router.get('/', async(req,res) => {
    try{
           const blocs = await Bloc.find()
           res.json(blocs)
    }catch(err){
        res.send('Error ' + err)
    }
})

router.get('/:id', async(req,res) => {
    try{
           const bloc = await Bloc.findById(req.params.id)
           res.json(bloc)
    }catch(err){
        res.send('Error ' + err)
    }
})


router.post('/', async(req,res) => {
    const bloc = new Bloc({
        name: req.body.name,
    })
    try{
        const a1 =  await bloc.save() 
        res.json(a1)
    }catch(err){
        res.send('Error')
    }
})

router.patch('/:id',async(req,res)=> {
    try{
        const bloc = await Bloc.findById(req.params.id) 
        bloc.sub = req.body.sub
        const a1 = await Bloc.save()
        res.json(a1)   
    }catch(err){
        res.send('Error')
    }

})
router.delete('/:id',(req,res)=> {
    // try{
    //     const a1 = await Bloc.findOneAndDelete(req.params.id)

    //     res.json(a1)   
    // }catch(err){
    //     res.send('Error')
    // }
   Bloc.findOneAndDelete(req.params.id).then(function(bloc){
       Salle.deleteMany({"bloc":bloc}).then(function(salle){
        res.send(salle);
    })
   })

})

module.exports = router