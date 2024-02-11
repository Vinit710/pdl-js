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
    title: 'Product 1',
    description: 'Description of Product 1',
    price: 19.99,
    image: 'product1.jpg',
  },
  {
    title: 'Product 2',
    description: 'Description of Product 2',
    price: 29.99,
    image: 'product2.jpg',
  },
  // Add more products as needed
];

app.get('/', (req, res) => {
  // Assuming products is an array containing all your products
  const latestProducts = products.slice(0, 3); // Get the latest 3 products

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
  console.log(products); // Add this line
  res.render('list-product');
});

app.post('/list-product', upload.single('productImage'), (req, res) => {
  const { productTitle, productDescription, productPrice } = req.body;
  const productImage = req.file ? req.file.filename : null;

  // Save product data to a database or in-memory storage
  // For simplicity, let's log the data for now
  products.push({
    title: productTitle,
    description: productDescription,
    price: parseFloat(productPrice), // Assuming price is a number
    image: productImage,
  });

  // Redirect to the home page or display a confirmation message
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
