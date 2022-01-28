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



router.get('/', async (req, res) => {
    try {
        const blocs = await Bloc.find()
        res.render('blocs/index', {
            title: 'Gestion Blocs',
            blocs: blocs
        });
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/save', async (req, res) => {
    const bloc = new Bloc({
        name: req.body.name,
    })
    try {
        const a1 = await bloc.save()
        res.redirect('/blocs');

    } catch (err) {
        res.send('Error Hahahah')
    }
})


router.get('/delete/:id', (req, res) => {
    Bloc.findByIdAndDelete(req.params.id).then(function (bloc) {
        Salle.deleteMany({ "bloc": bloc }).then(function (salle) {
        })
    })
    res.redirect('/blocs');
})


router.post('/update/:id', async (req, res) => {
    try {
        const bloc = await Bloc.findById(req.params.id)
        bloc.name = req.body.name
        const a1 = await bloc.save()
        res.redirect('/blocs');
    } catch (err) {
        res.send('Error')
    }
})


router.get("/test", (req, res) => {
    res.send({
        test: "ok"
    })
})

module.exports = router