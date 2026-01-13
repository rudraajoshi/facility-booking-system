# facility-booking-system
A comprehensive facility booking system using React 18+, React Router, Tailwind CSS, and Context API.

#Table of Contents

-[Project Overview](#project-overview)

-[Features](#features)  
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)   
- [Data Storage](#data-storage)  
- [Technologies Used](#technologies-used)
- [Setup & Installation](#setup--installation)
- [Future Enhancements](#future-enhancements)

# Project Overview
The **Facility Booking System** allows users to:
- View all available facilities and their details.  
- Book facilities based on availability.  
- Access facility details without requiring login.  
- Manage bookings (for logged-in users).  

# Features
- **User Authentication:** Users can sign up and log in to manage bookings.  
- **Facility Listing & Detail Pages:** Users can view all facilities or specific facility details.  
- **Booking Management:** Logged-in users can book, edit, or cancel reservations.  
- **Role-based Access:** Certain actions restricted to authenticated users.  
- **Responsive UI:** Works on desktop and mobile devices.

# Architecture
-This system uses a Component Based Architecture

# Directory Structure
facility-booking-system/
│
├── src/
│ ├── components/ # Reusable React components (buttons, cards, etc.)
│ ├── pages/ # Pages: Home, Listing, Detail, Login, Dashboard
│ ├── services/ # API service calls and helpers
│ ├── assets/ # Images, icons, and static resources
│ ├── App.jsx # Main App component with routes
│ └── index.jsx # Entry point
│
├── public/ # Static files like index.html, favicon
├── package.json # Project dependencies and scripts
└── README.md # Project documentation

# Data Storage
-Used localStorage and AuthContext for efficient data handling

# Technologies used
React 18+, React Router, Tailwind CSS, and Context API.

# Setup & Installation

1. **Clone the repository:**
   
git clone https://github.com/yourusername/facility-booking-system.git
cd facility-booking-system

2. Install dependencies:
npm install

3. Run the development server:
npm run dev

4. Navigate to the port shown by Vite

# Future enhancements
-Implement role-based admin panel for facility management.
-Add email notifications for bookings.
-Integrate payment gateway for paid facility bookings.
-Improve search and filter functionality.
-Migrate fully to a cloud-hosted database.



