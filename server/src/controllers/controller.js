const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('variant-item-strapi')
      // the name of the service file & the method.
      .service('service')
      .getWelcomeMessage();
  },
  async attributeProducts(ctx) {
    try {
      ctx.body = await strapi
        .plugin('variant-item-strapi')
        .service('service')
        .getAttributeProducts();
    } catch (error) {
      ctx.body = error.message;
    }
  },
});

export default controller;
