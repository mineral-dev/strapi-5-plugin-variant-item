const service = require('../service');

describe('Service', () => {
  // Mock strapi object
  const mockStrapi = {
    documents: jest.fn()
  };

  // Create service instance with mocked strapi
  const serviceInstance = service({ strapi: mockStrapi });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWelcomeMessage', () => {
    it('should return welcome message', () => {
      const result = serviceInstance.getWelcomeMessage();
      expect(result).toBe('Welcome to Strapi 🚀');
    });
  });

  describe('getAttributeProducts', () => {
    it('should return formatted attribute products', async () => {
      // Mock the findMany response
      const mockData = [
        {
          title: 'Color',
          slug: 'color',
          Type: 'Button',
          terms_products: [
            {
              title: 'Red',
              slug: 'red',
              thumbnail: { url: '/uploads/red.jpg' }
            },
            {
              title: 'Blue',
              slug: 'blue',
              thumbnail: { url: '/uploads/blue.jpg' }
            }
          ]
        },
        {
          title: 'Size',
          slug: 'size',
          Type: 'Select',
          terms_products: [
            {
              title: 'Small',
              slug: 'small',
              thumbnail: null
            },
            {
              title: 'Large',
              slug: 'large',
              thumbnail: null
            }
          ]
        }
      ];

      mockStrapi.documents.mockReturnValue({
        findMany: jest.fn().mockResolvedValue(mockData)
      });

      const result = await serviceInstance.getAttributeProducts();

      // Verify the strapi call
      expect(mockStrapi.documents).toHaveBeenCalledWith('api::attribute-product.attribute-product');
      expect(mockStrapi.documents().findMany).toHaveBeenCalledWith({
        fields: ["title", "slug", "Type"],
        populate: {
          terms_products: {
            fields: ["title", "slug"],
            populate: {
              thumbnail: {
                populate: "*"
              }
            }
          },
        }
      });

      // Verify the result format
      expect(result).toEqual([
        {
          title: 'Color',
          slug: 'color',
          type: 'Button',
          items: [
            { title: 'Red', slug: 'red' },
            { title: 'Blue', slug: 'blue' }
          ]
        },
        {
          title: 'Size',
          slug: 'size',
          type: 'Select',
          items: [
            { title: 'Small', slug: 'small' },
            { title: 'Large', slug: 'large' }
          ]
        }
      ]);
    });

    it('should return empty array when no data found', async () => {
      mockStrapi.documents.mockReturnValue({
        findMany: jest.fn().mockResolvedValue([])
      });

      const result = await serviceInstance.getAttributeProducts();

      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      // Mock console.log to verify error handling
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const error = new Error('Database error');
      mockStrapi.documents.mockReturnValue({
        findMany: jest.fn().mockRejectedValue(error)
      });

      const result = await serviceInstance.getAttributeProducts();

      expect(consoleLogSpy).toHaveBeenCalledWith(error);
      expect(result).toEqual([]);

      consoleLogSpy.mockRestore();
    });

    it('should handle missing terms_products gracefully', async () => {
      const mockData = [
        {
          title: 'Color',
          slug: 'color',
          Type: 'Button',
          terms_products: null // or undefined
        }
      ];

      mockStrapi.documents.mockReturnValue({
        findMany: jest.fn().mockResolvedValue(mockData)
      });

      // This should not throw an error
      await expect(serviceInstance.getAttributeProducts()).resolves.not.toThrow();
    });
  });
});