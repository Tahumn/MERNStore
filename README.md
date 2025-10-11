# MERN Ecommerce Project - Phase 1

## Project Overview

This repository contains the **initial skeleton** of the MERN (MongoDB, Express, React, Node.js) Ecommerce project for the course project.  
Phase 1 focuses on **setting up the project structure**, backend and frontend skeletons, and preparing the foundation for feature development in subsequent phases.

---

## Phase 1 - Objectives

- Initialize Git repository and basic folder structure.
- Setup backend with **Node.js** and **Express**.
- Setup frontend with **React**.
- Add **.env.example**, **.gitignore**, and **README.md**.
- Prepare the project for further development in future phases.

---

## Phase 2 - User & Product 

**Objectives**

- Implement **User module**: register, login, JWT authentication, profile pages.  
- Implement **Product module**: CRUD APIs, product listing, product detail pages.  
- Connect backend APIs with frontend React components.  
- Create frontend pages for `/login`, `/register`, `/profile`, `/products`, `/products/:id`.

---

## Phase 3 - Docker Compose + Shopping Cart, Merchants & Brands

**Objectives**

- Setup **Docker Compose** for backend, frontend, and MongoDB.  
- Implement **Shopping Cart** module: add/remove products, update quantities, view cart.  
- Implement **Merchants & Brands** module: CRUD APIs and frontend pages.  
- Integrate all modules with frontend.

---

## Phase 4 - Testing & Documentation 

**Objectives**

- **Run end-to-end testing** of backend APIs and frontend functionality.
- **Fix bugs** and ensure smooth **integration** of all modules.
- **Finalize** README documentation and usage instructions.

# Installation & Running 
## Clone repository
git clone https://github.com/Tahumn/MERNStore
cd mern-ecommerce

## Backend
cd backend
npm install
npm run dev

## Frontend
cd ../frontend
npm install
npm start

## Docker Compose (Phase 3)
docker-compose up --build

## References 
https://github.com/mohamedsamara/mern-ecommerce