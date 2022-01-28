const express = require('express')
const router = express()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
const Occupation = require('../models/occupation')
const Creneau = require('../models/creneau')
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
        const creneaux = await Creneau.find()

        var array = []
        var array1 = []
        var array2 = []
        var array3 = []
        var k = 0
        for (var i = 0; i < blocs.length; i++) {
            for (var j = 0; j < salles.length; j++) {
                if (blocs[i]._id + '' == salles[j].bloc._id + '') {
                    k++
                }
            }
            array.push({ bloc: blocs[i].name, nbrSalle: k })
            array1.push({ bloc: blocs[i].name, id: blocs[i]._id })
            k = 0
        }

        Occupation.aggregate(
            [{
                "$group": {
                    _id: "$date",
                    count: { $sum: 1 }
                }
            }, ],
            function(err, results) {
                if (err) throw err;
                array2 = results;
            })

        res.render('dashboard/index', {
            title: 'Dashboard',
            sallesNbr: salles.length,
            blocsNbr: blocs.length,
            creneauxNbr: creneaux.length,
            array: array,
            array1: array1
        });
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.get('/chart', async(req, res) => {

    try {
        var crDate = new Date();
        var array = []
        var array1 = []
        var array2 = []
        var array3 = []


        const salles = await Salle.find()
        const blocs = await Bloc.find()
        const occupations = await Occupation.find()

        var k = 0
        for (var i = 0; i < blocs.length; i++) {
            for (var j = 0; j < salles.length; j++) {
                if (blocs[i]._id + '' == salles[j].bloc._id + '') {
                    k++
                }
            }

            array1.push({ bloc: blocs[i].name, nbrSalle: k })
            k = 0
        }



        k = 0
        for (var i = 0; i < salles.length; i++) {
            for (var j = 0; j < occupations.length; j++) {
                var a = occupations[j].date.split("-")
                if (a[2]==crDate.getFullYear() && a[1]==crDate.getMonth()+1 && a[0]>=crDate.getUTCDate()-7){
                    if (occupations[j].salle + '' == salles[i]._id + '') {
                        k++
                    }
                }
            }
            array3.push({ salle: salles[i].name, nbr: k})

            k = 0
        }





        Occupation.aggregate(
            [{
                "$group": {
                    _id: "$date",
                    count: { $sum: 1 }
                }
            }, ],
            function(err, results) {
                if (err) throw err;
                for (var i = 0; i < results.length; i++) {
                    array2.push({ date: results[i]._id, nbrOccupation: results[i].count })
                }
                array.push({ array1: array1, array2: array2, array3 : array3 })
                res.status(200).send(array)
            })






    } catch (err) {
        res.send('Error ' + err)
    }
})


router.get('/chart1', async(req, res) => {

    try {
        var crDate = new Date();
        var array = []
        var array1 = []
        var array2 = []

        const occupations = await Occupation.find()
        const salles = await Salle.find()
        var k = 0
        for (var i = 0; i < salles.length; i++) {
            for (var j = 0; j < occupations.length; j++) {
                var a = occupations[j].date.split("-")
                if (a[2]==crDate.getFullYear() && a[1]==crDate.getMonth()+1 && a[0]>=crDate.getUTCDate()-7){
                    if (occupations[j].salle + '' == salles[i]._id + '') {
                        k++
                    }
                }
            }
            array.push({ salle: salles[i].name, nbr: k})

            k = 0
        }
        res.send(array)

    } catch (err) {
        res.send('Error ' + err)
    }
})

router.get('/chart/mobile', async(req, res) => {

    try {
        var array = []

        const salles = await Salle.find()
        const blocs = await Bloc.find()
        var k = 0
        for (var i = 0; i < blocs.length; i++) {
            for (var j = 0; j < salles.length; j++) {
                if (blocs[i]._id + '' == salles[j].bloc._id + '') {
                    k++
                }
            }
            array.push({ bloc: blocs[i].name, nbrSalle: k })
            k = 0
        }
        res.status(200).send({ array: array })
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.get("/test", (req, res) => {
    res.send({
        test: "ok"
    })
})

module.exports = router