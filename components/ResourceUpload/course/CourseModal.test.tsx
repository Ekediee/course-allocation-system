import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CourseModal from './CourseModal';
import { useAppContext } from '@/contexts/ContextProvider';
import { useToast } from '@/hooks/use-toast';

// Mock the context and hooks
jest.mock('@/contexts/ContextProvider', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Mock the ComboboxMain component
jest.mock('@/components/ComboboxMain', () => ({
  ComboboxMain: ({ onSelect, data }: { onSelect: (value: string) => void; data: any[] }) => (
    <select onChange={(e) => onSelect(e.target.value)} data-testid="combobox">
      {data.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  ),
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

global.fetch = jest.fn();

describe('CourseModal', () => {
  const mockToast = jest.fn();
  const mockOnAddCourse = jest.fn();

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      setIsUploading: jest.fn(),
      fetchBulletinName: jest.fn().mockResolvedValue([{ value: 'bulletin1', label: 'Bulletin 1' }]),
      fetchSchoolName: jest.fn().mockResolvedValue([{ value: 'school1', label: 'School 1' }]),
      fetchDepartmentNameBySchool: jest.fn().mockResolvedValue([{ value: 'dept1', label: 'Department 1' }]),
      fetchProgramNameByDepartment: jest.fn().mockResolvedValue([{ value: 'prog1', label: 'Program 1' }]),
      fetchSpecializationNameByProgram: jest.fn().mockResolvedValue([{ value: 'spec1', label: 'Specialization 1' }]),
      fetchSemesters: jest.fn().mockResolvedValue([{ value: 'sem1', label: 'Semester 1' }]),
      fetchLevels: jest.fn().mockResolvedValue([{ value: 'level1', label: 'Level 1' }]),
      showDeptCombo: true,
      showProgCombo: true,
      showSpecCombo: true,
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    (fetch as jest.Mock).mockClear();
    mockToast.mockClear();
    mockOnAddCourse.mockClear();
  });

  it('renders the modal and its form elements', async () => {
    renderWithProviders(<CourseModal btnName="Add Course" onAddCourse={mockOnAddCourse} />);

    fireEvent.click(screen.getByText('Add Course'));

    await waitFor(() => {
      expect(screen.getByText('Add a Course')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Course Code')).toBeInTheDocument();
    expect(screen.getByLabelText('Course Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Course Unit')).toBeInTheDocument();
    expect(screen.getAllByTestId('combobox').length).toBe(7);
  });

  it('shows a validation error if required fields are empty', async () => {
    renderWithProviders(<CourseModal btnName="Add Course" onAddCourse={mockOnAddCourse} />);

    fireEvent.click(screen.getByText('Add Course'));

    await waitFor(() => {
      expect(screen.getByText('Add a Course')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Course'));

    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Course Creation Failed',
      description: 'Please fill in all required fields',
    });
  });

  it('successfully creates a course with valid data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ msg: 'Course created successfully' }),
    });

    renderWithProviders(<CourseModal btnName="Add Course" onAddCourse={mockOnAddCourse} />);

    fireEvent.click(screen.getByText('Add Course'));

    await waitFor(() => {
      expect(screen.getByText('Add a Course')).toBeInTheDocument();
    });

    // Fill the form
    fireEvent.change(screen.getByLabelText('Course Code'), { target: { value: 'CST101' } });
    fireEvent.change(screen.getByLabelText('Course Title'), { target: { value: 'Intro to Testing' } });
    fireEvent.change(screen.getByLabelText('Course Unit'), { target: { value: '3' } });
    
    const selects = screen.getAllByTestId('combobox');
    fireEvent.change(selects[0], { target: { value: 'bulletin1' } });
    fireEvent.change(selects[1], { target: { value: 'school1' } });
    fireEvent.change(selects[2], { target: { value: 'dept1' } });
    fireEvent.change(selects[3], { target: { value: 'prog1' } });
    fireEvent.change(selects[4], { target: { value: 'spec1' } });
    fireEvent.change(selects[5], { target: { value: 'sem1' } });
    fireEvent.change(selects[6], { target: { value: 'level1' } });


    fireEvent.click(screen.getByText('Create Course'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/manage-uploads/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'CST101',
          title: 'Intro to Testing',
          unit: 3,
          program_id: 'prog1',
          level_id: 'level1',
          semester_id: 'sem1',
          specialization_id: 'spec1',
          bulletin_id: 'bulletin1',
        }),
      });
    });

    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            variant: 'success',
            title: 'Course Upload Success',
            description: 'Course created successfully',
        });
        expect(mockOnAddCourse).toHaveBeenCalledTimes(1);
    });
  });

  it('shows an error toast when the API call fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to create course' }),
    });

    renderWithProviders(<CourseModal btnName="Add Course" onAddCourse={mockOnAddCourse} />);

    fireEvent.click(screen.getByText('Add Course'));

    await waitFor(() => {
      expect(screen.getByText('Add a Course')).toBeInTheDocument();
    });

    // Fill the form
    fireEvent.change(screen.getByLabelText('Course Code'), { target: { value: 'CST101' } });
    fireEvent.change(screen.getByLabelText('Course Title'), { target: { value: 'Intro to Testing' } });
    fireEvent.change(screen.getByLabelText('Course Unit'), { target: { value: '3' } });
    
    const selects = screen.getAllByTestId('combobox');
    fireEvent.change(selects[0], { target: { value: 'bulletin1' } });
    fireEvent.change(selects[1], { target: { value: 'school1' } });
    fireEvent.change(selects[2], { target: { value: 'dept1' } });
    fireEvent.change(selects[3], { target: { value: 'prog1' } });
    fireEvent.change(selects[4], { target: { value: 'spec1' } });
    fireEvent.change(selects[5], { target: { value: 'sem1' } });
    fireEvent.change(selects[6], { target: { value: 'level1' } });

    fireEvent.click(screen.getByText('Create Course'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            variant: 'destructive',
            title: 'Something is wrong',
            description: 'Failed to create course',
        });
    });
  });
});
