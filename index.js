const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3001;
const usersFilePath = 'users.csv';
let users = [];

fs.createReadStream(usersFilePath)
  .pipe(csv({ headers: ['name', 'email', 'password'] })) // Specify CSV headers
  .on('data', (data) => users.push(data))
  .on('end', () => console.log('Users loaded:', users));


// Load products data from JSON file
const productsFilePath = 'products.json';
let products = [];

// Load existing products from JSON file
fs.readFile(productsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading products file:', err);
  } else {
    products = JSON.parse(data);
    console.log('Products loaded:', products);
  }
});

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

app.get('/', (req, res) => {
  const latestProducts = products.slice(0, 3);
  res.render('index', { username: 'Guest', latestProducts });
});


// Get products
app.get('/products', (req, res) => {
  res.render('products', { products });
});


app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});


// List product route
app.get('/list-product', (req, res) => {
  res.render('list-product', { products });
});

// Add product route
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

  // Write the updated products array to the JSON file
  fs.writeFile(productsFilePath, JSON.stringify(products), (err) => {
    if (err) {
      console.error('Error writing products file:', err);
    } else {
      console.log('Products updated and saved.');
    }
  });

  // Redirect to the home page or display a confirmation message
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
