# Finora – Personal Finance Tracker

Finora is a full-stack web application that helps users manage their income, expenses, and financial transactions through an interactive dashboard.

## Features

- **User Registration & Login** – Create an account and log in.
- **Transaction Management** – Add, view, update, and delete transactions.
- **Dashboard Analytics** – View total income, expenses, balance, and savings rate.
- **Visual Reports** – Analyze monthly cash flow and category-wise expenses using charts.
- **Search & Filters** – Search and filter transactions by type and month.
- **User-wise Transactions** – Retrieve transactions associated with a user.

## Tech Stack

**Frontend**
- React.js
- Axios
- React Router
- Recharts
- HTML and CSS

**Backend**
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- Spring Security configuration
- BCrypt password hashing

**Database**
- MySQL

**Tools**
- Git
- GitHub
- VS Code
- Postman

## Project Architecture

```text
Finora
├── Frontend (React.js)
│   ├── Login & Registration
│   ├── Dashboard
│   ├── Transaction Management
│   └── Analytics & Charts
│
├── Backend (Spring Boot)
│   ├── Authentication APIs
│   ├── Finance REST APIs
│   ├── Service Layer
│   └── Repository Layer
│
└── Database (MySQL)
    ├── User
    └── FinanceTracker
```

## REST API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in to an account |

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/finance/create` | Add a transaction |
| GET | `/finance/get/{id}` | Get a transaction by ID |
| GET | `/finance/getall/{userId}` | Get transactions for a user |
| PUT | `/finance/update/{id}` | Update a transaction |
| PATCH | `/finance/patch/{id}` | Partially update a transaction |
| DELETE | `/finance/delete/{id}` | Delete a transaction |

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Tirupathi-10/finora-personal-finance-tracker.git
cd finora-personal-finance-tracker
```

### 2. Configure MySQL

Create a MySQL database and update your Spring Boot `application.properties` file with your database URL, username, and password.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tiru1
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Replace `tiru1` and `YOUR_PASSWORD` with your actual database name and password.

### 3. Run the Backend

Open the Spring Boot project in your IDE, verify the database configuration, and run the main application class.

Backend URL: `http://localhost:9911`

### 4. Run the Frontend

Open a terminal in the React frontend directory and execute:

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

## Future Enhancements

- Secure authentication and authorization using JWT.
- Export financial reports to PDF or Excel.
- Budget planning and spending alerts.
- Advanced financial reports and insights.

## Author

**Tirupathi Rao**

GitHub: [Tirupathi-10](https://github.com/Tirupathi-10)

## License

This project is developed for learning and portfolio purposes.
