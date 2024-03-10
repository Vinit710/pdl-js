const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Sample products data
const products = [
  {
    id: '1',
    title: 'Product 1',
    description: 'Description of Product 1',
    price: 19.99,
    image: 'uploads/productImage-1702221578110.jpeg',
  },
  {
    id: '2',
    title: 'Product 2',
    description: 'Description of Product 2',
    price: 29.99,
    image: 'uploads/productImage-1702220945886.jpeg',
  },
  // Add more products as needed
];

app.get('/', (req, res) => {
  const latestProducts = products.slice(0, 3);
  res.render('index', { username: 'Guest', latestProducts });
});

app.get('/products', (req, res) => {
  res.render('products', { products: products });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/list-product', (req, res) => {
  res.render('list-product', { products: products });
});

app.post('/list-product', upload.single('productImage'), (req, res) => {
  const { productTitle, productDescription, productPrice } = req.body;
  const productImage = req.file ? 'uploads/' + req.file.filename : null;

  products.push({
    id: (products.length + 1).toString(),
    title: productTitle,
    description: productDescription,
    price: parseFloat(productPrice),
    image: productImage,
  });

  res.redirect('/');
});

app.get('/product/:productId', (req, res) => {
  const productId = req.params.productId;
  const product = products.find(p => p.id === productId);

  if (product) {
    res.render('product', { product });
  } else {
    res.status(404).send('Product not found');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
