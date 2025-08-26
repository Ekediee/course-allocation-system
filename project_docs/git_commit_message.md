feat: Implement comprehensive course management and specialization features

This commit introduces and refines core functionalities for course and specialization management,
including UI enhancements, API route creation, and robust testing setup.

- **Course Management:**
  - Implemented full course creation (single & batch) and display.
  - Updated `CourseModal.tsx` to include specialization selection and improved form handling.
  - Refactored `CourseContent.tsx` for better data fetching and display of course details, including specialization.
  - Created Next.js API routes (`/api/manage-uploads/course` and `/api/manage-uploads/course/batch`) to proxy requests for course creation and fetching.

- **Specialization Batch Upload Fix & Validation:**
  - Corrected the backend API route (`/api/manage-uploads/specialization/batch`) to properly parse single-column CSV files for specialization batch uploads, using context from form data.

- **Testing Infrastructure:**
  - Set up Jest and React Testing Library for the project.
  - Configured Jest for Next.js applications, including path alias resolution.
  - Added a dedicated test case for the specialization batch upload functionality, ensuring its correctness.

- **Documentation:**
  - Generated backend API prompts and CSV templates for course and specialization batch uploads.
