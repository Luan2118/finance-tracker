# Finance Tracker

## Description
Finance Tracker is a full-stack web application for tracking personal income and expenses.
Users can log in, add transactions, categorize them and monitor balance changes over time.
The app provides charts, filters and multi-currency support to help users visualize financial activity.

## Live Demo

**Live URL:**
https://finance-tracker-project-sigma.vercel.app/

### Demo Account

Email: demo@example.com
Password: Demo1234

You can use this account to test the app without creating a new account.

> Note: The backend is hosted on Render free tier, so the first request may take 15–30 seconds because of cold start.


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

### Backend

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
DATABASE_URL=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=youraccesstokensecret
REFRESH_TOKEN_SECRET=yourrefreshtokensecret
```

4. Start backend server
```bash
npm start
```
### Frontend

5. Start frontend
Open `frontend/index.html` using a local server (e.g., VSCode Live Server)


## Screenshots

### Registration
![Register page](./assets/register.png)

### Dashboard
![Dashboard](./assets/dashboard.png)

### Expense page
![Expense page](./assets/expenses.png)

### All Expenses page
![Filter page](./assets/filters.png)

## Testing

- Unit tests using Vitest
- DOM tests using @testing-library/dom with jsdom
- Integration tests for page flows

To run all tests:
```bash
npm test
```


## Deployment

### Frontend (Vercel)
- Hosted as a static site on Vercel
- Entry point: `index.html` (login page)

---

### Backend (Render)
- Node.js + Express API deployed on Render.
- MongoDB Atlas used as a database
- JWT auth with access tokens and HttpOnly refresh cookies.
- CORS configured to allow the Vercel domain and send credentials.
- Render free-tier may cause a 15–30 second cold start delay on the first request.


**API Base URL:**  
https://finance-tracker-project-l7rf.onrender.com/
