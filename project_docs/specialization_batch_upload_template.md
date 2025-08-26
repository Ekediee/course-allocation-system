````markdown
# Specialization Batch Upload CSV Template

## 1. Overview

This document provides the template and structure for the CSV file used to batch upload specializations into the Course Allocation System.

When performing a batch upload from the UI, you will first select the **Department** and **Program** that these new specializations will belong to. The system will then associate all specializations listed in the uploaded CSV file with the selected department and program.

## 2. CSV File Structure

The CSV file must contain a single column with the following header:

- `specialization_name`

### Column Definition

- **`specialization_name`**: (Text) The full name of the specialization. This field is required.

## 3. Example

Here is an example of a valid CSV file for batch uploading specializations.

```csv
specialization_name
Software Engineering
Cybersecurity
Data Science
Artificial Intelligence
Networking and Communication
```

---

**Note:** Please ensure your CSV file is saved with UTF-8 encoding to prevent any issues with special characters.
````