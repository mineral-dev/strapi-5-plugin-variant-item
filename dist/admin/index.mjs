import { useRef, useEffect } from "react";
import { jsxs, jsx } from "react/jsx-runtime";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
const PLUGIN_ID = "variant-item-strapi";
const Initializer = ({ setPlugin }) => {
  const ref = useRef(setPlugin);
  useEffect(() => {
    ref.current(PLUGIN_ID);
  }, []);
  return null;
};
const PluginIcon = () => /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", width: "16", height: "16", class: "sc-FEMpB kUwfj", children: [
  /* @__PURE__ */ jsx("rect", { width: "31", height: "23", x: "0.5", y: "4.5", fill: "#F6ECFC", stroke: "#E0C1F4", rx: "2.5" }),
  /* @__PURE__ */ jsx("path", { fill: "#9736E8", d: "M12.75 12a.75.75 0 0 1 .75-.75h8a.75.75 0 1 1 0 1.5h-8a.75.75 0 0 1-.75-.75m8.75 3.25h-8a.75.75 0 1 0 0 1.5h8a.75.75 0 1 0 0-1.5m0 4h-8a.75.75 0 1 0 0 1.5h8a.75.75 0 1 0 0-1.5M10.75 15a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0-4a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2" })
] });
const index = {
  register(app) {
    app.customFields.register({
      name: "variants",
      pluginId: "variant-item-strapi",
      type: "json",
      intlLabel: {
        id: "variant-item.strapi.option.label",
        defaultMessage: "Variant Product"
      },
      intlDescription: {
        id: "variant-item.strapi.option.description",
        defaultMessage: "Description Variant Option"
      },
      icon: PluginIcon,
      // below in the article the code of that component
      components: {
        Input: async () => import("../_chunks/Input-B4baJXQK.mjs")
        // below in the article the code of that component,
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: "global.settings",
              defaultMessage: "Settings"
            },
            items: [
              {
                name: "required",
                type: "checkbox",
                intlLabel: {
                  id: "variant-item-strapi.options.advanced.requiredField",
                  defaultMessage: "Required field"
                },
                description: {
                  id: "variant-item-strapi.options.advanced.requiredField.description",
                  defaultMessage: "You won't be able to create an entry if this field is empty"
                }
              }
            ]
          }
        ]
      }
    });
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID
    });
  },
  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./translations/en.json": () => import("../_chunks/en-Byx4XI2L.mjs") }), `./translations/${locale}.json`, 3);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  }
};
export {
  index as default
};
