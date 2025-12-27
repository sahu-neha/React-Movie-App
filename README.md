# 🎬 Movie Search App

A modern movie search application built with **React** that integrates the **TMDB API** for movie data and **Appwrite** for tracking and analyzing the most searched movies.

This project demonstrates real-world frontend + backend integration, analytics tracking, and clean asynchronous data handling.

---

## 🚀 Features

- 🔍 Search movies using TMDB API  
- 📈 Track search analytics using Appwrite Database  
- ⭐ Maintain a list of most searched movies  
- ⚡ Fast and responsive UI  
- ☁️ Cloud backend powered by Appwrite  
- 🧠 Proper data validation and normalization  

---

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript (ES6+)
- Vite
- CSS

### Backend / Services
- Appwrite (Database)
- TMDB API
- Vercel (Deployment)

---

## 🧩 How It Works

1. User searches for a movie  
2. Movie data is fetched from TMDB  
3. Search analytics are stored in Appwrite  
   - If the search term exists → increment count  
   - If it does not exist → create a new record  
4. Data can be used to show top searched movies  

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_MOVIES_TABLE_ID=your_table_id

---

## 🧠 Appwrite Database Schema

**Table (example: `movies_metrics`)**

| Column Name | Type | Description |
|------------|------|-------------|
| searchTerm | string | Movie search keyword |
| count | integer | Number of searches |
| movie_id | integer | TMDB movie ID |
| poster_url | url | Full TMDB poster URL |

> Note: `poster_url` must be a valid absolute URL.

---
