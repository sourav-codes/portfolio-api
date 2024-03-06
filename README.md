# portfolio-api
Description
The Portfolio Tracking API is a RESTful API designed to manage a portfolio of stock trades. It allows users to add, update, delete, and view trades, as well as calculate basic return calculations such as holdings and cumulative returns. This project is built using Node.js, Express, and MongoDB, utilizing Mongoose ORM for database operations.

Usage
The API can be accessed via HTTP requests to the endpoints provided. Use tools like Postman or cURL to interact with the API.

API Endpoints
GET /: Retrieve the entire portfolio with trades.
GET /holdings: Get holdings in an aggregate view.
GET /returns: Get cumulative returns.
POST /addTrade: Add a new trade to the portfolio.
POST /updateTrade: Update an existing trade by its ID.
POST /removeTrade: Remove a trade from the portfolio.
