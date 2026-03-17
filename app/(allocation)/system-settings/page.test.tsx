import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SystemConfigsPage from './page';
import { useAppContext } from '@/contexts/ContextProvider';
import '@testing-library/jest-dom';

// Mock the context provider
jest.mock('@/contexts/ContextProvider', () => ({
  useAppContext: jest.fn(),
}));

describe('SystemConfigsPage', () => {
  const mockToggleFirstSemesterStatus = jest.fn();
  const mockToggleSecondSemesterStatus = jest.fn();
  const mockToggleSummerSemesterStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppContext as jest.Mock).mockReturnValue({
      role: 'admin',
      email: 'admin@babcock.edu.ng',
      isInMaintenace: false,
      toggleMaintenanceMode: jest.fn(),
      isAllocationClosed: false,
      toggleCloseAllocationStatus: jest.fn(),
      isFirstSemesterActive: false,
      toggleFirstSemesterStatus: mockToggleFirstSemesterStatus,
      isSecondSemesterActive: true,
      toggleSecondSemesterStatus: mockToggleSecondSemesterStatus,
      isSummerSemesterActive: false,
      toggleSummerSemesterStatus: mockToggleSummerSemesterStatus,
    });
  });

  it('renders semester settings correctly', () => {
    render(<SystemConfigsPage />);

    expect(screen.getByText('System Configurations')).toBeInTheDocument();
    expect(screen.getByText('Semester Settings')).toBeInTheDocument();

    // Verify switches are rendered
    expect(screen.getByLabelText('First Semester')).toBeInTheDocument();
    expect(screen.getByLabelText('Second Semester')).toBeInTheDocument();
    expect(screen.getByLabelText('Summer Semester')).toBeInTheDocument();
  });

  it('calls toggle functions when switches are clicked', () => {
    render(<SystemConfigsPage />);

    // Click First Semester switch
    const firstSemesterSwitch = screen.getByRole('switch', { name: 'First Semester' });
    fireEvent.click(firstSemesterSwitch);
    expect(mockToggleFirstSemesterStatus).toHaveBeenCalled();

    // Click Second Semester switch
    const secondSemesterSwitch = screen.getByRole('switch', { name: 'Second Semester' });
    fireEvent.click(secondSemesterSwitch);
    expect(mockToggleSecondSemesterStatus).toHaveBeenCalled();

    // Click Summer Semester switch
    const summerSemesterSwitch = screen.getByRole('switch', { name: 'Summer Semester' });
    fireEvent.click(summerSemesterSwitch);
    expect(mockToggleSummerSemesterStatus).toHaveBeenCalled();
  });
});
