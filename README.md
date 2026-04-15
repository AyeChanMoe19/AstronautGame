# 🚀 Astronaut Game (Web-Based Interactive Game)

## 📌 Overview
Astronaut Game is an interactive web-based game where players navigate an astronaut through space, avoid obstacles, and collect stars to achieve high scores.

The game includes user authentication, real-time scoring, and a dynamic leaderboard system, providing an engaging and user-friendly gaming experience.

---

## 🛠️ Technologies Used
- HTML, CSS, JavaScript
- Web Storage API (LocalStorage)
- JSON (for structured data storage)

---

## 🎮 Features

### 🔐 User Authentication
- User registration and login system
- Validation for input fields (username, password, etc.)
- Prevents duplicate user registration
- Stores user data securely in LocalStorage

### 🕹️ Gameplay Mechanics
- **Jump:** Spacebar
- **Double Jump:** Press `D`
- **Crawl:** Press `C`
- **Flight Mode:** Press `F` after collecting 80 stars (3-second boost)

### ⭐ Scoring System
- Real-time score updates during gameplay
- Tracks:
  - Latest Score
  - Top Score
- Stores player performance using JSON in LocalStorage

### 🏆 Leaderboard & Scoreboard
- Displays:
  - Top 5 players (after game)
  - Top 10 players (scoreboard page)
- Includes:
  - Current user’s best and latest score (when logged in)
- Sorting based on:
  - Score (descending)
  - Time (ascending for tie-breaking)

### 📖 Game Manual
- Built-in instructions for gameplay
- Explains controls and advanced features (e.g., flight mode)

---

## 🖥️ User Interface

The system includes multiple pages:
- Register Page
- Login Page
- Home Page
- Game Screen
- Scoreboard Page
- Game Manual Page

👉 The interface is designed to be simple, responsive, and user-friendly.

---

## 🔄 System Functionality

### Authentication Flow
- User data stored in LocalStorage:
  - `users` (all user data)
  - `currentUser`
  - `loggedIn` status
- Session management ensures correct access across pages

### Data Handling
- All user data stored in JSON format
- Includes:
  - Username, email, password
  - Scores and gameplay stats

---

## ⚙️ Error Handling
- Redirects users if not logged in
- Input validation for registration/login
- Navigation updates based on login status
- Alerts users when trying to play without login

---

## 🚧 Challenges & Solutions

### LocalStorage Management
- Challenge: Managing multiple users’ data  
- Solution: Structured JSON storage for each user

### User Authentication
- Challenge: Handling sessions reliably  
- Solution: Used `currentUser` and `loggedIn` flags

### Leaderboard Sorting
- Challenge: Ranking players correctly  
- Solution: Sorted by score and timestamp

### Game Controls
- Challenge: Multiple actions conflicting  
- Solution: Implemented state-based control system

---

## 🎯 Key Learning Outcomes
- Built a complete **web application with authentication**
- Managed **client-side data storage using LocalStorage**
- Implemented **real-time game logic and scoring systems**
- Designed **user-friendly UI and navigation**
- Solved practical challenges in **state management and data consistency**

---

## 📌 Note
This project was developed as part of academic coursework.

---

## 👤 Author
Aye Chan Moe  
BSc Computer Science – Middlesex University
