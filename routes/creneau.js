const express = require('express')
const router = express()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Creneau = require('../models/creneau')
//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../views'));

//set view engine
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



router.get('/', async (req, res) => {

    try {
        const creneau = await Creneau.find()
        res.render('creneau/index', {
            title: 'Gestion Créneau',
            creneau: creneau
        });

    } catch (err) {
        res.send('Error ' + err)
    }

})


router.post('/update/:id', async (req, res) => {
    try {
        const creneau = await Creneau.findById(req.params.id)
        creneau.label = req.body.label
        creneau.debut = req.body.debut
        creneau.fin = req.body.fin
        const a1 = await creneau.save()

        res.redirect('/creneau');
    } catch (err) {
        res.send('Error')
    }

})

router.post('/save', async (req, res) => {
    const bloc = new Creneau({
        label: req.body.label,
        debut: req.body.debut,
        fin: req.body.fin
    })
    try {
        const a1 = await bloc.save()
        res.redirect('/creneau');
    } catch (err) {
        res.send('Error')
    }
})


router.get('/delete/:id', async (req, res) => {
    try {
        const a1 = await Creneau.findByIdAndDelete(req.params.id)
    } catch (err) {
        res.send('Error')
    }

    res.redirect('/creneau');
})

module.exports = router