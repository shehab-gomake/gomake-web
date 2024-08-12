

const managerInput = (state,managersOptions) => {
  return [
     {
       name: "selectedManagers",
       label: "sales.cart.mangers",
       type: "select",
       placeholder: "sales.cart.selectManger",
       required: false,
       parameterKey: "managerIds",
       options: managersOptions,
       value: state?.managerIds,
       multiple: true
      
   },
  ];
};

export { managerInput };
