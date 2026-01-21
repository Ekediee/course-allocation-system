/**
 * Validates and cleans a course code to match one of the three expected formats.
 * @param rawCode The raw course code string from the input.
 * @returns An object with either a `cleanedCode` or an `error` message.
 */
export const cleanAndValidateCourseCode = (rawCode: string): { cleanedCode?: string; error?: string } => {
  if (!rawCode || typeof rawCode !== 'string' || rawCode.trim() === '') {
    return { error: "Course code cannot be empty." };
  }

  // Initial Cleanup: Uppercase and remove leading/trailing spaces.
  const code = rawCode.trim().toUpperCase();

  // Extract letter and number parts, ignoring spaces and hyphens.
  const lettersPart = (code.match(/[A-Z]/g) || []).join('');
  const numbersPart = (code.match(/\d/g) || []).join('');
  
  // Basic structural check
  if (!lettersPart || !numbersPart) {
    return { error: `Invalid format '${rawCode}': Must contain both letters and numbers.` };
  }
  if (numbersPart.length !== 3) {
    return { error: `Invalid format '${rawCode}': Must contain exactly 3 digits.` };
  }

  // Apply formatting rules.

  // Rule for "BU-GST 314" format
  if (lettersPart.startsWith('BUGST') && lettersPart.length === 5) {
    const departmentCode = lettersPart.substring(2); // Extracts 'GST'
    const cleanedCode = `BU-${departmentCode} ${numbersPart}`;
    return { cleanedCode };
  }

  // Rule for "GEDS412" format (4 letters)
  if (lettersPart.length === 4) {
    const cleanedCode = `${lettersPart}${numbersPart}`;
    return { cleanedCode };
  }
    
  // Rule for "CSC 216" format (3 letters)
  if (lettersPart.length === 3) {
    const cleanedCode = `${lettersPart} ${numbersPart}`;
    return { cleanedCode };
  }
    
  // If no rules match, it's invalid.
  return { error: `Invalid format '${rawCode}': Code structure is not recognized.` };
};