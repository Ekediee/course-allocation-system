# Product Requirements Document: Course Allocation System (Frontend)

**Version:** 1.0
**Status:** Draft
**Author:** Emtech Dev

## 1. Introduction

### 1.1. Purpose
This document provides a detailed specification for the frontend of the Course Allocation System. It outlines the product's purpose, features, user interface (UI), user experience (UX), and functional and non-functional requirements. It is intended to be the single source of truth for frontend developers, UI/UX designers, and project managers. This PRD is a direct companion to the backend PRD and assumes the backend services are implemented as specified.

### 1.2. Product Vision & Goal
To create a modern, responsive, and highly usable web interface that serves as the primary client for the Course Allocation System backend. The goal is to provide an intuitive, efficient, and error-free experience for all user roles, abstracting the complexity of the allocation process into a clean and interactive application.

## 2. User Personas & Scenarios

The frontend will provide tailored experiences for the following key user personas:

*   **The Superadmin (System Administrator):**
    *   **Goal:** To manage the university's core academic structure through a simple and clear interface.
    *   **Scenario:** The Superadmin logs in and navigates to the "Resource Management" section. They click "Add New School," which opens a modal dialog. They fill out the form, receive instant validation feedback, and upon submission, see the new school appear in the data table without a full page reload.

*   **The Vetter (Academic Affairs Officer):**
    *   **Goal:** To manage curriculum bulletins and courses with ease and precision.
    *   **Scenario:** The Vetter navigates to the "Manage Uploads" page. They select the "Courses" tab and see a list of all courses. They use the search bar to find a specific course, click "Edit," and modify its details in a modal form. To add multiple new courses, they use the "Upload CSV" feature, receiving real-time feedback on the upload and validation process.

*   **The HOD (Head of Department):**
    *   **Goal:** To have a clear, real-time overview of their department's allocation status and to assign courses efficiently.
    *   **Scenario:** The HOD logs in and lands on their dashboard, which displays a donut chart showing the percentage of allocated vs. unallocated courses. They navigate to the "Course Allocation" page, where they see a filterable table of courses for the active semester. For a specific course, they click "Allocate," and a modal appears with a searchable dropdown of available lecturers. They select a lecturer, confirm the allocation, and the UI updates instantly to reflect the change.

*   **The Lecturer (Teaching Staff):**
    *   **Goal:** To quickly and easily view their teaching assignments.
    *   **Scenario:** The lecturer logs in and is taken to a simple, clean dashboard that prominently displays a read-only list of the courses they have been assigned for the current semester, including course codes, titles, and credit units.

## 3. System Features & Functional Requirements

### F1: User Authentication & Profile Management
*   **F1.1:** The application must present a dedicated `/login` page with fields for email and password.
*   **F1.2:** The login form must provide real-time, client-side validation for input fields (e.g., valid email format, password length).
*   **F1.3:** On successful login, the application must store the JWT received from the backend API in a secure, HttpOnly cookie and redirect the user to their respective dashboard.
*   **F1.4:** The application must provide a user profile page where a logged-in user can view their own details.

### F2: Core Application Layout & Navigation
*   **F2.1:** The application must have a primary layout consisting of a persistent sidebar for navigation and a header.
*   **F2.2:** The navigation links displayed in the sidebar must be dynamically rendered based on the logged-in user's role (e.g., `HODSideBar`, `VetterSideBar`).
*   **F2.3:** The header must display the name of the logged-in user and a dropdown menu with options for "Profile" and "Log Out."
*   **F2.4:** The entire layout must be fully responsive and adapt gracefully to screen sizes from mobile to desktop. A mobile-specific header/menu should be used for smaller viewports.

### F3: Resource & Data Management UI (Vetter/Superadmin)
*   **F3.1:** The application must provide dedicated pages for managing each core resource (Schools, Departments, Programs, Courses, etc.), organized under a "Manage Uploads" or similar section.
*   **F3.2:** Each resource page must display items in a data table with features for sorting, filtering, and pagination.
*   **F3.3:** Each resource page must feature an "Add New" button that triggers a modal dialog with a form for creating a new item. All forms must use `react-hook-form` for state management and `zod` for validation.
*   **F3.4:** The UI must support batch uploading of resources via CSV files, including a clear file input element and visual feedback during the upload and processing stages.

### F4: Course Allocation UI (HOD)
*   **F4.1:** The main allocation page must display a data table of all unallocated courses for the HOD's department for the active session.
*   **F4.2:** The table must offer robust filtering options (e.g., by Program, by Level).
*   **F4.3:** Each row in the table must have an "Allocate" button that opens the `AllocateLecturerModal`.
*   **F4.4:** The allocation modal must feature a searchable `ComboBox` component to allow the HOD to easily find and select a lecturer from a potentially long list.
*   **F4.5:** The UI must support the creation of multiple allocation groups for a single course.
*   **F4.6:** A separate, clearly marked interface must be provided for handling "Special Allocations."

### F5: Dashboards & Visualization
*   **F5.1:** The application must provide a role-specific dashboard as the landing page after login.
*   **F5.2:** The HOD dashboard must feature data visualization components, such as a `DonutChart`, to show key statistics like the allocation progress.
*   **F5.3:** All dashboards should display relevant, at-a-glance information tailored to the user's role.

### F6: General UI/UX & Feedback Mechanisms
*   **F6.1:** The application must use toast notifications to provide non-intrusive feedback for user actions (e.g., "Allocation successful," "Department created," "An error occurred").
*   **F6.2:** All data-fetching components must display a loading state (e.g., skeleton loaders) to indicate that data is being fetched in the background.
*   **F6.3:** When a data table or list is empty, it must display a user-friendly "empty state" message and graphic, rather than just a blank space.

## 4. Non-Functional Requirements

### NFR1: Performance
*   **NFR1.1:** The application should target a Google Lighthouse performance score of 90+.
*   **NFR1.2:** Initial page loads must be fast. Next.js features like code-splitting, server-side rendering (SSR), and static site generation (SSG) should be used appropriately.
*   **NFR1.3:** All data fetching from the client-side must be handled by TanStack Query to leverage caching, reduce redundant API calls, and provide a snappy user experience.

### NFR2: Accessibility (a11y)
*   **NFR2.1:** The application must be compliant with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
*   **NFR2.2:** All interactive elements must be fully keyboard-navigable.
*   **NFR2.3:** Semantic HTML must be used. All components must have appropriate ARIA attributes. The use of Shadcn/UI components should facilitate this.

### NFR3: Usability & Consistency
*   **NFR3.1:** The interface must be intuitive, requiring minimal to no training for the end-user.
*   **NFR3.2:** The design language, component library (Shadcn/UI), and interaction patterns must be applied consistently across the entire application.

### NFR4: Maintainability & Code Quality
*   **NFR4.1:** The codebase must be well-structured, following Next.js App Router conventions.
*   **NFR4.2:** All API communication must be proxied through the Next.js backend (the BFF layer). No direct API calls from client components to the external backend service.
*   **NFR4.3:** The project must include a comprehensive suite of automated tests (unit, integration, and E2E).

## 5. Technical Stack
The frontend application shall be built using the following technologies to ensure quality, consistency, and maintainability.

*   **Framework:** Next.js (v14+)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Component Library:** Shadcn/UI
*   **State Management:** TanStack Query (for server state) & React Context/Zustand (for global client state, if needed)
*   **Forms:** React Hook Form & Zod
*   **Testing:** Jest, React Testing Library, Playwright/Cypress

## 6. Out of Scope / Future Work
The following features are not part of this version but may be considered for future releases:
*   A real-time notification system in the UI.
*   UI for lecturers to accept/reject allocations.
*   Advanced analytics and reporting dashboards.
*   A public-facing documentation site for the API.
