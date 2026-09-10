This is a code prompt 

> # AI Coding Agent Prompt

You are a senior Full Stack Software Engineer and Software Architect.

Build a **production-ready trading education platform** using **ONLY** the technologies listed below.

---

# Tech Stack (STRICT)

Backend

* Node.js
* TypeScript
* Express.js

Frontend

* React
* Vite
* TypeScript

Database

* JSON files ONLY
* Node.js fs/promises
* No SQLite
* No MongoDB
* No PostgreSQL
* No MySQL
* No Prisma
* No ORM
* No LocalStorage as database
* No IndexedDB

Markdown

* markdown-it (or remark)
* gray-matter for frontmatter
* highlight.js or Prism.js for code blocks

Styling

* TailwindCSS
* Responsive
* Dark theme first

---

# IMPORTANT DATABASE REQUIREMENT

**Never use LocalStorage as the database.**

Everything must be stored inside JSON files.

When the server starts:

1. Check if `/database` exists.
2. If it does not exist, create it automatically.
3. Check if every required JSON file exists.
4. If missing, automatically generate them with default values.
5. Load all data from those JSON files.
6. Every Create/Update/Delete operation must immediately save to disk.

Example structure:

database/

users.json

posts.json

comments.json

ratings.json

settings.json

sessions.json

logs.json

No SQL.

No external database.

JSON files are the permanent storage.

---

# Project Purpose

Create a modern website for teaching trading to beginners.

The website is similar to a documentation website mixed with a WordPress blog.

Users read lessons written in Markdown.

Admins manage everything through an Admin Panel.

---

# Documentation System

Project contains:

/docs

Inside docs are folders.

Example

/docs
/beginner
lesson-1.md
lesson-2.md

```
/psychology
    emotions.md

/price-action
    support-resistance.md
```

Every markdown file is a lesson.

The frontend automatically reads and displays these markdown files.

---

# Markdown Features

Support:

* YAML Frontmatter

Example

---

title: Introduction
description: First lesson
author: Admin
category: Beginner
tags:

* forex
* beginner
  cover: cover.png
  published: true
  date: 2026-01-01

---

Markdown content...

Render

* headings
* tables
* images
* lists
* links
* blockquotes
* task lists
* syntax highlighting
* alerts
* horizontal rules

Generate table of contents automatically.

---

# Admin Panel

Admin Login

Dashboard

Statistics

Create lesson

Edit lesson

Delete lesson

Rename lesson

Move lesson

Upload image

Preview markdown

Publish / Draft

Search lessons

Filter

Categories

Tags

Manage comments

Approve comments

Delete comments

Manage ratings

Manage users

Website settings

Activity log

---

# Admin Editor

Create markdown files directly.

Editor should include:

Live Preview

Split View

Fullscreen

Toolbar

Insert image

Insert code block

Insert table

Insert alert

Insert link

Insert quote

Auto save

Word count

Reading time

Slug generator

---

# Frontend

Landing page

Hero

Latest lessons

Categories

Popular lessons

Recommended lessons

Footer

Navbar

Search

Sidebar

Documentation navigation

Previous/Next lesson

Breadcrumb

Related articles

Reading progress bar

Estimated reading time

Table of contents

Responsive mobile menu

---

# Search

Search by

Title

Category

Tags

Content

Description

Instant search.

---

# Comments

Every lesson supports comments.

Features

Reply

Nested comments

Edit own comment

Delete own comment

Like comment

Report comment

Admin moderation

Stored inside comments.json

---

# Rating System

Users rate lessons.

1–5 stars.

Average rating.

Rating count.

One rating per user per lesson.

Stored inside ratings.json.

---

# Authentication

Simple JSON authentication.

Password hashing using bcrypt.

JWT authentication.

Sessions stored in sessions.json.

Admin role.

User role.

Guest.

---

# User Features

Register

Login

Forgot password (token stored in JSON)

Profile

Avatar

Bookmarks

Recently viewed

Reading history

Progress tracking

Everything stored in JSON.

---

# Theme

Dark mode first.

Modern.

Inspired by:

WordPress

GitBook

Notion

Vercel

Tailwind UI

Clean animations.

Rounded cards.

Glassmorphism.

Blue accent.

Smooth transitions.

---

# Folder Structure

project/

backend/

frontend/

docs/

database/

uploads/

public/

shared/

---

# API

REST API

Examples

GET /api/posts

GET /api/post/:slug

POST /api/post

PUT /api/post/:id

DELETE /api/post/:id

GET /api/comments

POST /api/comment

POST /api/rating

GET /api/search

GET /api/categories

GET /api/tags

GET /api/settings

---

# Security

Helmet

Rate limiting

Input validation

Sanitize HTML

Prevent path traversal

Escape markdown output

JWT verification

Password hashing

Safe file writing

Atomic JSON writes

Automatic backups

---

# Performance

Lazy loading

React Suspense

Code splitting

Image lazy loading

Markdown caching

Search indexing

Pagination

Memoization

---

# Error Handling

Centralized error middleware.

Readable API errors.

404 page.

500 page.

Loading skeletons.

Empty states.

---

# Logging

Store logs inside

database/logs.json

Log:

Login

Logout

Lesson created

Lesson updated

Lesson deleted

Comment deleted

Rating submitted

Errors

---

# Auto Initialization

On first server startup:

Automatically create

database/

uploads/

required JSON files

with default values.

Example

users.json

[]

posts.json

[]

comments.json

[]

ratings.json

[]

settings.json

{
"siteName": "Trading Academy",
"darkMode": true
}

The application must work immediately after:

npm install

npm run dev

without requiring any manual database setup.

---

# Code Quality

Use strict TypeScript.

Modular architecture.

Reusable React components.

No duplicated code.

Clean architecture.

SOLID principles.

Typed API responses.

Consistent naming.

Proper error handling.

Production-ready code.

---

# Deliverables

Generate the complete project including:

* Backend
* Frontend
* REST API
* Admin Panel
* Markdown documentation engine
* JSON database layer
* Authentication
* Comment system
* Rating system
* Responsive UI
* Dark mode
* Automatic JSON database creation
* Automatic loading of markdown files from `/docs`
* Fully functional CRUD for lessons
* Complete folder structure
* Ready to run with:

```bash
npm install
npm run dev
```

Do **NOT** use any database other than JSON files.

Do **NOT** use LocalStorage as a database.

All persistent data must be stored in JSON files created automatically on server startup.
```
```
