import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CourseTypeModal from './CourseTypeModal';
import { useAppContext } from '@/contexts/ContextProvider';
import { useToast } from '@/hooks/use-toast';

// Mock the context and hooks
jest.mock('@/contexts/ContextProvider', () => ({
  useAppContext: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
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

describe('CourseTypeModal', () => {
  const mockToast = jest.fn();
  const mockOnAddCourseType = jest.fn();

  beforeEach(() => {
    (useAppContext as jest.Mock).mockReturnValue({
      setIsUploading: jest.fn(),
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    (fetch as jest.Mock).mockClear();
    mockToast.mockClear();
    mockOnAddCourseType.mockClear();
  });

  it('renders the modal and its form elements', async () => {
    renderWithProviders(<CourseTypeModal btnName="Add Course Type" onAddCourseType={mockOnAddCourseType} />);

    fireEvent.click(screen.getByText('Add Course Type'));

    await waitFor(() => {
      expect(screen.getByText('Add a Course Type')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Course Type Name')).toBeInTheDocument();
  });

  it('shows a validation error if required fields are empty', async () => {
    renderWithProviders(<CourseTypeModal btnName="Add Course Type" onAddCourseType={mockOnAddCourseType} />);

    fireEvent.click(screen.getByText('Add Course Type'));

    await waitFor(() => {
      expect(screen.getByText('Add a Course Type')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Create Course Type'));

    expect(mockToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Course Type Creation Failed',
      description: 'Please fill in all fields',
    });
  });

  it('successfully creates a course type with valid data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ msg: 'Course type created successfully' }),
    });

    renderWithProviders(<CourseTypeModal btnName="Add Course Type" onAddCourseType={mockOnAddCourseType} />);

    fireEvent.click(screen.getByText('Add Course Type'));

    await waitFor(() => {
      expect(screen.getByText('Add a Course Type')).toBeInTheDocument();
    });

    // Fill the form
    fireEvent.change(screen.getByLabelText('Course Type Name'), { target: { value: 'General' } });

    fireEvent.click(screen.getByText('Create Course Type'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/manage-uploads/course-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'General',
        }),
      });
    });

    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            variant: 'success',
            title: 'Course Type Upload Success',
            description: 'Course type created successfully',
        });
        expect(mockOnAddCourseType).toHaveBeenCalledTimes(1);
    });
  });

  it('shows an error toast when the API call fails', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Failed to create course type' }),
    });

    renderWithProviders(<CourseTypeModal btnName="Add Course Type" onAddCourseType={mockOnAddCourseType} />);

    fireEvent.click(screen.getByText('Add Course Type'));

    await waitFor(() => {
      expect(screen.getByText('Add a Course Type')).toBeInTheDocument();
    });

    // Fill the form
    fireEvent.change(screen.getByLabelText('Course Type Name'), { target: { value: 'General' } });

    fireEvent.click(screen.getByText('Create Course Type'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
            variant: 'destructive',
            title: 'Something is wrong',
            description: 'Failed to create course type',
        });
    });
  });
});