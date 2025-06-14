import {
   Button,
   Combobox,
   ComboboxOption,
   Flex,
   SingleSelect,
   SingleSelectOption,
   Typography
} from '@strapi/design-system';
import { useCallback, useEffect, useState } from 'react';

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
   } = props
   const [ options, setOptions ] = useState([])
   const [ result, setResult ] = useState(() => {
      if (value === 'null' || !value || value === undefined) {
         return [{ attribute: null, option: null, type: 'Button' }];
      }
    
      try {
         return typeof value === 'string' ? JSON.parse(value) : value;
      } catch (error) {
         console.log("Invalid JSON:", error);
         return [{ attribute: null, option: null, type: 'Button' }];
      }
   })

   const getAttributes = async () => {
      try {
         const response = await fetch("/api/strapi-5-plugin-variant-item/get-attribute-products", {
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            }
         });
         const data = await response.json();
         setOptions(data)
      } catch (error) {
         console.log(error.message);
      }
   }

   useEffect(() => {
      getAttributes();
   }, [ value ]);

   const handleChangeAttributes = useCallback((e, key) => {
      let types = options?.filter((item)=> item?.slug === e ).map((item)=>item.type)
      let map = {
         ...result[key],
         attribute: e,
         option: null,
         type: types.length >  0 ? types[0] : 'Button'
      }

      const res = result.map((item, i)=> {
         if (i == key) {
            return map
         }else{
            return item
         }
      })
      
      setResult(res)
   },[result, options, value]);

   const handleChange = useCallback((e, key) => {
      // const value = JSON.parse(e)
      if (options.length === 0 || result.length == 0) return;
      const find_data = options.flatMap((item)=> item.items).find((variant)=> variant?.slug == e)
      if (!find_data ) return;
      const res = result.map((item, i)=> {
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
            }
         }else{
            return item
         }
      })
      setResult(res)
      onChange({
         target: { name, type: attribute.type, value: JSON.stringify(res) },
      });
   },[result, options, value])

   const addOptions = () => {
      setResult([ ...result, { attribute: null, option: null, type: 'Button' }])
   }

   const removeOptions = (key) => {
      const response = result.filter((item, i)=> i != key)
      setResult(response)
      onChange({
         target: { name, type: attribute.type, value: JSON.stringify(response) },
      });
   }

   return (
      <Flex key={value} direction="column" gap={1} alignItems="start">
         <Typography variant="pi">{label} <span className='kKpydp'>*</span></Typography>
         {
            (result && result.length > 0) &&
            result.map((res, key)=> (
               <Flex
                  key={`box-${key}`}
                  gap={4}
                  style={{
                     paddingBottom: 8,
                     width: '100%',

                  }}
               >
                  <Flex
                     direction="column"
                     alignItems="stretch"
                     gap={4}
                     style={{
                        flex: '1 1 auto',
                     }}
                  >
                     <SingleSelect id={res?.attribute} label="Options" value={res?.attribute} onChange={(e)=> handleChangeAttributes(e, key)} required={required ? required.toString() : "false"}  error={error}>
                        {
                           (options && options.length > 0) && options.map((item, i)=> (
                              <SingleSelectOption key={i} value={item?.slug}>{item?.title}</SingleSelectOption>
                           ))
                        }
                     </SingleSelect>
                  </Flex>
                  {
                     res?.attribute &&
                     <Flex 
                        direction="column"
                        alignItems="stretch"
                        gap={11} 
                        style={{
                           flex: '1 1 auto',
                        }}
                     >
                        <Combobox label="terms" value={res?.option?.slug}  onChange={(e)=> handleChange(e, key)} required={required ? required.toString() : "false"}  error={error}>
                        {options?.length > 0 &&
                           options
                              .find((op) => op?.slug?.toLowerCase() === res?.attribute?.toLowerCase())
                              ?.items?.map((variant, va) => (
                                 <ComboboxOption key={va} value={variant?.slug}>
                                    {variant?.title}
                                 </ComboboxOption>
                              ))}
                        </Combobox>
                     </Flex>
                  }
                  <Flex direction="column" alignItems="stretch" gap={11}>
                  {
                        result?.length > 1 &&
                        <Button
                           onClick={()=>removeOptions(key)}
                           variant="danger-light"
                        >
                           Remove {label}
                        </Button>
                     }
                     {
                        (result?.length < options?.length && key+1 == result?.length ) &&
                        <Button
                           onClick={addOptions}
                           variant="secondary"
                           disabled={ result?.length == options?.length }
                           style={{
                              marginLeft: 16,
                           }}
                        >
                           Add {label}
                        </Button>
                     }
                  </Flex>
               </Flex>
            ))
         }
      </Flex>
   );
};

export default Input;
