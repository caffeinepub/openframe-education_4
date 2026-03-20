# OpenFrame Education

## Current State
New project -- no existing code.

## Requested Changes (Diff)

### Add
- Full public marketing homepage with 10 sections
- Role-based authentication system (Student, Teacher, Admin, Field Executive)
- Student dashboard: Classes, Attendance, Exams, Results, Certificates
- Teacher dashboard: Attendance, Class Schedule, Student Tracking
- Admin panel: Manage students, teachers, reports, enrollments
- Field Executive panel: Manual check-in, Lead management, Daily tracking
- Blog section (Pragati Magazine) with articles and category tags
- Contact form with phone/email info

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- User management with roles: student, teacher, admin, field_executive
- Auth: register/login with role assignment
- Students: enrollment records, attendance, exam results, certificates
- Teachers: class schedules, student lists, attendance marking
- Admin: full CRUD on users, view reports, manage enrollments
- Field Executives: check-in records, lead management (name, phone, status, notes)
- Blog posts: title, content, category, date
- Contact form submissions
- Demo booking requests

### Frontend
- Public homepage: Navbar, Hero, Classes, Features, Dashboard Previews, Pricing, Teachers, Blog (Pragati Magazine), Testimonials, Contact
- Auth pages: Login (role selector), Register
- Student dashboard layout with sub-pages
- Teacher dashboard layout with sub-pages
- Admin panel with user management tables and reports
- Field Executive panel with check-in and lead tracking
- Floating WhatsApp button
- Scroll animations, glassmorphism cards, responsive layout
