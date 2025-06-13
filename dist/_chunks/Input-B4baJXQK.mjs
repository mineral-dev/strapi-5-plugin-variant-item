import { jsxs, jsx } from "react/jsx-runtime";
import { Flex, Typography, SingleSelect, SingleSelectOption, Combobox, ComboboxOption, Button } from "@strapi/design-system";
import { useState, useEffect, useCallback } from "react";
const Input = (props) => {
  const {
    attribute,
    error,
    description,
    label,
    labelAction,
    name,
    onChange,
    required,
    value,
    disabled
  } = props;
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState(() => {
    if (value === "null" || !value || value === void 0) {
      return [{ attribute: null, option: null, type: "Button" }];
    }
    try {
      return typeof value === "string" ? JSON.parse(value) : value;
    } catch (error2) {
      console.log("Invalid JSON:", error2);
      return [{ attribute: null, option: null, type: "Button" }];
    }
  });
  const getAttributes = async () => {
    try {
      const response = await fetch("/api/variant-item-strapi/get-attribute-products", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`
        }
      });
      const data = await response.json();
      setOptions(data);
    } catch (error2) {
      console.log(error2.message);
    }
  };
  useEffect(() => {
    getAttributes();
  }, [value]);
  const handleChangeAttributes = useCallback((e, key) => {
    let types = options?.filter((item) => item?.slug === e).map((item) => item.type);
    let map = {
      ...result[key],
      attribute: e,
      option: null,
      type: types.length > 0 ? types[0] : "Button"
    };
    const res = result.map((item, i) => {
      if (i == key) {
        return map;
      } else {
        return item;
      }
    });
    setResult(res);
  }, [result, options, value]);
  const handleChange = useCallback((e, key) => {
    if (options.length === 0 || result.length == 0) return;
    const find_data = options.flatMap((item) => item.items).find((variant) => variant?.slug == e);
    if (!find_data) return;
    const res = result.map((item, i) => {
      if (i == key) {
        return {
          attribute: item.attribute,
          type: item.type,
          option: {
            name: find_data?.title,
            slug: find_data?.slug,
            color: find_data?.color,
            thumbnail: find_data?.thumbnail?.data
          }
        };
      } else {
        return item;
      }
    });
    setResult(res);
    onChange({
      target: { name, type: attribute.type, value: JSON.stringify(res) }
    });
  }, [result, options, value]);
  const addOptions = () => {
    setResult([...result, { attribute: null, option: null, type: "Button" }]);
  };
  const removeOptions = (key) => {
    const response = result.filter((item, i) => i != key);
    setResult(response);
    onChange({
      target: { name, type: attribute.type, value: JSON.stringify(response) }
    });
  };
  return /* @__PURE__ */ jsxs(Flex, { direction: "column", gap: 1, alignItems: "start", children: [
    /* @__PURE__ */ jsxs(Typography, { variant: "pi", children: [
      label,
      " ",
      /* @__PURE__ */ jsx("span", { className: "kKpydp", children: "*" })
    ] }),
    result && result.length > 0 && result.map((res, key) => /* @__PURE__ */ jsxs(
      Flex,
      {
        gap: 4,
        style: {
          paddingBottom: 8,
          width: "100%"
        },
        children: [
          /* @__PURE__ */ jsx(
            Flex,
            {
              direction: "column",
              alignItems: "stretch",
              gap: 4,
              style: {
                flex: "1 1 auto"
              },
              children: /* @__PURE__ */ jsx(SingleSelect, { id: res?.attribute, label: "Options", value: res?.attribute, onChange: (e) => handleChangeAttributes(e, key), required: required ? required.toString() : "false", error, children: options && options.length > 0 && options.map((item, i) => /* @__PURE__ */ jsx(SingleSelectOption, { value: item?.slug, children: item?.title }, i)) })
            }
          ),
          res?.attribute && /* @__PURE__ */ jsx(
            Flex,
            {
              direction: "column",
              alignItems: "stretch",
              gap: 11,
              style: {
                flex: "1 1 auto"
              },
              children: /* @__PURE__ */ jsx(Combobox, { label: "terms", value: res?.option?.slug, onChange: (e) => handleChange(e, key), required: required ? required.toString() : "false", error, children: options?.length > 0 && options.find((op) => op?.slug?.toLowerCase() === res?.attribute?.toLowerCase())?.items?.map((variant, va) => /* @__PURE__ */ jsx(ComboboxOption, { value: variant?.slug, children: variant?.title }, va)) })
            }
          ),
          /* @__PURE__ */ jsxs(Flex, { direction: "column", alignItems: "stretch", gap: 11, children: [
            result?.length > 1 && /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: () => removeOptions(key),
                variant: "danger-light",
                children: [
                  "Remove ",
                  label
                ]
              }
            ),
            result?.length < options?.length && key + 1 == result?.length && /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: addOptions,
                variant: "secondary",
                disabled: result?.length == options?.length,
                style: {
                  marginLeft: 16
                },
                children: [
                  "Add ",
                  label
                ]
              }
            )
          ] })
        ]
      },
      `box-${key}`
    ))
  ] }, value);
};
export {
  Input as default
};
