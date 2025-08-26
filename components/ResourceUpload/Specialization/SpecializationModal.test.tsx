import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpecializationModal from './SpecializationModal';
import { useAppContext } from '@/contexts/ContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the useAppContext hook
jest.mock('@/contexts/ContextProvider', () => ({
  useAppContext: jest.fn(),
}));

describe('SpecializationModal', () => {
  const mockSetIsUploading = jest.fn();
  const mockOnAddSpecialization = jest.fn();
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test to ensure isolation
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          // Disable retries and refetchOnWindowFocus for tests
          retry: false,
          refetchOnWindowFocus: false,
        },
      },
    });

    // Mock the global fetch function inside beforeEach
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Upload successful' }),
      }) as Promise<Response>
    );

    // Provide the mock implementation for useAppContext
    (useAppContext as jest.Mock).mockReturnValue({
      setIsUploading: mockSetIsUploading,
      fetchDepartmentName: jest.fn().mockResolvedValue([]),
      fetchProgramNameByDepartment: jest.fn().mockResolvedValue([]),
    });
    // Clear mock history before each test
    (fetch as jest.Mock).mockClear();
    mockSetIsUploading.mockClear();
  });

  it('should handle batch upload correctly', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SpecializationModal btnName="Add Specialization" onAddSpecialization={mockOnAddSpecialization} />
      </QueryClientProvider>
    );

    // 1. Open the modal
    fireEvent.click(screen.getByText('Add Specialization'));

    // 2. Simulate file selection and trigger setOpen(true)
    const file = new File(['specialization_name\nTest Spec 1'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Batch Upload/i);
    fireEvent.click(fileInput); // Simulate clicking the input to set 'open' to true
    fireEvent.change(fileInput, { target: { files: [file] } });

    // 3. Click the upload button
    const uploadButton = screen.getByText('Create Specialization');
    fireEvent.click(uploadButton);

    // 4. Assertions
    await waitFor(() => {
      // Check that setIsUploading was called
      expect(mockSetIsUploading).toHaveBeenCalledWith(true);

      // Check that fetch was called
      expect(fetch).toHaveBeenCalledTimes(1);

      // Check the URL
      expect(fetch).toHaveBeenCalledWith('/api/manage-uploads/specialization/batch', expect.any(Object));

      // Check the FormData content
      const fetchOptions = (fetch as jest.Mock).mock.calls[0][1];
      const formData = fetchOptions.body as FormData;
      expect(formData.get('file')).toBe(file);
      
      // We can't directly check department_id and program_id as they are not set in this test,
      // but we can confirm the fetch call was made with FormData.
      expect(formData).toBeInstanceOf(FormData);
    });

    // Check that setIsUploading is called with false in the finally block
    await waitFor(() => {
        expect(mockSetIsUploading).toHaveBeenCalledWith(false);
    });
  });
});