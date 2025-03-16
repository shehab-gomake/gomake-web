const groupNameInput = (state: any, agentsCategories: string[]) => {
  return [
    {
      name: "groupName",
      label: "",
      type: "text",
      placeholder: "mailingSettings.groupName",
      required: false,
      parameterKey: "name",
      options: [],
      value: state?.name,
      isValid: true,
    },
    {
      name: "agent",
      //label: "sales.quote.agent",
      label: "",
      type: "select",
      placeholder: "customers.selectAgent",
      required: false,
      parameterKey: "agentId",
      options: agentsCategories?.map((agent) => ({
        value: agent?.id,
        text: agent?.label,
      })),
      value: state?.agentId,
      isValid: true,
    },
  ];
};

export { groupNameInput };
