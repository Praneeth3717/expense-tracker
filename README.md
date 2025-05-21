# TrackMyCash - Personal Finance Tracker

A modern, full-stack expense tracking application built with Next.js, MongoDB, and TypeScript. TrackMyCash helps you manage your personal finances by tracking income and expenses with intuitive visualizations and real-time updates.

![TrackMyCash Dashboard](/public/expenses.webp)

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
  - MongoDB with Mongoose
  - NextAuth.js for authentication
  - RESTful API design

- **Development**
  - ESLint for code quality
  - Type safety with TypeScript
  - Modern ES modules

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB database
- npm or yarn package manager

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
NEXTAUTH_SECRET=your_nextauth_secret
MONGO_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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
```

## API Routes

- `POST /api/register` - User registration
- `POST /api/auth/[...nextauth]` - Authentication endpoints
- `GET /api/transactions` - Get dashboard data
- `POST /api/income` - Add new income
- `POST /api/expense` - Add new expense
- `PATCH /api/income` - Update income
- `PATCH /api/expense` - Update expense
- `DELETE /api/income` - Delete income
- `DELETE /api/expense` - Delete expense

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Recharts for beautiful charts
- TailwindCSS for the utility-first CSS framework
- MongoDB team for the robust database
- FontAwesome for the icons