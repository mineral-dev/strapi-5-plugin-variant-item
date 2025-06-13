import { renderWithProviders as render, screen, waitFor } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

// Mock fetch for API calls
global.fetch = jest.fn();
// Mock localStorage with simpler approach
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mock-jwt-token'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  writable: true
});

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
        { slug: 'red', title: 'Red', thumbnail: null },
        { slug: 'blue', title: 'Blue', thumbnail: null }
      ]
    },
    {
      slug: 'size',
      title: 'Size', 
      type: 'Select',
      items: [
        { slug: 'small', title: 'Small', thumbnail: null },
        { slug: 'large', title: 'Large', thumbnail: null }
      ]
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the component with initial state', async () => {
    render(<Input {...mockProps} />);
    
    // Check if label is rendered
    expect(screen.getByText('Variants')).toBeInTheDocument();
    
    // Wait for API call to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/strapi-5-plugin-variant-item/get-attribute-products',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-jwt-token',
            'Content-Type': 'application/json'
          })
        })
      );
    });
  });

  it('should handle initial value properly', async () => {
    const initialValue = JSON.stringify([
      {
        attribute: 'color',
        option: ['red']
      }
    ]);
    
    render(<Input {...mockProps} value={initialValue} />);
    
    // Wait for data to load and component to update
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Component should render without errors
    expect(screen.getByText('Variants')).toBeInTheDocument();
  });

  it('should handle onChange when component mounts with value', async () => {
    const mockOnChange = jest.fn();
    const initialValue = JSON.stringify([
      {
        attribute: 'color',
        option: ['red']
      }
    ]);
    
    render(<Input {...mockProps} value={initialValue} onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Component should render without errors
    expect(screen.getByText('Variants')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    // Mock API error
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

  it('should handle empty value', () => {
    render(<Input {...mockProps} value="" />);
    
    // Should render without errors
    expect(screen.getByText('Variants')).toBeInTheDocument();
  });

  it('should handle API response without items', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });
    
    render(<Input {...mockProps} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Should render without errors
    expect(screen.getByText('Variants')).toBeInTheDocument();
  });

  it('should handle complex initial value with multiple attributes', async () => {
    const initialValue = JSON.stringify([
      { attribute: 'color', option: ['red', 'blue'] },
      { attribute: 'size', option: ['small'] }
    ]);
    
    render(<Input {...mockProps} value={initialValue} />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
    
    // Should render without errors with multiple variants
    expect(screen.getByText('Variants')).toBeInTheDocument();
    
    // Should have multiple Remove buttons (one for each variant)
    const removeButtons = screen.getAllByRole('button', { name: /remove variants/i });
    expect(removeButtons.length).toBe(2);
  });
});