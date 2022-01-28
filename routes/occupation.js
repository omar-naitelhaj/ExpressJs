const express = require('express')
const router = express()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
const Occupation = require('../models/occupation')
const Creneau = require('../models/creneau')
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const WebSocket = require('ws')
const creneau = require('../models/creneau')
    ///////////////////////////////////////////////////////////

//definir moteur de template
//set views file
router.set('views', path.join(__dirname, '../views'));

//set view engine
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async(req, res) => {
    try {
        const creneaux = await Creneau.find()
        const salles = await Salle.find().populate("bloc")
        const occupations = await Occupation.find().populate("salle").populate("creneau")
        res.render('occupation/index', {
            title: 'Gestion Occupation',
            occupations: occupations,
            salles: salles,
            creneaux: creneaux
        });
    } catch (err) {
        res.send('Error ' + err)
    }
})

router.get('/all', async(req, res) => {
    try {
        const occupation = await Occupation.find().populate("salle").populate("creneau")
        res.send(occupation)
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.get('/occupe/:salle/:creneau/:datee', async(req, res) => {
    try {

        const creneauu = await Creneau.find({ "_id": req.params.creneau })
        const sallee = await Salle.find({ "_id": req.params.salle })
        const occupationn = await Occupation.find({ "creneau": creneauu, "salle": sallee, "date": req.params.datee })
        if (occupationn.length === 0) { res.send({ msg: 'salle est occupe' }) } else { res.send({ msg: 'salle deja occupe' }) }

    } catch (err) {
        res.send('Error ' + err)
    }
})


router.get('/cren/', async(req, res) => {

    try {

        var currentDate = new Date(); //use your date here
        var creneau = '';
        var msg = "not found";

        const creneaux = await Creneau.find()
        for (var i = 0; i < creneaux.length; i++) {
            var debut = creneaux[i].debut.split(":");
            var fin = creneaux[i].fin.split(":");
            debutCreneau = debut[1] * 1 + debut[0] * 60;
            finCreneau = fin[1] * 1 + fin[0] * 60;
            dateToMinute = currentDate.getHours() * 60 + currentDate.getMinutes() * 1;
            if (debutCreneau <= dateToMinute && finCreneau >= dateToMinute) {
                creneau = creneaux[i];
                msg = "found";

            }
        }
        res.send({ msg: msg, creneau: creneau })



    } catch (err) {
        res.send('Error ' + err)
    }


})


router.get('/occupe/:bloc', async(req, res) => {

    var array = [];
    var currentDate = new Date(); //use your date here
    var datee = currentDate.toLocaleDateString('fr-FR');
    var newdate = datee.split("/").join("-");
    var occupation = '';
    var creneau = '';

    const creneaux = await Creneau.find()
    for (var i = 0; i < creneaux.length; i++) {
        var debut = creneaux[i].debut.split(":");
        var fin = creneaux[i].fin.split(":");
        debutCreneau = debut[1] * 1 + debut[0] * 60;
        finCreneau = fin[1] * 1 + fin[0] * 60;
        dateToMinute = currentDate.getHours() * 60 + currentDate.getMinutes() * 1;
        if (debutCreneau <= dateToMinute && finCreneau >= dateToMinute) {
            creneau = creneaux[i];
        }
    }

    try {
        const bloc = await Bloc.find({ "_id": req.params.bloc })
        const salles = await Salle.find({ "bloc": bloc })
        for (var i = 0; i < salles.length; i++) {
            occupation = ''
            occupation = await Occupation.find({ "creneau": creneau, "salle": salles[i], "date": newdate })
            if (occupation.length === 0) {
                array.push({ bloc: bloc[0].name, name: salles[i].name, type: salles[i].type, occupied: 0 })
            } else {
                array.push({ bloc: bloc[0].name, name: salles[i].name, type: salles[i].type, occupied: 1 })
            }
        }
        res.send({ array: array })


    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/', async(req, res) => {

    var currentDate = new Date(); //use your date here

    var datee = currentDate.toLocaleDateString('fr-FR');
    var newdate = datee.split("/").join("-");


    const creneauu = await Creneau.find({ "_id": req.body.creneau })
    const sallee = await Salle.find({ "_id": req.body.salle })
    const occupationn = await Occupation.find({ "creneau": creneauu, "salle": sallee, "date": newdate })

    if (occupationn.length == 0) {

        Salle.findById(req.body.salle).then(function(salle) {
            Creneau.findById(req.body.creneau).then(function(creneau) {

                if (salle != null && creneau != null) {



                    Occupation.create({
                        "salle": req.body.salle,
                        "creneau": req.body.creneau,
                        "date": newdate

                    }).then(function(occupation) {
                        // Create WebSocket connection.
                        const socket = new WebSocket('ws://localhost:8080');

                        // Connection opened
                        socket.addEventListener('open', function(event) {
                            socket.send(JSON.stringify(occupation))
                        });

                    });

                } else {
                    res.json({
                        "erreur": "salle n'est pas disponible"
                    })
                }
            })

        })

    } else { res.send({ msg: 'salle deja occupe' }) }
})


router.post('/update/:id', async(req, res) => {
    const occupation = await Occupation.findById(req.params.id)
    try {
        var currentDate = new Date(); //use your date here
        var datee = currentDate.toLocaleDateString('fr-FR');
        var newdate = datee.split("/").join("-");

        occupation.salle = req.body.salle
        occupation.creneau = req.body.creneau
        occupation.date = newdate

        const a1 = await occupation.save()

        res.redirect('/occupation');
    } catch (err) {
        res.send(err)
    }
})


router.get('/delete/:id', async(req, res) => {
    try {
        const a1 = await Occupation.findOneAndDelete({ _id: req.params.id })
        const salles = await Occupation.find().populate("salle").populate("creneau")
        res.redirect('/occupation');
    } catch (err) {
        res.send('Error')
    }
})


router.get('/salles/:id', async function(req, res, next) {
    var query = { salle: req.params.id };
    var today = new Date("<YYYY-mm-dd>");

    const salles = await Creneau.find({ "label": req.params.id })
    Occupation.find({
        "creneau": salles,
        "date": {
            $gte: new Date(new Date().setHours(0, 0, 0)),
            $lt: new Date(new Date().setHours(23, 59, 59))
        }
    }).populate('salle').then(function(salle) {
        res.send(salle);
    }).catch(next);
});

module.exports = router