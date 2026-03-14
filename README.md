# TrackMyCash - Personal Finance Tracker

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MySQL](https://img.shields.io/badge/MySQL-Database-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth-green)
![License](https://img.shields.io/badge/license-MIT-green)

A modern full-stack expense tracking application built with Next.js, MySQL, and TypeScript. TrackMyCash helps users manage personal finances by tracking income and expenses with interactive charts and real-time dashboard insights.

## 🚀 Live Demo

http://13.60.11.92/

## 📸 Screenshots  

<p align="center">
  <img src="public/screenshots/Screenshot (1126).png" alt="Home Page" width="48%">
  <img src="public/screenshots/Screenshot (1127).png" alt="Diary Entry Page" width="48%">
</p>

<p align="center">
  <img src="public/screenshots/Screenshot (1128).png" alt="Authentication Page" width="48%">
  <img src="public/screenshots/Screenshot (1129).png" alt="Dashboard Page" width="48%">
</p>
<p align="center">
  <img src="public/screenshots/Screenshot (1130).png" alt="Home Page" width="48%">
  <img src="public/screenshots/Screenshot (1131).png" alt="Diary Entry Page" width="48%">
</p>

## Features

- **User Authentication**
  - Secure email/password registration and login
  - Protected routes and session management
  - User-specific data isolation

- **Dashboard Overview**
  - Total balance, income, and expense summary
  - Recent transactions list
  - Financial overview with interactive charts
  - Last 60 days income and expense trends

- **Income Management**
  - Add, edit, and delete income entries
  - Categorize income sources
  - Visual representation of income distribution
  - Historical income tracking

- **Expense Tracking**
  - Track expenses by category
  - Edit and delete expense records
  - Expense analysis through charts
  - Category-wise expense breakdown

- **Responsive Design**
  - Mobile-first approach
  - Adaptive layout for all screen sizes
  - Smooth transitions and animations
  - Intuitive navigation

## Tech Stack

- **Frontend**
  - Next.js 15
  - React 19
  - TypeScript
  - TailwindCSS
  - Recharts for data visualization
  - FontAwesome icons

- **Backend**
  - Next.js API routes
  - NextAuth.js for authentication
  - RESTful API design

- **Development**
  - ESLint for code quality
  - Type safety with TypeScript
  - Modern ES modules

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MySQL database
- npm or yarn package manager

## 🗄️ Database Schema

```sql
CREATE DATABASE expense_tracker;
USE expense_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  provider VARCHAR(50) DEFAULT 'credentials',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('income','expense') NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
NEXTAUTH_SECRET=your_nextauth_secret
DB_HOST=*********
DB_USER=***********
DB_PASSWORD=**********
DB_NAME=**********
DB_PORT=****

```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trackmycash.git
cd trackmycash
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── (home)/           # Protected routes
│   ├── api/              # API routes
│   ├── lib/              # Utility functions
│   └── models/           # Database models
├── components/           # React components
├── controllers/          # Business logic
└── public/              # Static assets
    └── screenshots/     # Application screenshots
```

## API Routes

- `POST /api/register` - User registration
- `POST /api/auth/[...nextauth]` - Authentication endpoints
- `GET /api/dashboard` - Get dashboard data
- `POST /api/income` - Add new income
- `POST /api/expense` - Add new expense
- `PATCH /api/income` - Update income
- `PATCH /api/expense` - Update expense
- `DELETE /api/income` - Delete income
- `DELETE /api/expense` - Delete expense

## ⭐ Highlights

- Full-stack expense tracker built with **Next.js App Router**
- **Secure authentication with NextAuth**
- **MySQL relational database with optimized queries**
- **Interactive financial charts using Recharts**
- **Responsive UI built with TailwindCSS**
