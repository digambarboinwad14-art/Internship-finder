# InternFlow — Internship Discovery & Application Portal

**InternFlow** is a modern, responsive web application prototype built for discovering internships, filtering opportunities by multi-dimensional criteria, and submitting applications with real-time status tracking.

---

## 🚀 Key Features

1. **Rich Internship Discovery & Search**
   - Live full-text keyword search across role titles, company names, descriptions, and tech stacks (with debounce).
   - Fast multi-criteria filtering:
     - **Field / Domain**: Software Engineering, Data Science & AI, UI/UX Design, Product Management, Marketing & Growth, Cybersecurity.
     - **Workplace Type**: Remote, Hybrid, In-Office.
     - **Duration**: 3 Months, 4 Months, 6 Months.
     - **Minimum Compensation / Stipend Slider**: Real-time slider from \$0 to \$3,500+/mo.
     - **Sorting**: Latest Posted, Highest Stipend, Application Deadline soonest.
   - Quick-filter chips for instant search (React, Python, Figma, Remote Only).

2. **Interactive Opportunity Details Modal**
   - Deep dive into company background, compensation, location, workplace mode, and deadlines.
   - Comprehensive sections for Role Description, Key Responsibilities, Requirements & Qualifications, and Perks & Benefits.
   - One-click bookmarking and shareable URL generator.

3. **Application Submission Flow**
   - Clean, validated application form:
     - Candidate Full Name, Email, and Phone
     - Portfolio / GitHub / LinkedIn profile link
     - Earliest start date and weekly availability (Full-time / Part-time / Flexible)
     - Interactive **Resume Upload Zone** supporting drag & drop or file browse with live file name & size display
     - Personalized candidate pitch / cover note
   - Celebratory submission confirmation modal.
   - Duplicate application detection.

4. **Applicant Dashboard & Status Tracker**
   - Real-time candidate metrics:
     - **Total Applied**
     - **In Review**
     - **Shortlisted**
     - **Saved Bookmarks**
   - Structured applications table with company logos, application timestamps, stipend info, and color-coded status badges (`Under Review`, `Shortlisted`, `Applied`).
   - Detailed submission inspection modal (view submitted portfolio, attached resume details, and notes).
   - Option to withdraw applications if needed.

5. **Shortlist / Saved Roles Drawer**
   - Save opportunities with 1-click bookmark buttons on cards or details modal.
   - Persistent across browser sessions via `localStorage`.

6. **Interactive Help & FAQ Knowledge Base**
   - **Real-Time FAQ Search**: Search across dozens of common questions regarding applications, filters, stipends, and policies.
   - **Categorized Accordion**: Filter FAQs by *Applications & Tracking*, *Search & Filters*, *Stipends & Verification*, and *Bookmarks & Local Data*.
   - **Direct Query Submission Form**: Fill in candidate questions or technical issues with category & priority selectors.
   - **Live Ticket Tracker**: Generates realistic tracking IDs (`#IF-QRY-XXXX`) with persistent status monitoring in `localStorage`.
   - **Support Desk & Contact Info**: Direct support contact email (`support@internflow.dev`) and 2-hour response guarantee.
   - **Floating Quick Help Launcher**: Accessible with 1 click from anywhere on the platform.

7. **Design & UX Highlights**
   - Modern glassmorphism navigation with live counters for saved and applied internships.
   - Smooth entrance animations and micro-interactions.
   - Floating toast notification system for instant user feedback.
   - 100% responsive layout across mobile, tablet, and desktop viewports.
   - Zero build step required — runs directly in any modern web browser.

---

## 📂 Project Structure

```
Webathon project prototype/
├── index.html        # Main semantic markup, hero section, filters, view containers & modals
├── css/
│   └── styles.css    # Custom animations, glassmorphic effects, badges, scrollbars & typography
├── js/
│   ├── data.js       # Seed dataset of realistic internships and filter categories
│   └── app.js        # Core reactive application logic, filters, modals, localStorage & state
└── README.md         # Project documentation & presentation guide
```

---

## 💻 How to Run

No installations, Node.js, or build commands are required!

Simply open `index.html` in your favorite browser:
- Double click [index.html](file:///d:/Webathon%20project%20prototype/index.html) in File Explorer, or
- Right click `index.html` → **Open with** → **Google Chrome** / **Microsoft Edge** / **Firefox**.
