const bootstrap = ({ strapi }) => {
};
const destroy = ({ strapi }) => {
};
const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "variants",
    plugin: "strapi-5-plugin-variant-item",
    type: "json"
  });
};
const config = {
  default: {},
  validator() {
  }
};
const contentTypes = {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
const controller = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi.plugin("strapi-5-plugin-variant-item").service("service").getWelcomeMessage();
  },
  async attributeProducts(ctx) {
    try {
      ctx.body = await strapi.plugin("strapi-5-plugin-variant-item").service("service").getAttributeProducts();
    } catch (error) {
      ctx.body = error.message;
    }
  }
});
var controller_1 = controller;
const controller$1 = /* @__PURE__ */ getDefaultExportFromCjs(controller_1);
const controllers = {
  controller: controller$1
};
const middlewares = {};
const policies = {};
const contentAPIRoutes = [
  {
    method: "GET",
    path: "/",
    // name of the controller file & the method.
    handler: "controller.index",
    config: {
      policies: []
    }
  },
  {
    method: "GET",
    path: "/get-attribute-products",
    // name of the controller file & the method.
    handler: "controller.attributeProducts",
    config: {
      auth: false,
      policies: []
    }
  }
];
const routes = {
  "content-api": {
    type: "content-api",
    routes: contentAPIRoutes
  }
};
const service = ({ strapi }) => ({
  getWelcomeMessage() {
    return "Welcome to Strapi 🚀";
  },
  async getAttributeProducts() {
    let result = [];
    try {
      const entry = await strapi.documents("api::attribute-product.attribute-product").findMany({
        fields: ["title", "slug", "Type"],
        populate: {
          terms_products: {
            fields: ["title", "slug"],
            populate: {
              thumbnail: {
                populate: "*"
              }
            }
          }
        }
      });
      if (entry.length > 0) {
        result = entry.map((item) => ({
          title: item.title,
          slug: item.slug,
          type: item.Type,
          items: item.terms_products.map((term) => ({
            title: term.title,
            slug: term.slug
          }))
        }));
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  }
});
var service_1 = service;
const service$1 = /* @__PURE__ */ getDefaultExportFromCjs(service_1);
const services = {
  service: service$1
};
const index = {
  bootstrap,
  destroy,
  register,
  config,
  controllers,
  contentTypes,
  middlewares,
  policies,
  routes,
  services
};
export {
  index as default
};
