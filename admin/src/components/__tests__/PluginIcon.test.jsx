import { render } from '@testing-library/react';
import { PluginIcon } from '../PluginIcon';

describe('PluginIcon Component', () => {
  it('should render the SVG icon', () => {
    const { container } = render(<PluginIcon />);
    
    // Check if SVG element is rendered
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    
    // Check SVG attributes
    expect(svgElement).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
    expect(svgElement).toHaveAttribute('viewBox', '0 0 32 32');
    expect(svgElement).toHaveAttribute('width', '16');
    expect(svgElement).toHaveAttribute('height', '16');
    
    // Check if it contains the expected elements
    const rectElement = container.querySelector('rect');
    expect(rectElement).toBeInTheDocument();
    
    const pathElement = container.querySelector('path');
    expect(pathElement).toBeInTheDocument();
  });
});