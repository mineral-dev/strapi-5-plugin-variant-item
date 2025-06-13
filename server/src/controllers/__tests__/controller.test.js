const controller = require('../controller');

describe('Controller', () => {
  // Mock strapi object with plugin structure
  const mockService = {
    getWelcomeMessage: jest.fn(),
    getAttributeProducts: jest.fn()
  };

  const mockStrapi = {
    plugin: jest.fn(() => ({
      service: jest.fn(() => mockService)
    }))
  };

  // Mock context object
  const mockCtx = {
    body: null
  };

  // Create controller instance with mocked strapi
  const controllerInstance = controller({ strapi: mockStrapi });

  beforeEach(() => {
    jest.clearAllMocks();
    mockCtx.body = null;
  });

  describe('index', () => {
    it('should set welcome message in context body', () => {
      const welcomeMessage = 'Welcome to Strapi 🚀';
      mockService.getWelcomeMessage.mockReturnValue(welcomeMessage);

      controllerInstance.index(mockCtx);

      expect(mockStrapi.plugin).toHaveBeenCalledWith('strapi-5-plugin-variant-item');
      expect(mockService.getWelcomeMessage).toHaveBeenCalled();
      expect(mockCtx.body).toBe(welcomeMessage);
    });
  });

  describe('attributeProducts', () => {
    it('should set attribute products in context body', async () => {
      const mockProducts = [
        {
          title: 'Color',
          slug: 'color',
          type: 'Button',
          items: [
            { title: 'Red', slug: 'red' },
            { title: 'Blue', slug: 'blue' }
          ]
        }
      ];
      
      mockService.getAttributeProducts.mockResolvedValue(mockProducts);

      await controllerInstance.attributeProducts(mockCtx);

      expect(mockStrapi.plugin).toHaveBeenCalledWith('strapi-5-plugin-variant-item');
      expect(mockService.getAttributeProducts).toHaveBeenCalled();
      expect(mockCtx.body).toEqual(mockProducts);
    });

    it('should handle errors and set error message in context body', async () => {
      const errorMessage = 'Database connection failed';
      mockService.getAttributeProducts.mockRejectedValue(new Error(errorMessage));

      await controllerInstance.attributeProducts(mockCtx);

      expect(mockCtx.body).toBe(errorMessage);
    });

    it('should handle errors without message', async () => {
      const error = new Error();
      error.message = undefined;
      mockService.getAttributeProducts.mockRejectedValue(error);

      await controllerInstance.attributeProducts(mockCtx);

      expect(mockCtx.body).toBeUndefined();
    });
  });
});