## Title Project

# Pawn Management App

## Description

The Pawnshop Application is a simple web application designed to manage customer information, types of goods, interest rates, and pawn contracts. The purpose of the application is to assist individuals, including administrators, managers, and transaction staff, in tracking and managing operations effectively and consistently.

## Setup

### Installation

1. Clone the repository

```
git clone <repository_url>
```

2. Navigate to the project directory:

```
cd <folder_name>
```

3. Install dependencies:

```
npm install
```

### Configuration

Create a .env file to setup enviroment variables

```
PORT=""
MONGODB_URI=""
JWT_SECRET_KEY=""

```

### Usage

```
npm run dev
```

## Role features

### Authentication

- [ ] As a user (Admin, Manager, Employee), I can sign in with username and password.

### Admin

- [ ] As a super admin, I can add/edit/soft delete other acounts.

### Pawn Contract

- [ ] As a manager and employee, I can see list of contracts.
- [ ] As a manager and employee, I can create a new contract.
- [ ] As a manager, I can edit any contract create by me and employee reportTo me.
- [ ] As a manager, I can delete any contract create by me and employee reportTo me.
- [ ] As a manager and employer, I can get payment for a contract with the selected date.

### Interest Rate

- [ ] As a manager, I can create a new interest rate by product type.
- [ ] As a manager, I can edit interest rate.
- [ ] As a manager, I can delete interest rate.
- [ ] As a manager, I can see list of interest rates.

### Product type

- [ ] As a manager, I can create a new product type.
- [ ] As a manager, I can edit product type.
- [ ] As a manager, I can delete product type.
- [ ] As a manager, I can see list of product type.

### Customer

- [ ] As a manager, I can see list of customers.
- [ ] As a manager, I can create a new customer.
- [ ] As a manager, I can edit any customer.
- [ ] As a manager, I can delete any customer.
- [ ] As a customer,do not need to log in, I can get payment info for my contract with Phone-number and Contract-number.

## Endpoint APIs

### Auth APIs

```javascript
/**
 * @route POST /auth/login
 * @description Log in with username and password
 * @body {username,password}
 * @access Public
 */
```

### User APIs

```javascript
/**
 * @route GET /users/me
 * @description Get current account info
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /users/me
 * @description Update user profile
 * @body {username, password, description}
 * @access Login required
 */
```

```javascript
/**
 * @route GET /users
 * @description Get all users
 * @access Login required, role: super admin
 */
```

```javascript
/**
 * @route POST /users
 * @description Create a new user
 * @body {username, password, description}
 * @access Login required, role: super admin
 */
```

```javascript
/**
 * @route PUT /users/:id
 * @description Update user profile
 * @body {username, password, description}
 * @access Login required, role: super admin
 */
```

```javascript
/**
 * @route DELETE /users/:id
 * @description Delete a user
 * @access Login required, role: super admin
 */
```

### Customer APIs

```javascript
/**
 * @route GET /customers
 * @description Get all customers
 * @access Login required
 */
```

```javascript
/**
 * @route POST /customer
 * @description Create a new customer
 * @body {username, password, description}
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /customer/:id
 * @description Update customer profile
 * @body {username, password, description}
 * @access Login required, role: super admin
 */
```

```javascript
/**
 * @route DELETE /customer/:id
 * @description Delete a customer
 * @access Login required, role: super admin
 */
```

### Product Type APIs

```javascript
/**
 * @route GET /ptype?page=1&limit=10
 * @description Get all product types with pagination
 * @access Login required, role: super user
 */
```

```javascript
/**
 * @route POST /ptype
 * @description Create a new product type
 * @body {name, description }
 * @access Login required, role: super user
 */
```

```javascript
/**
 * @route PUT /ptype/:id
 * @description Update a product type
 * @body {name, description }
 * @access Login required, role: super user
 */
```

```javascript
/**
 * @route DELETE /ptype/:id
 * @description Delete a product type
 * @access Login required, role: super user
 */
```

### Interest Rate APIs

```javascript
/**
 * @route GET /interest?page=1&limit=10
 * @description Get all interest rate with pagination
 * @access Login required, role: super user
 */
```

```javascript
/**
 * @route POST /interest
 * @description Create a new interest rate
 * @body {product type, date min, date max, interest rate }
 * @access Login required, role: super user
 */
```

```javascript
/**
 * @route PUT /interest/:id
 * @description Update a interest rate
 * @body { product type, date min, date max, interest rate  }
 * @access Login required, role: super user
 */
```

```javascript
/**
 * @route DELETE /interest/:id
 * @description Delete a interest rate
 * @access Login required, role: super user
 */
```

### Contract APIs

```javascript
/**
 * @route GET /contracts?page=1&limit=10
 * @description Get all contracts with pagination
 * @access Login required
 */
```

```javascript
/**
 * @route POST /contracts
 * @description Create a new contract
 * @body {Cnumber, full name, phone, product, description, value, create-date }
 * @access Login required
 */
```

```javascript
/**
 * @route PUT /contracts/:id
 * @description Update a contract
 * @body { full name, phone, product, description, value  }
 * @access Login required, role: super user
 */
```

```javascript
/**
 * @route GET /contracts/:id
 * @description Get detail a contract
 * @access Login required
 */
```

```javascript
/**
 * @route DELETE /contracts/:id
 * @description Delete a contract
 * @access Login required, role: super user
 */
```

```javascript
/**
 * @route GET /contracts?phone=0919778899&Cnumber=00001
 * @description Get a single contract with query
 
 */
```

### Payment APIs

```javascript
/**
 * @route PUT /payments
 * @description Get Payment info
 * @access Login required, Role: Manager & Employee
 */
```

```javascript
/**
 * @route POST /payments/bill/:id
 * @description Create bill for contract
 * @access Login required, Role: Manager & Employee
 */
```

```javascript
/**
 * @route GET/payments/bills/:id
 * @description Get all bills for contract
 * @access Login required, Role: Manager & Employee
 */
```

```javascript
/**
 * @route DELETE/payments/bill/:id
 * @description Delete Bill for single contract
 * @access Login required, Role: Manager & Employee
 */
```

## ERD

<img width="766" alt="Screenshot 2023-11-28 at 21 46 48 2" src="https://github.com/nhuttuan239/Final-Pawn-BE/blob/3877d06a6df1d7e53a4e2f1f5e8a2ed1af5931c8/Entity%20relationship%20Diagram.drawio.png">

## Third-party Libraries

- Express

- Express validator

- MongoDB
