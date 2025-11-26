# Finance Tracker

## Description
Finance Tracker is a full-stack web application for tracking personal income and expenses.
Users can log in, add transactions, categorize them and monitor balance changes over time.
The app provides charts, filters and multi-currency support to help users visualize financial activity.


## Features
- Add and delete income and expenses
- Filter by categories, date and amount range
- Interactive chart for income, expenses and total balance
- Supports 5 currencies: CZK, USD, EUR, GBP, JPY
- User registration and login
- Responsive layout


## Tech Stack

### Frontend
- HTML, CSS, JavaScript
- Chart.js

### Backend
- Node.js, Express.js

### Auth
- JWT + bcrypt

### Database
- MongoDB, Mongoose

### Testing
- Vitest, Testing Library, jsdom


## Installation

1. Clone the repository
```bash
git clone https://github.com/Luan2118/finance-tracker-project.git
cd finance-tracker-project
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend folder and add:
```env
PORT=3000
DATABASE_URL=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
CORS_ORIGIN=http://localhost:5500
```

4. Start backend server
```bash
npm start
```

5. Start frontend
Open `frontend/login.html` in Live Server 


## Screenshots

### Registration
![Register page](./assets/register.png)

### Dashboard
![Dashboard](./assets/dashboard.png)

### Expense page
![Expense page](./assets/expenses.png)

### All Expenses filter page
![All Expenses filter page](./assets/filters.png)

## Testing

- Unit tests using Vitest
- DOM tests using @testing-library/dom with jsdom
- Integration tests for page flows

To run all tests:
```bash
npm test
```


