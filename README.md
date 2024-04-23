# Product listing website with node.js

## About

This project implements a web application that combines a registration and login system with a product management feature. It utilizes barcode scanning for user authentication and provides a user-friendly interface for managing products.

## Features

- **Registration and Login**: Users can register and log in using their email and password. Registration data is stored in a CSV file.
- **Product Management**: Users can add, view, and manage products through the web interface. Product data is stored in a JSON file.
- **File Upload**: Supports file upload for product images.
- **Responsive Design**: The web interface is designed to be responsive and accessible on different devices.

## Technologies Used

- **Express.js**: Web framework for Node.js used to handle routing and server logic.
- **EJS**: Templating engine for generating dynamic HTML content.
- **Multer**: Middleware for handling file uploads.
- **CSV Parser**: Library for parsing CSV files.
- **File System (fs)**: Node.js module for interacting with the file system.

## Installation and Setup

1. **Clone the Repository**: Clone this repository to your local machine.
2. **Install Dependencies**: Install node.js form website

3. **Setup the Application**: Navigate to the project directory in your terminal and run:
Install the following libaries using npm:
    ```bash
    npm install express
    npm install body-parser
    npm install multer
    npm install csv-parser
    ```


4. **Run the Application**: Start the server by running:
    ```bash
    node index.js
    ``` 


5. **Access the Application**: Open a web browser and go to [http://localhost:3001](http://localhost:3001) to access the application.

## Usage

1. **Registration**: Access the registration page at [http://localhost:3001/register](http://localhost:3001/register) and fill in the required details to register a new user.
2. **Login**: After registration, log in using the credentials at [http://localhost:3001/login](http://localhost:3001/login).
3. **Product Management**: Navigate to [http://localhost:3001/products](http://localhost:3001/products) to view and manage products. Use the "Add Product" button to add new products.

## Future Enhancements

- **User Authentication**: Implement more secure authentication methods such as JWT.
- **Database Integration**: Store user and product data in a database for better scalability and data management.
- **Improved UI**: Enhance the user interface with modern design patterns and interactive elements.
- **Error Handling**: Implement robust error handling to improve reliability and user experience.

I hope this README provides a clear overview of the project! Feel free to explore and extend the functionality as needed.


   
