const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Load user data from CSV file
const usersFilePath = 'users.csv';
let users = [];

fs.createReadStream(usersFilePath)
  .pipe(csv())
  .on('data', (data) => users.push(data))
  .on('end', () => console.log('Users loaded:', users));

// Login page route
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});


// Registration page route
app.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});


// Handle login form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Successful login, redirect to home page
    res.redirect('/');
  } else {
    // Invalid credentials, render login page with error message
    res.render('login', { error: 'Invalid email or password' });
  }
});

// Handle registration form submission
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // Check if the user already exists
  if (users.find(u => u.email === email)) {
    res.render('register', { error: 'User already exists with this email' });
  } else {
    // Add the new user to the users array
    users.push({ name, email, password });
    // Append the new user to the CSV file
    fs.appendFile(usersFilePath, `${name},${email},${password}\n`, (err) => {
      if (err) throw err;
      console.log('User registered:', { name, email });
      // Redirect to login page with success message
      res.render('login', { success: 'Registration successful. Please log in.' });
    });
  }
});


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
    user: {
      name: 'User 1',
      email: 'user1@example.com',
      phone: '1234567890'
    }
  },
  {
    id: '2',
    title: 'Product 2',
    description: 'Description of Product 2',
    price: 29.99,
    image: 'uploads/productImage-1702220945886.jpeg',
    user: {
      name: 'User 2',
      email: 'user2@example.com',
      phone: '9876543210'
    }
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
  const { userName, userEmail, userPhone, productTitle, productDescription, productPrice } = req.body;
  const productImage = req.file ? 'uploads/' + req.file.filename : null;

  // Create a new product object with user and product information
  const newProduct = {
    id: (products.length + 1).toString(),
    title: productTitle,
    description: productDescription,
    price: parseFloat(productPrice),
    image: productImage,
    user: {
      name: userName,
      email: userEmail,
      phone: userPhone
    }
  };

  // Push the new product into the products array
  products.push(newProduct);

  // Redirect to the home page or display a confirmation message
  res.redirect('/');
})


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
