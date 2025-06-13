const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('strapi-5-plugin-variant-item')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  async attributeProducts(ctx) {
    try {
      ctx.body = await strapi
        .plugin('strapi-5-plugin-variant-item')
        .service('service')
        .getAttributeProducts();
    } catch (error) {
      ctx.body = error.message;
    }
  },
});

module.exports = controller;
