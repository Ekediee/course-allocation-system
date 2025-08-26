````markdown
# Courses Batch Upload CSV Template

## 1. Overview

This document provides the template and structure for the CSV file used to batch upload courses into the Course Allocation System.

When performing a batch upload from the UI, you must first select the context for the new courses, including the **Bulletin**, **Program**, **Semester**, **Level**, and optionally, the **Specialization**. The system will then associate all courses listed in the uploaded CSV file with this selected context.

## 2. CSV File Structure

The CSV file must contain the following headers:

- `course_code`
- `course_title`
- `course_unit`

### Column Definitions

- **`course_code`**: (Text) The unique code for the course (e.g., `COSC101`). This field is required.
- **`course_title`**: (Text) The full title of the course (e.g., `Introduction to Programming`). This field is required.
- **`course_unit`**: (Integer) The credit unit value for the course (e.g., `3`). This field is required.

## 3. Example

Here is an example of a valid CSV file for batch uploading courses.

```csv
course_code,course_title,course_unit
COSC101,"Introduction to Programming",3
COSC102,"Data Structures and Algorithms",3
MATH111,"Calculus I",4
STAT201,"Probability and Statistics",3
```

---

**Note:** Please ensure your CSV file is saved with UTF-8 encoding to prevent any issues with special characters. If a course title contains a comma, enclose it in double quotes as shown in the example.
````