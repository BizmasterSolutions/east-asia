# East Asian International School — Project Development Plan

**Client:** East Asian International School  
**Agency:** BizMaster Solutions  
**Date:** 10 April 2026  
**Stack:** Next.js · Node.js / Express · Neon DB · JWT · Hostinger VPS

---

## Table of Contents

1. [Project Structure Overview](#1-project-structure-overview)
2. [Phase 1 — Planning & Wireframes](#2-phase-1--planning--wireframes)
3. [Phase 2 — UI/UX Design](#3-phase-2--uiux-design)
4. [Phase 3 — Public Website (6 Pages)](#4-phase-3--public-website-6-pages)
5. [Phase 4 — Admin Panel + Student Portal](#5-phase-4--admin-panel--student-portal)
6. [Phase 5 — Parent Portal + Academic Statistics](#6-phase-5--parent-portal--academic-statistics)
7. [Phase 6 — Testing & Launch](#7-phase-6--testing--launch)
8. [Database Schema](#8-database-schema)
9. [API Endpoints Reference](#9-api-endpoints-reference)
10. [Deployment Checklist](#10-deployment-checklist)

---

## 1. Project Structure Overview

```
east-asia/
├── app/                          # Next.js App Router (public pages)
│   ├── layout.js                 # Root layout (fonts, global CSS)
│   ├── page.js                   # Home Page
│   ├── about/page.js             # About Us Page
│   ├── gallery/page.js           # School Life / Gallery Page
│   ├── programmes/page.js        # Programmes Page
│   ├── contact/page.js           # Contact Us Page
│   ├── student-portal/
│   │   ├── login/page.js         # Student Login
│   │   └── dashboard/page.js     # Student Dashboard
│   ├── parent-portal/
│   │   ├── login/page.js         # Parent Login
│   │   └── dashboard/page.js     # Parent Dashboard
│   └── admin/
│       ├── login/page.js         # Admin Login
│       ├── dashboard/page.js     # Admin Overview
│       ├── home-content/page.js  # Manage Home Page content
│       ├── gallery/page.js       # Manage Gallery
│       ├── programmes/page.js    # Manage Programmes
│       ├── students/page.js      # Student Accounts & Files
│       ├── parents/page.js       # Parent Accounts
│       ├── academics/page.js     # Marks & Report Cards
│       ├── inquiries/page.js     # Contact Form Submissions
│       └── careers/page.js       # Job Applications
│
├── backend/                      # Express.js API Server
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── home.js
│   │   ├── gallery.js
│   │   ├── programmes.js
│   │   ├── students.js
│   │   ├── parents.js
│   │   ├── academics.js
│   │   ├── inquiries.js
│   │   └── careers.js
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Admin / Student / Parent role check
│   ├── controllers/
│   └── db/
│       └── neon.js               # Neon DB connection
│
├── component/                    # Shared UI components
├── context/                      # React context (auth state)
├── public/
│   ├── css/
│   ├── images/
│   └── uploads/                  # Uploaded files (report cards, papers)
└── PROJECT_PLAN.md
```

---

## 2. Phase 1 — Planning & Wireframes

**Duration:** 1 Week  
**Goal:** Lock scope, sitemap, and page wireframes before any code is written.

### Steps

- [ ] **1.1** Finalise sitemap — confirm all 6 public pages + 3 portals
- [ ] **1.2** List every component per page (navbar, footer, cards, forms, charts)
- [ ] **1.3** Define user roles: `admin` · `student` · `parent`
- [ ] **1.4** Map protected routes per role (JWT-gated pages)
- [ ] **1.5** Draft wireframes for each page (low-fidelity sketches or Figma frames)
- [ ] **1.6** Define database tables and relationships (see [Section 8](#8-database-schema))
- [ ] **1.7** Define all API endpoint contracts (see [Section 9](#9-api-endpoints-reference))
- [ ] **1.8** Client sign-off on wireframes and scope

### Deliverable
> Approved wireframe document + finalized feature list

---

## 3. Phase 2 — UI/UX Design

**Duration:** 1 Week  
**Goal:** Build the full visual design system and high-fidelity mockups.

### Steps

- [ ] **2.1** Set up design tokens (colors, typography, spacing)

| Token | Value |
|---|---|
| Primary Gold | `#F0D264` |
| Dark Gold | `#CCAA00` |
| Navy Blue | `#003B69` |
| Deep Navy | `#001D3D` |
| Near Black | `#000814` |
| Heading Font | Montserrat |
| Body Font | Rubik |

- [ ] **2.2** Design Navbar + Footer (shared across all pages)
- [ ] **2.3** Design Home Page (slideshow, stats bar, news, events, stories)
- [ ] **2.4** Design About Us Page
- [ ] **2.5** Design Gallery Page (filter tabs, grid, lightbox)
- [ ] **2.6** Design Programmes Page (programme cards)
- [ ] **2.7** Design Contact Us Page (form, map, careers section)
- [ ] **2.8** Design Student Portal (login + dashboard)
- [ ] **2.9** Design Parent Portal (login + dashboard + charts)
- [ ] **2.10** Design Admin Panel (sidebar layout + all management views)
- [ ] **2.11** Ensure mobile responsiveness on all designs
- [ ] **2.12** Client sign-off on all mockups

### Deliverable
> High-fidelity Figma mockups (desktop + mobile) approved by client

---

## 4. Phase 3 — Public Website (6 Pages)

**Duration:** 2 Weeks

### 4.1 Project Setup

- [ ] Initialise Next.js project (App Router)
- [ ] Install dependencies: `bootstrap`, `slick-carousel`, `react-toastify`, `axios`, `react-chartjs-2`, `chart.js`, `react-lightbox`
- [ ] Configure global CSS with color palette variables
- [ ] Build shared `Navbar` component with school logo and navigation links
- [ ] Build shared `Footer` component with social media links + WhatsApp float button

---

### 4.2 Home Page (`/`)

**Layout:** Slideshow → Stats Bar → News → Welcome → Events → Stories → Admission → Social

- [ ] **Slideshow Banner** — full-width image slider (slick-carousel), images + captions pulled from Admin
- [ ] **Stats Bar** — animated counters: Total Students · Years of Excellence · Programmes Offered
- [ ] **News & Announcements Banner** — horizontal scrolling ticker or card list, latest 5 notices
- [ ] **Welcome Note** — Principal/Founder message with photo (editable via Admin)
- [ ] **Upcoming Events Section** — next 3–5 events with date, title, short description
- [ ] **Success Stories Cards** — student achievement cards (image, name, description)
- [ ] **Admission Button** — CTA button linking to Contact page
- [ ] **Social Media Icons** — Facebook, WhatsApp, Instagram links
- [ ] **WhatsApp Float Button** — fixed bottom-right floating button

---

### 4.3 About Us Page (`/about`)

**Layout:** Logo/Motto → Founder Message → Vision & Mission → Staff Cards → Awards → Testimonials

- [ ] **Logo + Motto section** — school logo, tagline, motto displayed prominently
- [ ] **Founder's Message** — text + photo, editable via Admin
- [ ] **Vision & Mission** — two-column card layout
- [ ] **School History** — timeline or text block
- [ ] **Meet the Team** — staff cards (photo, name, role)
- [ ] **Awards & Accreditations** — icon/badge grid
- [ ] **Parent Testimonials** — quote cards or slider

---

### 4.4 School Life / Gallery Page (`/gallery`)

**Layout:** Category Filter Tabs → Photo Grid → Lightbox → Video Section

- [ ] **Category Filter Tabs** — Events · Sports · Academic · Arts · Competitions · Classroom
- [ ] **Photo Grid** — masonry or uniform grid, filtered by category
- [ ] **Lightbox View** — full-size preview on photo click (react-lightbox or similar)
- [ ] **Video Section** — embedded YouTube videos or uploaded MP4s

---

### 4.5 Programmes Page (`/programmes`)

**Layout:** Programme Cards (Image / Name / Age Group / Schedule / Fee / Inquire Button)

- [ ] **Programme Cards** — one card per programme
  - Programme image
  - Programme name and short description
  - Age group / grade level badge
  - Schedule / timings
  - Fee structure table
  - "Inquire Now" button (links to Contact page or opens modal)

---

### 4.6 Contact Us Page (`/contact`)

**Layout:** Contact Info + Map → Inquiry Form → WhatsApp → FAQ → Social → Careers

- [ ] **Contact Info Block** — address, phone, email displayed clearly
- [ ] **Google Map Embed** — interactive map of school location
- [ ] **Inquiry Form** — Name, Phone, Email, Message fields; submits to backend
- [ ] **WhatsApp Direct Button** — `wa.me/` link
- [ ] **FAQ Accordion** — expandable common questions
- [ ] **Social Media Links** — Facebook, Instagram, WhatsApp
- [ ] **Careers Section** — list open vacancies + "Apply Now" form (name, CV upload)

---

## 5. Phase 4 — Admin Panel + Student Portal

**Duration:** 2 Weeks

### 5.1 Backend Setup

- [ ] Initialise Express.js server (`backend/server.js`)
- [ ] Connect to Neon PostgreSQL database (`backend/db/neon.js`)
- [ ] Create all database tables (see [Section 8](#8-database-schema))
- [ ] Implement JWT authentication middleware
- [ ] Implement role-based access middleware (`admin` · `student` · `parent`)
- [ ] Set up file upload handling (multer) for images, PDFs, papers

---

### 5.2 Admin Panel (`/admin`)

> **Access:** Admin login only. JWT token stored in httpOnly cookie.

#### Admin Login
- [ ] Login form → POST `/api/auth/admin/login` → returns JWT
- [ ] Redirect to `/admin/dashboard` on success

#### Admin Dashboard (`/admin/dashboard`)
- [ ] Overview cards: Total Students · Total Parents · Pending Inquiries · Open Vacancies
- [ ] Quick links to each management section

#### Home Page Management (`/admin/home-content`)
- [ ] Add / edit / delete **slideshow images** (upload + caption)
- [ ] Edit **Principal's Welcome Note** (rich text editor)
- [ ] Add / edit / delete **Success Stories** (title, image, description)
- [ ] Post / edit / delete **News & Announcements**
- [ ] Add / edit / delete **Upcoming Events** (title, date, description)
- [ ] Update **social media links**
- [ ] Update **school stats** (student count, years, programmes)

#### Gallery Management (`/admin/gallery`)
- [ ] Upload new photos (select category on upload)
- [ ] Delete existing photos
- [ ] Add / remove YouTube video links
- [ ] Organise photos into folders/categories

#### Programmes Management (`/admin/programmes`)
- [ ] Add new programme (image, name, description, age group, schedule, fee)
- [ ] Edit existing programme
- [ ] Delete programme

#### About Us Management (`/admin/about`)
- [ ] Edit Founder's message and photo
- [ ] Edit Vision & Mission text
- [ ] Add / edit / delete staff profiles
- [ ] Add / edit / delete awards

#### Student Accounts & Files (`/admin/students`)
- [ ] Create student account (username + password + grade)
- [ ] Reset student password
- [ ] Delete student account
- [ ] Upload downloadable files per grade and category:
  - School Term Papers
  - Mock Exam Papers
  - Past Papers
  - Revision Papers
  - Class Timetables
- [ ] Delete / replace uploaded files

#### Parent Accounts (`/admin/parents`)
- [ ] Create parent account (username + password)
- [ ] Link parent account to one or more student accounts
- [ ] Reset parent password
- [ ] Delete parent account

#### Academic Records (`/admin/academics`)
- [ ] Add / edit student marks (student → subject → term → mark)
- [ ] Upload report card PDF linked to a specific student + term
- [ ] Set exam schedule (grade → exam name → date)
- [ ] Create school-wide announcements (visible to parents after login)

#### Inquiries Management (`/admin/inquiries`)
- [ ] View all Contact Us form submissions (name, phone, email, message, date)
- [ ] Filter by date or type
- [ ] Mark inquiry as resolved / pending

#### Careers / Job Applications (`/admin/careers`)
- [ ] View all submitted job applications (name, email, CV file)
- [ ] Download CV files
- [ ] Mark application as reviewed

---

### 5.3 Student Portal (`/student-portal`)

#### Student Login (`/student-portal/login`)
- [ ] Login form → POST `/api/auth/student/login` → returns JWT
- [ ] Redirect to student dashboard on success

#### Student Dashboard (`/student-portal/dashboard`)
- [ ] **Download Centre** — files organised by grade and category
  - School Term Papers · Mock Papers · Past Papers · Revision Papers · Timetables
  - Each file shown as a download card with file name and download button
- [ ] **Exam Schedule** — upcoming exams for the student's grade
- [ ] **Notices Board** — school announcements visible after login

---

## 6. Phase 5 — Parent Portal + Academic Statistics

**Duration:** 2 Weeks

### 6.1 Parent Portal (`/parent-portal`)

#### Parent Login (`/parent-portal/login`)
- [ ] Login form → POST `/api/auth/parent/login` → returns JWT
- [ ] Redirect to parent dashboard on success

#### Parent Dashboard (`/parent-portal/dashboard`)

##### A. Child Selector
- [ ] If parent has more than one child — show dropdown to switch between children

##### B. Academic Details
- [ ] Subject-wise marks table: Subject | Marks | Grade | Teacher Remarks — per term
- [ ] Download Report Card as PDF button (per term)
- [ ] Assignment scores (optional)

##### C. Academic Statistics & Charts
- [ ] **Bar/Line Chart** — marks per subject, compared across terms (`react-chartjs-2`)
- [ ] **Overall Average** — progress indicator / percentage display
- [ ] **Subject Summary Cards** — strongest subject, weakest subject
- [ ] **Grade Trend Indicator** — Improving 📈 · Stable ➡ · Needs Attention 📉

##### D. Attendance Chart
- [ ] Monthly attendance percentage bar chart
- [ ] Total present / absent / late counts displayed

##### E. Notifications & Announcements
- [ ] School-wide announcements posted by admin
- [ ] Upcoming exam schedule for the child's grade

---

## 7. Phase 6 — Testing & Launch

**Duration:** 1 Week

### 7.1 Functional Testing

- [ ] Test all public pages (links, forms, gallery, lightbox)
- [ ] Test Admin Panel — all CRUD operations for every section
- [ ] Test Student Portal — login, file downloads, exam schedule
- [ ] Test Parent Portal — marks display, charts, PDF download, announcements
- [ ] Test all form submissions (Contact, Careers)
- [ ] Test JWT expiry and session handling
- [ ] Test role-based access — ensure students cannot access parent routes and vice versa

### 7.2 Responsive Testing

- [ ] Desktop (1920px, 1440px, 1280px)
- [ ] Tablet (1024px, 768px)
- [ ] Mobile (480px, 375px, 320px)
- [ ] Test on Chrome, Firefox, Safari, Edge

### 7.3 Performance & SEO

- [ ] Add meta titles and descriptions per page
- [ ] Optimise all images (Next.js `<Image>` component)
- [ ] Check Lighthouse score (target: 85+ Performance, 90+ SEO)
- [ ] Add Open Graph tags for social media sharing

### 7.4 Deployment

- [ ] Set up Hostinger VPS (Node.js + PM2)
- [ ] Configure domain and SSL (HTTPS)
- [ ] Deploy Next.js frontend (`next build` + `next start` or static export)
- [ ] Deploy Express.js backend with PM2
- [ ] Set production environment variables (DB URL, JWT secret, etc.)
- [ ] Configure Nginx as reverse proxy
- [ ] Run final smoke tests on production URL

### 7.5 Client Handover

- [ ] Deliver Admin Panel training session (screen recording + walkthrough)
- [ ] Provide Admin credentials and access guide
- [ ] Provide basic maintenance documentation
- [ ] Handover all source code and deployment credentials

---

## 8. Database Schema

### `admins`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| username | VARCHAR | Unique |
| password_hash | TEXT | bcrypt |
| created_at | TIMESTAMP | |

### `students`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| username | VARCHAR | Unique |
| password_hash | TEXT | bcrypt |
| full_name | VARCHAR | |
| grade | VARCHAR | e.g. "Grade 5" |
| created_at | TIMESTAMP | |

### `parents`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| username | VARCHAR | Unique |
| password_hash | TEXT | bcrypt |
| full_name | VARCHAR | |
| created_at | TIMESTAMP | |

### `parent_children`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| parent_id | INT FK → parents.id | |
| student_id | INT FK → students.id | |

### `subjects`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| name | VARCHAR | e.g. "Mathematics" |

### `marks`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| student_id | INT FK → students.id | |
| subject_id | INT FK → subjects.id | |
| term | VARCHAR | e.g. "Term 1" |
| marks | DECIMAL | |
| grade | VARCHAR | A/B/C/D |
| teacher_remarks | TEXT | |

### `report_cards`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| student_id | INT FK → students.id | |
| term | VARCHAR | |
| file_path | TEXT | PDF path |
| uploaded_at | TIMESTAMP | |

### `attendance`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| student_id | INT FK → students.id | |
| date | DATE | |
| status | VARCHAR | present / absent / late |

### `downloadable_files`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| title | VARCHAR | |
| grade | VARCHAR | |
| category | VARCHAR | term-paper / mock / past / revision / timetable |
| file_path | TEXT | |
| uploaded_at | TIMESTAMP | |

### `exam_schedules`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| grade | VARCHAR | |
| exam_name | VARCHAR | |
| subject | VARCHAR | |
| exam_date | DATE | |

### `announcements`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| title | VARCHAR | |
| body | TEXT | |
| target | VARCHAR | all / students / parents |
| created_at | TIMESTAMP | |

### `news`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| title | VARCHAR | |
| body | TEXT | |
| created_at | TIMESTAMP | |

### `events`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| title | VARCHAR | |
| description | TEXT | |
| event_date | DATE | |

### `success_stories`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| student_name | VARCHAR | |
| description | TEXT | |
| image_path | TEXT | |

### `slideshow`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| image_path | TEXT | |
| caption | TEXT | |
| sort_order | INT | |

### `gallery_photos`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| image_path | TEXT | |
| category | VARCHAR | events / sports / academic / arts |
| uploaded_at | TIMESTAMP | |

### `gallery_videos`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| youtube_url | TEXT | |
| title | VARCHAR | |

### `programmes`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| name | VARCHAR | |
| description | TEXT | |
| age_group | VARCHAR | |
| schedule | TEXT | |
| fee | DECIMAL | |
| image_path | TEXT | |

### `staff`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| name | VARCHAR | |
| role | VARCHAR | |
| photo_path | TEXT | |

### `inquiries`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| name | VARCHAR | |
| phone | VARCHAR | |
| email | VARCHAR | |
| message | TEXT | |
| status | VARCHAR | pending / resolved |
| submitted_at | TIMESTAMP | |

### `job_applications`
| Column | Type | Notes |
|---|---|---|
| id | SERIAL PK | |
| name | VARCHAR | |
| email | VARCHAR | |
| cv_path | TEXT | |
| status | VARCHAR | new / reviewed |
| submitted_at | TIMESTAMP | |

### `school_settings`
| Column | Type | Notes |
|---|---|---|
| key | VARCHAR PK | e.g. "principal_message" |
| value | TEXT | |

---

## 9. API Endpoints Reference

### Auth
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/auth/admin/login` | Public | Admin login |
| POST | `/api/auth/student/login` | Public | Student login |
| POST | `/api/auth/parent/login` | Public | Parent login |
| POST | `/api/auth/logout` | Any | Clear session |

### Home Content
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/home/slideshow` | Public | Get slideshow images |
| POST | `/api/home/slideshow` | Admin | Add slideshow image |
| DELETE | `/api/home/slideshow/:id` | Admin | Delete slideshow image |
| GET | `/api/home/news` | Public | Get news list |
| POST | `/api/home/news` | Admin | Add news item |
| GET | `/api/home/events` | Public | Get upcoming events |
| POST | `/api/home/events` | Admin | Add event |
| GET | `/api/home/stories` | Public | Get success stories |
| POST | `/api/home/stories` | Admin | Add success story |
| GET | `/api/home/settings` | Public | Get school settings |
| PUT | `/api/home/settings` | Admin | Update school settings |

### Gallery
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/gallery/photos` | Public | Get all photos (filter by category) |
| POST | `/api/gallery/photos` | Admin | Upload photo |
| DELETE | `/api/gallery/photos/:id` | Admin | Delete photo |
| GET | `/api/gallery/videos` | Public | Get video links |
| POST | `/api/gallery/videos` | Admin | Add video |

### Programmes
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/programmes` | Public | Get all programmes |
| POST | `/api/programmes` | Admin | Add programme |
| PUT | `/api/programmes/:id` | Admin | Edit programme |
| DELETE | `/api/programmes/:id` | Admin | Delete programme |

### Inquiries & Careers
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/inquiries` | Public | Submit contact form |
| GET | `/api/inquiries` | Admin | View all inquiries |
| PUT | `/api/inquiries/:id/status` | Admin | Update status |
| POST | `/api/careers/apply` | Public | Submit job application |
| GET | `/api/careers/applications` | Admin | View applications |

### Student Portal
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/student/files` | Student | Get files for student's grade |
| GET | `/api/student/exams` | Student | Get exam schedule |
| GET | `/api/student/announcements` | Student | Get announcements |

### Parent Portal
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/parent/children` | Parent | Get linked children |
| GET | `/api/parent/marks/:studentId` | Parent | Get marks per term |
| GET | `/api/parent/report-card/:studentId/:term` | Parent | Download report card PDF |
| GET | `/api/parent/attendance/:studentId` | Parent | Get attendance data |
| GET | `/api/parent/exams/:grade` | Parent | Get exam schedule |
| GET | `/api/parent/announcements` | Parent | Get announcements |

### Admin — Student & Parent Management
| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/admin/students` | Admin | List all students |
| POST | `/api/admin/students` | Admin | Create student account |
| PUT | `/api/admin/students/:id` | Admin | Update student |
| DELETE | `/api/admin/students/:id` | Admin | Delete student |
| POST | `/api/admin/students/files` | Admin | Upload downloadable file |
| DELETE | `/api/admin/students/files/:id` | Admin | Delete file |
| GET | `/api/admin/parents` | Admin | List all parents |
| POST | `/api/admin/parents` | Admin | Create parent account |
| PUT | `/api/admin/parents/:id` | Admin | Update parent |
| DELETE | `/api/admin/parents/:id` | Admin | Delete parent |

### Admin — Academic Records
| Method | Endpoint | Role | Description |
|---|---|---|---|
| POST | `/api/admin/marks` | Admin | Add/update student marks |
| POST | `/api/admin/report-cards` | Admin | Upload report card PDF |
| POST | `/api/admin/exams` | Admin | Add exam schedule entry |
| POST | `/api/admin/announcements` | Admin | Post announcement |

---

## 10. Deployment Checklist

### Environment Variables (`.env`)
```
DATABASE_URL=postgresql://...neon.tech/...
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
UPLOAD_DIR=/var/www/uploads
PORT=5000
```

### Hostinger VPS Setup
- [ ] Install Node.js 20 LTS
- [ ] Install PM2 globally (`npm install -g pm2`)
- [ ] Install Nginx
- [ ] Configure Nginx reverse proxy (port 3000 → frontend, port 5000 → backend)
- [ ] Install Certbot and issue SSL certificate
- [ ] Set up `uploads/` directory with correct write permissions
- [ ] Start backend: `pm2 start backend/server.js --name east-asia-api`
- [ ] Build and start frontend: `next build` → `pm2 start npm --name east-asia-web -- start`
- [ ] Enable PM2 startup on reboot: `pm2 startup && pm2 save`

### Nginx Config (example)
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /uploads/ {
        alias /var/www/uploads/;
    }
}
```

---

## Progress Tracker

| Phase | Status | Start | End |
|---|---|---|---|
| Phase 1 — Planning & Wireframes | ⬜ Not Started | | |
| Phase 2 — UI/UX Design | ⬜ Not Started | | |
| Phase 3 — Public Website | ⬜ Not Started | | |
| Phase 4 — Admin Panel + Student Portal | ⬜ Not Started | | |
| Phase 5 — Parent Portal + Charts | ⬜ Not Started | | |
| Phase 6 — Testing & Launch | ⬜ Not Started | | |

**Status Key:** ⬜ Not Started · 🟡 In Progress · ✅ Complete · 🔴 Blocked

---

*BizMaster Solutions — bizmastersolutions.lk — info@bizmastersolutions.lk*
