const express = require('express')
const router = express()
const User = require('../models/user')
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
        const users = await User.find()
        res.render('user/index', {
            title: 'Gestion Utilisateurs',
            users: users
        });
    } catch (err) {
        res.send('Error ' + err)
    }
})

router.get('/all', async(req, res) => {
    try {
        const users = await User.find()
        res.send(users);
    } catch (err) {
        res.send('Error ' + err)
    }
})


router.post('/save', async(req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    })
    try {
        const a1 = await user.save()
        res.redirect('/uesrs');

    } catch (err) {
        res.send('Error Hahahah')
    }
})


router.get('/delete/:id', async(req, res) => {
    const a1 = await User.findOneAndDelete({ _id: req.params.id })
    res.redirect('/users');
})


router.post('/update/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id)
        user.email = req.body.email
        user.password = req.body.password
        user.username = req.body.username
        user.role = req.body.role
        const a1 = await user.save()
        res.redirect('/users');
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