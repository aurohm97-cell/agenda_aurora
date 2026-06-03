# 🌿 Agenda Aurora

A Trello-inspired Kanban task manager built with Angular and Firebase.  
Live demo: [https://agenda-aurora-caf9b.web.app](https://agenda-aurora-caf9b.web.app)

---

## ✨ Features

- 📋 Kanban board with three columns: To Do, In Progress, Done
- 🔀 Drag and drop between columns (Angular CDK)
- ✏️ Create, edit, and delete tasks with title, description and priority
- 🔐 Authentication with Firebase Auth (register and login)
- ☁️ Real-time data stored in Firebase Firestore per user
- 📊 Task summary panel with donut chart
- 🎨 Animated gradient background that follows the cursor
- 📱 Responsive layout with topbar and sidebar

---

## 🛠️ Tech Stack

- **Angular 21** — Frontend framework
- **TypeScript** — Main language
- **Firebase Auth** — User authentication
- **Firebase Firestore** — Cloud database
- **Angular CDK** — Drag and drop
- **Font Awesome** — Icons
- **CSS3** — Custom animations and gradients

---

## 🚀 Try it out

**Option 1 — Use the demo account:**
| Field | Value |
|-------|-------|
| Email | demo@agendaaurora.com |
| Password | 123456 |

**Option 2 — Create your own account:**  
Register at the app and your tasks will be saved to your own account in the cloud.

---

## 📸 Screenshots

*(coming soon)*

---

## 🔒 Security

- Passwords managed by Firebase Auth — never stored in plain text
- Firestore security rules ensure each user can only access their own data
- Environment variables used for Firebase credentials

---

## 👩‍💻 Author

**Aurora H.M. (AHM)**  
Built as a portfolio project to demonstrate frontend development skills with Angular, TypeScript and Firebase.

---

## 📦 Local Development

```bash
# Install dependencies
npm install

# Start development server
ng serve

# Build for production
ng build
```