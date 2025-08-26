# GEMINI.md - AI Assistant Project Overview

This document provides a high-level overview of the Course Allocation System, as analyzed by the Gemini AI assistant. It outlines the current architecture, identifies core features, and proposes a strategic roadmap for future development and improvement.

## 1. Architecture Overview

The project is built on a sophisticated **Backend-for-Frontend (BFF)** pattern, which is an excellent choice for separating concerns and enabling independent development cycles.

-   **Frontend Framework**: Next.js 14 (with App Router) in TypeScript.
-   **UI Libraries**: A modern stack of React, Tailwind CSS, and Shadcn/UI, which provides a highly composable and accessible component system.
-   **State Management & Data Fetching**: TanStack Query is used for robust server-state management, handling caching, refetching, and mutations efficiently.
-   **Backend Service**: The Next.js application acts as a proxy to a separate core backend service running at `http://127.0.0.1:5000`, which handles the primary business logic.

## 2. Core Features

The system has a well-defined feature set centered around a clear Role-Based Access Control (RBAC) model.

-   **Role-Based Access Control (RBAC)**:
    -   **Vetter**: Responsible for the foundational data integrity of the system.
    -   **HOD (Head of Department)**: Responsible for the core allocation and decision-making processes.

-   **Data Management (Vetter)**: A comprehensive interface for uploading and managing the system's core data primitives, including Schools, Departments, Programs, Courses, and more. This is primarily handled via CSV uploads.

-   **Allocation Lifecycle (HOD)**:
    -   **Course Allocation**: The main workflow for assigning courses to lecturers.
    -   **Special & DE Allocation**: Workflows for handling non-standard allocation scenarios.
    -   **Allocation Viewing & Management**: Interfaces to view and manage the results of allocations.

-   **Authentication**: A complete login/logout flow that securely proxies credentials to the backend service.

## 3. Development Roadmap & Strategic Initiatives

To enhance the project's robustness, maintainability, and scalability, the following strategic initiatives are recommended.

### Initiative 1: Implement a Comprehensive Testing Strategy

*   **Objective**: To ensure code quality, prevent regressions, and increase confidence in the system's logic.
*   **Action Items**:
    1.  **Setup Frameworks**: Integrate **Jest** and **React Testing Library** into the project.
    2.  **Unit Tests**: Write unit tests for critical UI components (e.g., `AllocateLecturerModal`, form components) to verify their behavior in isolation.
    3.  **Integration Tests**: Test the Next.js API routes to ensure they correctly proxy requests, handle authentication, and manage errors.
    4.  **End-to-End (E2E) Tests**: Implement E2E tests using **Playwright** or **Cypress** for critical user flows, such as "HOD logs in, allocates a course, and verifies the result."

### Initiative 2: Centralize API and Environment Configuration

*   **Objective**: To remove hardcoded values, improve security, and make the application easily configurable for different environments (development, staging, production).
*   **Action Items**:
    1.  **Use Environment Variables**: Create a `.env.local` file and store the backend API base URL (e.g., `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000`).
    2.  **Create a Central API Client**: Develop a single, reusable utility (e.g., in `lib/api.ts`) that reads the environment variable and is used for all outgoing `fetch` requests.
    3.  **Refactor**: Replace all hardcoded URLs in the `app/api/` routes with calls to the central API client.

### Initiative 3: Enhance Error Handling and User Feedback

*   **Objective**: To make the system more resilient and provide clearer, more actionable feedback to the user when things go wrong.
*   **Action Items**:
    1.  **Detailed Logging**: In the `catch` blocks of API routes, log the actual error object for better debugging intelligence.
    2.  **Propagate Backend Errors**: Ensure that specific error messages from the backend service (e.g., "Course already exists") are passed through the BFF to the frontend.
    3.  **Display User-Friendly Toasts**: Use the existing `useToast` hook to display clear and concise error messages to the user instead of generic "Server error" alerts.

### Initiative 4: Automate API Client Generation (Advanced)

*   **Objective**: To improve developer velocity and ensure perfect type-safety between the frontend and the backend API.
*   **Action Items**:
    1.  **Adopt an API Specification**: Work with the backend team to define an **OpenAPI (Swagger)** specification for their API.
    2.  **Generate a Type-Safe Client**: Use a tool like `openapi-typescript-codegen` to automatically generate a TypeScript client from the OpenAPI spec.
    3.  **Integrate Generated Client**: Replace the manual API client from Initiative 2 with the newly generated, fully type-safe client.

## 4. Conclusion

This is a high-quality project with a strong architectural foundation. By focusing on the strategic initiatives outlined above—starting with testing and configuration—you can significantly enhance its long-term stability and maintainability, ensuring it evolves into a truly production-grade system.
