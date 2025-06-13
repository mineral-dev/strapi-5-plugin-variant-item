import { render } from '@testing-library/react';
import { DesignSystemProvider, lightTheme } from '@strapi/design-system';
import { IntlProvider } from 'react-intl';

// Custom render function that includes necessary providers
export const renderWithProviders = (ui, options = {}) => {
  const AllTheProviders = ({ children }) => (
    <IntlProvider locale="en" messages={{}}>
      <DesignSystemProvider theme={lightTheme}>
        {children}
      </DesignSystemProvider>
    </IntlProvider>
  );

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';