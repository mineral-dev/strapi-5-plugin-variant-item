import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

// Mock fetch for API calls
global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(() => 'mock-jwt-token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

describe('Input Component', () => {
  const mockProps = {
    attribute: { type: 'json' },
    error: null,
    description: 'Test description',
    label: 'Variants',
    labelAction: null,
    name: 'variants',
    onChange: jest.fn(),
    required: true,
    value: null,
    disabled: false
  };

  const mockApiResponse = [
    {
      slug: 'color',
      title: 'Color',
      type: 'Button',
      items: [
        { slug: 'red', title: 'Red', color: '#FF0000', thumbnail: null },
        { slug: 'blue', title: 'Blue', color: '#0000FF', thumbnail: null }
      ]
    },
    {
      slug: 'size',
      title: 'Size',
      type: 'Button',
      items: [
        { slug: 'small', title: 'Small', color: null, thumbnail: null },
        { slug: 'large', title: 'Large', color: null, thumbnail: null }
      ]
    }
  ];

  beforeEach(() => {
    fetch.mockResolvedValue({
      json: async () => mockApiResponse,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with initial state', async () => {
    render(<Input {...mockProps} />);
    
    // Check if label is rendered
    expect(screen.getByText('Variants')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument(); // Required indicator
    
    // Wait for API call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/strapi-5-plugin-variant-item/get-attribute-products',
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-jwt-token',
          }
        })
      );
    });
  });

  it('should handle initial value properly', async () => {
    const initialValue = JSON.stringify([
      { attribute: 'color', option: { name: 'Red', slug: 'red' }, type: 'Button' }
    ]);
    
    render(<Input {...mockProps} value={initialValue} />);
    
    await waitFor(() => {
      // Check if the select has the correct value
      const selects = screen.getAllByRole('combobox');
      expect(selects[0]).toHaveValue('color');
    });
  });

  it('should add new variant option when Add button is clicked', async () => {
    const user = userEvent.setup();
    render(<Input {...mockProps} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Find and click the Add button
    const addButton = screen.getByText('Add Variants');
    await user.click(addButton);
    
    // Should now have 2 sets of dropdowns
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2); // 2 attribute selects (no option selects yet)
  });

  it('should remove variant option when Remove button is clicked', async () => {
    const user = userEvent.setup();
    const initialValue = JSON.stringify([
      { attribute: 'color', option: { name: 'Red', slug: 'red' }, type: 'Button' },
      { attribute: 'size', option: null, type: 'Button' }
    ]);
    
    render(<Input {...mockProps} value={initialValue} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Find and click the Remove button
    const removeButtons = screen.getAllByText('Remove Variants');
    await user.click(removeButtons[0]);
    
    // onChange should be called with updated value
    expect(mockProps.onChange).toHaveBeenCalledWith({
      target: {
        name: 'variants',
        type: 'json',
        value: expect.stringContaining('size')
      }
    });
  });

  it('should handle attribute selection', async () => {
    const user = userEvent.setup();
    render(<Input {...mockProps} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Select an attribute
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'color');
    
    // Should show the second dropdown for options
    await waitFor(() => {
      const selects = screen.getAllByRole('combobox');
      expect(selects).toHaveLength(2); // attribute select + option select
    });
  });

  it('should handle option selection and call onChange', async () => {
    const user = userEvent.setup();
    const initialValue = JSON.stringify([
      { attribute: 'color', option: null, type: 'Button' }
    ]);
    
    render(<Input {...mockProps} value={initialValue} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Select an option
    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[1], 'red');
    
    // onChange should be called
    expect(mockProps.onChange).toHaveBeenCalledWith({
      target: {
        name: 'variants',
        type: 'json',
        value: expect.any(String)
      }
    });
  });

  it('should handle API errors gracefully', async () => {
    // Mock console.log to verify error handling
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    fetch.mockRejectedValueOnce(new Error('API Error'));
    
    render(<Input {...mockProps} />);
    
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('API Error');
    });
    
    consoleLogSpy.mockRestore();
  });

  it('should handle invalid JSON value gracefully', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<Input {...mockProps} value="invalid-json" />);
    
    expect(consoleLogSpy).toHaveBeenCalledWith('Invalid JSON:', expect.any(Error));
    
    consoleLogSpy.mockRestore();
  });

  it('should disable Add button when all options are used', async () => {
    const initialValue = JSON.stringify([
      { attribute: 'color', option: { name: 'Red', slug: 'red' }, type: 'Button' },
      { attribute: 'size', option: { name: 'Small', slug: 'small' }, type: 'Button' }
    ]);
    
    render(<Input {...mockProps} value={initialValue} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Add button should be disabled when all options are used
    const addButton = screen.getByText('Add Variants');
    expect(addButton).toBeDisabled();
  });
});