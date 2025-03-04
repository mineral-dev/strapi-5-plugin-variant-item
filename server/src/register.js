const register = ({ strapi }) => {
  strapi.customFields.register({
    name: "variants",
    plugin: "variant-item-strapi",
    type: "json",
  });
};

export default register;
