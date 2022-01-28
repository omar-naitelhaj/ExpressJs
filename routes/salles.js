const express = require('express')
const router = express()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../views'));

//set view engine
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async(req, res) => {
    try {
        const salles = await Salle.find().populate("bloc")
        const blocs = await Bloc.find()
        res.render('salles/index', {
            title: 'Gestion Salles',
            salles: salles,
            blocs: blocs
        });
    } catch (err) {
        res.send('Error ' + err)
    }
})

router.get('/all', async(req, res) => {
    try {
        const salles = await Salle.find().populate("bloc")

        res.send(salles)
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.get('/delete/:id', async(req, res) => {
    try {
        const a1 = await Salle.findByIdAndDelete(req.params.id)
    } catch (err) {}
    res.redirect('/salles');
})


router.post('/update/:id', async(req, res) => {

    try {
        const salle = await Salle.findById(req.params.id)
        salle.name = req.body.name
        salle.type = req.body.type
        salle.bloc = req.body.bloc

        const a1 = await salle.save()
        res.redirect('/salles');
    } catch (err) {
        res.send('Error')
    }
})


router.post('/save', async(req, res) => {
    Bloc.findById(req.body.bloc).then(function(bloc) {
        if (bloc != null) {
            Salle.create(req.body).then(function(salle) {
                res.redirect('/salles');
            });
        } else {
            res.json({
                "erreur": "Bloc n'est pasdisponible"
            })
        }
    })

})


router.get('/:id', async(req, res) => {
    try {
        const a1 = await Salle.findById(req.params.id)
        const b1 = await Bloc.findById(a1.bloc)
        res.send({
            salleName: a1.name,
            salleType: a1.type,
            blocName: b1.name
        });
    } catch (err) {
        res.send('Errooooooooor');
    }
})


router.get("/test", (req, res) => {
    res.send({
        test: "ok"
    })
})

module.exports = router