const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
  async getAttributeProducts() {
    let result = []

    try {
      const entry = await strapi.documents('api::attribute-product.attribute-product').findMany({
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

      if (entry.length > 0) {
        result = entry.map((item)=> ({
          title: item.title,
          slug: item.slug,
          type: item.Type,
          items: item.terms_products.map((term) => ({
            title: term.title,
            slug: term.slug
          }))
        }))
      }
    }  catch (error) { console.log(error) }

    return result;
  }
});

module.exports = service;
