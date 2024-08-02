const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// MySQL connection
const db = mysql.createConnection({
    host: 'mysql-bryan.alwaysdata.net',
    user: 'bryan',
    password: 'glassgrassgreen22',
    database: 'bryan_store'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/product-marketplace', (req, res) => {
    let sql = 'SELECT * FROM products';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('product_marketplace', { products: results });
    });
});

app.get('/add-product', (req, res) => {
    res.render('add_product');
});

app.post('/add-product', (req, res) => {
    let product = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image_url: req.body.image_url
    };
    let sql = 'INSERT INTO products SET ?';
    let query = db.query(sql, product, (err, result) => {
        if (err) throw err;
        res.redirect('/product-marketplace');
    });
});

app.get('/edit-product/:id', (req, res) => {
    let sql = `SELECT * FROM products WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.render('edit_product', { product: result[0] });
    });
});

app.post('/edit-product/:id', (req, res) => {
    let updatedProduct = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        image_url: req.body.image_url
    };
    let sql = `UPDATE products SET ? WHERE id = ${req.params.id}`;
    let query = db.query(sql, updatedProduct, (err, result) => {
        if (err) throw err;
        res.redirect('/product-marketplace');
    });
});

app.get('/delete-product/:id', (req, res) => {
    let sql = `DELETE FROM products WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/product-marketplace');
    });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ${PORT}'));
