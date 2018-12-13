var mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const http = require('http');
var formidable = require('formidable');
var fs = require('fs');

var formidable = require('formidable');

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
app.set('view engine', 'ejs');

app.use(session({
    secret: 'mysecret'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// var sess;

app.get('*', function (req, res, next) {
    // sess = req.session;
    // console.log(sess.email);
    next();
});

// ------------ <ADMIN> ------------ //

app.get('/admin', function (req, res) {
    var sess = req.session;
    // sess.email = 'admin' /// УДАЛИТЬ ПОТОМ
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });
    if (sess.email) {
        res.write('<h1>Hello ' + sess.email + '</h1>' +
            '<a href="/admin/orders">Заказы</a><h1></h1>' +
            // '<h3 id="delete_me_after">I\'m loading....</h3>' +
            // '<link rel="stylesheet" href="css/style.css">' +
            '<div id="delete_me_after">' +
            '<span class="cssload-loader"><span class="cssload-loader-inner"></span></span>' +
            '</div>' +
            '<div id="main_container"></div>' +
            '<link rel="stylesheet" href="css/loading_icon.css">' +
            '<script src="js/admin_funcs.js" async></script>');
        res.end('<br><a href="/admin_exit">Выйти</a><br>' +
            '<a href="/">Домой</a>');
    } else {
        res.write('<h1>Please login first.</h1>' +
            '<a href="/">Домой</a><br>');
        res.end('<a href="/login">Войти</a>');
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

app.get('/admin/change/:id', function (req, res) {
    var sess = req.session;

    if (sess != undefined && sess.email == 'admin') {
        var id = req.params.id;

        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("myDB");

            dbo.collection('Store', function (err, collection) {

                collection.find({
                    '_id': mongo.ObjectID(id)
                }, {
                    projection: {
                        name: 1,
                        price: 1,
                        number: 1,
                        img: 1
                    }
                }).toArray((err, result) => {
                    if (err) throw err;
                    res.render('admin_product_change', {
                        data: result[0]
                    });
                });
            });
        });
    } else res.redirect('/admin');
})

app.post('/admin/change/:id', function (req, res) {
    var sess = req.session;

    if (sess != undefined && sess.email == 'admin') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            console.log(fields);
            var file_name = files.filetoupload.name;

            if (files.filetoupload.name != '') {
                var myObj = {
                    _id: req.params.id,
                    name: fields['product_name'],
                    price: +fields['product_price'],
                    number: +fields['product_quantity'],
                    img: '/img/' + files.filetoupload.name
                }
                console.log(myObj);

                MongoClient.connect(url, {
                    useNewUrlParser: true
                }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("myDB");

                    dbo.collection('Store', function (err, collection) {

                        collection.updateOne({
                            '_id': mongo.ObjectID(myObj['_id'])
                        }, {
                            $set: {
                                name: myObj['name'],
                                price: +myObj['price'],
                                number: +myObj['number'],
                                img: '/img/' + files.filetoupload.name
                            }
                        }, {
                            upsert: true
                        });

                        if (err) throw err;

                        var oldpath = files.filetoupload.path;
                        var newpath = './img/' + files.filetoupload.name;
                        fs.rename(oldpath, newpath, function (err) {
                            if (err) throw err;
                        });

                        console.log('success!');
                    });
                });
            } else {
                var myObj = {
                    _id: req.params.id,
                    name: fields['product_name'],
                    price: +fields['product_price'],
                    number: +fields['product_quantity']
                }
                console.log(myObj);

                MongoClient.connect(url, {
                    useNewUrlParser: true
                }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("myDB");

                    dbo.collection('Store', function (err, collection) {

                        collection.updateOne({
                            '_id': mongo.ObjectID(myObj['_id'])
                        }, {
                            $set: {
                                name: myObj['name'],
                                price: +myObj['price'],
                                number: +myObj['number']
                            }
                        }, {
                            upsert: true
                        });
                        if (err) throw err;
                        console.log('success!');
                    });
                });
            }

            res.redirect('/admin');
        })
    } else res.redirect('/admin')
});

app.get('/admin/new', function (req, res) {
    var sess = req.session;
    if (sess.email) {
        res.render('admin_product_new');
    } else {
        res.redirect('/login');
    }
});

app.get('/admin/remove/:id', function (req, res) {
    // console.log('remove ', req.params.id);
    var sess = req.session;

    if (sess != undefined && sess.email == 'admin') {
        var id = req.params.id;
        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("myDB");

            dbo.collection('Store', function (err, collection) {

                collection.find({
                    '_id': mongo.ObjectID(id)
                }, {
                    projection: {
                        img: 1
                    }
                }).toArray((err, result) => {
                    if (err) throw err;
                    var img_path = result[0]['img'];
                    fs.unlink('.\\' + img_path, (err) => {
                        // console.log(img_path, 'was deleted');
                    });
                });


                collection.deleteOne({
                    _id: mongo.ObjectID(id)
                });
                if (err) console.log('document was\'t deleted!');


                // console.log("1 document deleted");
                res.redirect('/admin');
            });
        });
    } else res.redirect('/admin');
})

app.post('/admin/fileupload', function (req, res) {
    var sess = req.session;

    if (sess != undefined && sess.email == 'admin') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var myObj = {
                name: fields['product_name'],
                price: +fields['product_price'],
                number: +fields['product_quantity'],
                img: '/img/' + files.filetoupload.name
            }

            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("myDB");
                dbo.collection("Store").insertOne(myObj, function (err, res) {
                    if (err) throw err;
                    db.close();
                });
            });

            var oldpath = files.filetoupload.path;
            var newpath = './img/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.redirect('/admin');
            });
        });
    } else res.redirect('/admin');
})

app.get('/admin/orders', function (req, res) {
    var sess = req.session;

    if (sess != undefined && sess.email == 'admin') {
        var client = new MongoClient(url, {
            useNewUrlParser: true
        });
        client.connect(function (err) {
            assert.equal(null, err);
            //console.log("Connected successfully to server");

            const db = client.db('myDB');
            db.collection('Orders').find({}, {
                projection: {
                    product: 1,
                    customer: 1,
                    processed: 1,
                    final_price: 1
                }
            }).toArray(
                (err, result) => {
                    if (err) throw err;
                    // console.log(result);

                    res.render('admin_orders', {
                        data: result
                    });
                });

            client.close();
        });
    } else res.redirect('/admin');
});

app.get('/admin/orders/:id', function (req, res) {
    var sess = req.session;
    if (sess != undefined && sess.email == 'admin') {
        let id = req.params.id;

        MongoClient.connect(url, {
            useNewUrlParser: true
        }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("myDB");
            
            dbo.collection('Orders', function (err, collection) {
                collection.updateOne({
                    '_id': mongo.ObjectID(id)
                }, {
                    $set: {
                        processed: true
                    }
                }, {
                    upsert: true
                });
                if (err) throw err;
                res.redirect('/admin/orders');
            });
        });
    } else res.redirect('/admin');
})

// ------------ </ ADMIN > ------------ //





// app.get('/session', function (req, res) {
//     sess = req.session;
//     res.send(sess.email);
//     res.end();
// });

app.get('/', async function (req, res) {
    var sess = req.session;
    var products = await getProducts();

    res.render('home', {
        data: products
    });
});

app.get('/product/:id', async function (req, res) {
    var sess = req.session;
    let products = await getProducts();
    products = products.filter(item => item['_id'] == req.params.id);
    product = products[0];
    // console.log(product);
    res.render('view_page.ejs', {
        data: product
    })
});

app.get('/login', function (req, res) {
    var sess = req.session;
    // console.log(sess);
    if (sess != undefined && sess.email == 'admin')
        res.redirect('/admin');
    else
        res.redirect('/login.html');
});

app.post('/login', function (req, res) {
    var sess = req.session;
    if (sess.email == 'admin') res.redirect('/admin');
    sess.email = req.body.email;
    var passwd = req.body.pass;
    // console.log(sess.email, passwd);
    if (sess.email == 'admin' && passwd == 'admin')
        res.end('done');
    else {
        res.send('error');
        res.end('error');
    }
});

app.get('/start_page', (req, res) => {
    // console.log('Прогрузка каталога....');
    var client = new MongoClient(url, {
        useNewUrlParser: true
    });
    client.connect(function (err) {
        assert.equal(null, err);
        //console.log("Connected successfully to server");

        const db = client.db('myDB');
        db.collection('Store').find({}, {
            projection: {
                _id: 1,
                name: 1,
                price: 1,
                number: 1,
                img: 1
            }
        }).toArray(
            (err, result) => {
                if (err) throw err;
                // console.log(result);
                res.send(result);
                res.end();
            });

        client.close();
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
        Сумма заказа - ${str[6]}р<br>
        Ваш заказ находится в обработке, 
        ждите звонка оператора на номер телефона - <a href="tel:${str[4]}"><strong>${str[4]}</strong></a>.<br>
        <h5>Спасибо за заказ!</h5>`;

    // console.log(bodyText);
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
                console.log(error);
                return;
            }

            var myObj = {
                product: {
                    id: str[0],
                    quantity: str[2]
                },
                customer: {
                    name: str[3],
                    mobile: str[4],
                    email: str[5]
                },
                processed: false,
                final_price: str[6]
            }

            MongoClient.connect(url, {
                useNewUrlParser: true
            }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("myDB");
                dbo.collection("Orders").insertOne(myObj, function (err, res) {
                    if (err) throw err;
                    db.close();
                });
            });

            // console.log('Message sent: %s', info.messageId);
        });
    });

    res.send('success');
});

app.get('/get/*', (req, res) => {
    if (req.url.indexOf(get_url) == 0) {
        var responde = '';
        var id = req.url.substr(get_url.length, req.url.length);
        // console.log('--> ' + get_url + id);
        const client = new MongoClient(url, {
            useNewUrlParser: true
        });

        client.connect(function (err) {
            assert.equal(null, err);
            // console.log('Есть соединение');
            const db = client.db('myDB');
            db.collection('Store').find({}, {
                projection: {
                    _id: 1,
                    name: 1,
                    price: 1,
                    number: 1,
                    img: 1
                }
            }).toArray(
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

function getProducts() {
    return new Promise((resolve, reject) => {
        var client = new MongoClient(url, {
            useNewUrlParser: true
        });
        client.connect(function (err) {
            assert.equal(null, err);
            //console.log("Connected successfully to server");

            const db = client.db('myDB');
            db.collection('Store').find({}, {
                projection: {
                    _id: 1,
                    name: 1,
                    price: 1,
                    number: 1,
                    img: 1
                }
            }).toArray(
                (err, result) => {
                    if (err) {
                        reject(err);
                        throw err;
                    }
                    // console.log('getProducts() -> ', result);
                    resolve(result);
                    // return result;
                });
            client.close();
        });
    });
    // console.log('--->   ', answer);
}

// * --------------------------------------------------- * //

app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
});

const PORT = 80;

var httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Listening ${['PORT']} port`, PORT);
});