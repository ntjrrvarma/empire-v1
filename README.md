# 🔐 Empire V1 - Personal Password Vault

## 📖 Overview
Empire V1 is a secure, personal password management application designed to store and retrieve credentials efficiently. It serves as a foundational project to explore **CRUD operations**, **Database Management**, and **Frontend-Backend Integration**.

## 🚀 Tech Stack
* **Frontend:** Next.js 15 (React)
* **Backend:** Supabase (PostgreSQL)
* **Styling:** Tailwind CSS
* **Language:** TypeScript

## ✨ Key Features
* **Add Credentials:** Simple form to input website, username, and password.
* **View Vault:** Real-time fetching of stored passwords from the cloud database.
* **Search/Filter:** Instantly find credentials (Client-side filtering).
* **Delete/Update:** Manage lifecycle of credentials.
* **Security (Dev):** Uses `.env.local` to protect API keys during development.

## 📸 Screenshots
*(Add a screenshot of your main dashboard here - e.g., `![Dashboard](./screenshots/dashboard.png)`)*

## 💡 Lessons Learned
* **Supabase Integration:** Learned how to connect a React frontend to a Postgres database using the Supabase JS Client.
* **State Management:** Managed loading states and async data fetching in Next.js.
* **Security Basics:** Understood the importance of Environment Variables vs. Hardcoding keys.

## 🔮 Future Improvements
* Implement Encryption (AES) for password storage.
* Add User Authentication (merged into Project Heimdall).
