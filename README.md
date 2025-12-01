
# 📘 Game Management API – NestJS + MySQL + TypeORM

This project is a **NestJS-based REST API** featuring:
- User **Signup & Login**
- **JWT Authentication** (Access + Refresh Token)
- **Games Module** with CRUD operations
- **Filtering, Sorting & Searching**
- **CSV Data Import** for pre-populating database
- Protected routes using **JWT Guard**

---

# 🚀 Features

### 🔐 Authentication
- Signup (register new user)
- Login (generate access & refresh tokens)
- Protected routes using `JwtAuthGuard`
- Logout (invalidate refresh token)

### 🎮 Game Management
- Add new games
- Update game properties
- Delete a game
- Search game by title
- Filter by:
  - platform  
  - genre  
  - editors_choice  
- Sort by score (ASC/DESC)

### 🗄️ CSV Import
Import games from a CSV using a seeding script.

---

# 📦 Tech Stack

- **NestJS**
- **TypeScript**
- **MySQL**
- **TypeORM**
- **JWT Authentication**
- **Class Validator / Transformer**
- **CSV-parse** (for seeding)

---

# 🛠️ Installation Instructions

## 1️⃣ Clone the Repository
```bash

cd <project_folder>
```

## 2️⃣ Install Dependencies
```bash
npm install
```

---

# ⚙️ Environment Setup

Create a `.env` file in project root:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=games_db
DB_SYNCHRONIZE=true

JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_ACCESS_TOKEN_EXPIRATION=15m

JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_REFRESH_TOKEN_EXPIRATION=7d

PORT=3000
```

---

# 🗄️ Database Setup

### 1️⃣ Create MySQL Database
```sql
CREATE DATABASE games_db;
```

### 2️⃣ TypeORM Migration/Sync  
If `DB_SYNCHRONIZE=true`, tables generate automatically.

---

# ▶️ Running the Application

## Development mode
```bash
npm run start:dev
```

## Production mode
Build project:
```bash
npm run build
```

Run:
```bash
npm run start:prod
```

---

# 📘 API Endpoints

## 🔐 Authentication

| Method | Route | Description |
|--------|--------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive tokens |
| POST | `/auth/logout` | Logout user (requires token) |
| POST | `/auth/refresh` | Refresh tokens |
| GET | `/auth/me` | Get logged-in user info |

---

## 🎮 Games (Protected Routes)

| Method | Route | Description |
|--------|--------|-------------|
| POST | `/games` | Add new game |
| GET | `/games` | Get all games (supports filters & sorting) |
| GET | `/games/:id` | Get game by ID |
| GET | `/games/search/:title` | Search game by title |
| PATCH | `/games/:id` | Update game |
| DELETE | `/games/:id` | Delete game |

---

# 🔍 Filtering & Sorting

### Example:
```
GET /games?platform=PC&genre=RPG&editors_choice=Y&sort=desc
```

Filters:
- `platform=PC`
- `genre=RPG`
- `editors_choice=Y or N`
- `sort=asc or desc` (based on score)

---

# 📥 CSV Import (Optional)

### Place `games.csv` at project root:
```
project/
 ├── src/
 ├── games.csv   <-- here
 ├── package.json
 └── ...
```

### Run Seeding Script
```bash
npm run seed:games -- ./games.csv
```

or

```bash
ts-node -r tsconfig-paths/register src/scripts/seed-games.ts ./games.csv
```

---

# 🧪 Testing (Postman Recommended)

### Add Authorization header to all protected routes:
```
Authorization: Bearer <ACCESS_TOKEN>
```

---

# 📚 Project Structure

```
src/
 ├── auth/
 ├── games/
 ├── users/
 ├── config/
 ├── scripts/
 ├── main.ts
 └── app.module.ts

games.csv
package.json
README.md
.env
```

---

# 🔐 Security Practices Used

- Hashed passwords (bcrypt)
- Hashed refresh tokens
- Protected routes using JWT Guard
- DTO Validation
- Global ValidationPipe

---

# 🤝 Contributing
Pull requests are welcome.

---

# 📝 License
MIT
