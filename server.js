const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myDB';

const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/start_page',(req,res) => {
    console.log('New connection....');
    const client = new MongoClient(url, {useNewUrlParser: true});
    client.connect(function(err) {
        assert.equal(null, err);
        //console.log("Connected successfully to server");
      
        const db = client.db('myDB');
        db.collection('Store').find(
            {}, { projection: {_id: 1, name: 1, price: 1, number: 1, img: 1}}).toArray(
                (err, result) => {
          if (err) throw err;
          console.log(result);
          res.send(result);
          res.end();
        });
        
        client.close();
      });
});

app.get('/:id', function (req, res, next) {
    console.log('ID:', req.params.id);
    next();
  }, function (req, res, next) {
    res.send('User Info ' + req.params.id);
});  

app.post('/store',(req,res) => {
    res.send('POST require');
});

app.put('/store',(req,res) => {
    res.send('PUT require');
});

app.delete('/store',(req,res) => {
    res.send('DELETE require');
});

app.use((req, res, next) => {
    res.status(404).send('Sorry cant find that!');
});





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
})