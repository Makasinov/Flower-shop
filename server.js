const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

const express = require('express');
const app = express();

const buy_url = '/buy?';
const get_url = '/get/';


app.use(express.static(__dirname));

app.get('/buy*', (req, res) => {
        var str = req.url.substr(buy_url.length, req.url.length);
        str = str.split('&');
        for (var i = 0; i < str.length; i++)
            str[i] = str[i].substr(str[i].indexOf('=') + 1, str[i].length);
        console.log(str);
        res.send(str);
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