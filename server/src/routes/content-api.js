export default [
  {
    method: 'GET',
    path: '/',
    // name of the controller file & the method.
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/get-attribute-products',
    // name of the controller file & the method.
    handler: 'controller.attributeProducts',
    config: {
      auth: false,
      policies: [],
    },
  },
];
