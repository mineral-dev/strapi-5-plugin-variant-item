"use strict";

import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { PLUGIN_ID } from './pluginId';

export default {
  register(app) {
    // app.addMenuLink({
    //   to: `plugins/${PluginIcon}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${PLUGIN_ID}.plugin.name`,
    //     defaultMessage: PLUGIN_ID,
    //   },
    //   Component: async () => {
    //     const { App } = await import('./pages/App');

    //     return App;
    //   },
    // });

    app.customFields.register({
      name: "variants",
      pluginId: "strapi-5-plugin-variant-item",
      type: "json",
      intlLabel: {
        id: "variant-item.strapi.option.label",
        defaultMessage: "Variant Product",
      },
      intlDescription: {
        id: "variant-item.strapi.option.description",
        defaultMessage: "Description Variant Option",
      },
      icon: PluginIcon, // below in the article the code of that component
      components: {
        Input: async () => import("./components/Input") // below in the article the code of that component,
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'strapi-5-plugin-variant-item.options.advanced.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'strapi-5-plugin-variant-item.options.advanced.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ]
      }
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
