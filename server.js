
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

const express = require('express');
var session = require('express-session');
const app = express();
var bodyParser = require('body-parser');

const nodemailer = require('nodemailer');
const mailer = 'patrikmaximov749@gmail.com';
const mailerPass = 'hunter749';

app.use(express.static(__dirname));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(session({ secret: 'mysecret' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.bodyParser());

var sess;

app.get('*', function (req, res, next) {
    sess = req.session;
    // console.log(sess.email);
    next();
});

app.get('/session', function (req, res) {
    sess = req.session;
    res.send(sess.email);
    res.end();
});

app.get('/', function (req, res) {
    sess = req.session;
    if (sess.email) {
        res.redirect('/admin');
    }
    else {
        res.render('index.html');
    }
});

app.get('/login', function (req, res) {
    sess = req.session;
    console.log(sess);
    if (sess != undefined && sess.email == 'admin')
        res.redirect('/admin');
    else
        res.redirect('/login.html');
});

app.post('/login', function (req, res) {
    sess = req.session;
    if (sess.email == 'admin') res.redirect('/admin');
    sess.email = req.body.email;
    var passwd = req.body.pass;
    console.log(sess.email, passwd);
    if (sess.email == 'admin' && passwd == 'admin')
        res.end('done');
    else {
        res.send('error');
        res.end('error');
    }
});

app.get('/admin', function (req, res) {
    sess = req.session;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    if (sess.email) {
        res.write('<h1>Hello ' + sess.email + '</h1>');
        res.end('<a href="/admin_exit">Выйти</a><br>' +
            '<a href="/">Домой</a>');
    } else {
        res.write('<h1>Please login first.</h1>' +
            '<a href="/">Домой</a><br>');
        res.end('<a href="/admin_exit">Выйти</a>');
    }
});

app.get('/admin_exit', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/');

    });
});

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

});


// ----------------------------------------------------------------------- //



const buy_url = '/buy?';
const get_url = '/get/';

app.get('/buy*', (req, res) => {
    var str = req.url.substr(buy_url.length, req.url.length);
    str = decodeURIComponent(str);
    str = str.split('&');
    for (var i = 0; i < str.length; i++)
        str[i] = str[i].substr(str[i].indexOf('=') + 1, str[i].length);
    console.log(str);

    bodyText = `<h1>Здравствуйте ${str[3]}!</h1><br>
                Вы заказывали на нашем сайте <strong>${str[1]}</strong> в количестве ${str[2]} шт<br> 
                Ваш заказ находится в обработке, 
                ждите звонка оператора на номер телефона - <a href="tel:${str[4]}"><strong>${str[4]}</strong></a>.<br>
                <h5>Спасибо за заказ!</h5>`;

    nodemailer.createTestAccount((err, account) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailer,
                pass: mailerPass,
            }
        });

        const mailOptions = {
            from: mailer,
            to: str[5],
            subject: 'Ваш заказ в обработке!',
            text: bodyText,
            html: bodyText
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    });

    res.send('success');
});

app.get('/get/*', (req, res) => {
    if (req.url.indexOf(get_url) == 0) {
        var responde = '';
        var id = req.url.substr(get_url.length, req.url.length);
        // console.log('--> ' + get_url + id);
        const client = new MongoClient(url, { useNewUrlParser: true });

        client.connect(function (err) {
            assert.equal(null, err);
            // console.log('Есть соединение');
            const db = client.db('myDB');
            db.collection('Store').find(
                {}, { projection: { _id: 1, name: 1, price: 1, number: 1, img: 1 } }).toArray(
                    (err, result) => {
                        if (err) throw err;
                        // console.log('Нет ошибок');
                        for (var i = 0; i < result.length; i++) {
                            if (result[i]._id == id) {
                                // console.log(result[i]._id + ' FOUNDED!');
                                responde = result[i];
                            }

                            // console.log(result[i]._id);
                        }
                        // console.log(' <-- End of search --> ');
                        // console.log('I will send this');
                        // console.log(responde);
                        res.send(responde);
                        res.end();
                    });
            client.close();
        });
    }
});

app.get('/start_page', (req, res) => {
    // console.log('Прогрузка каталога....');
    var client = new MongoClient(url, { useNewUrlParser: true });
    client.connect(function (err) {
        assert.equal(null, err);
        //console.log("Connected successfully to server");

        const db = client.db('myDB');
        db.collection('Store').find(
            {}, { projection: { _id: 1, name: 1, price: 1, number: 1, img: 1 } }).toArray(
                (err, result) => {
                    if (err) throw err;
                    //console.log(result);
                    res.send(result);
                    res.end();
                });

        client.close();
    });
});

app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // console.log(`Server running on port ${PORT}...`);
})