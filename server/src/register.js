const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "variants",
    plugin: "strapi-5-plugin-variant-item",
    type: "json",
  });
};

export default register;
