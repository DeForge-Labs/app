// Helper function to get a node type by its type ID
export function getNodeTypeByType(type, nodeRegistry) {
  return nodeRegistry.find((node) => node.type === type);
}

// Helper function to get default data for a node type
export function getDefaultDataForNodeType(type, nodeRegistry) {
  const nodeType = getNodeTypeByType(type, nodeRegistry);

  if (!nodeType) {
    return { label: type };
  }

  const defaultData = {
    label: nodeType.title,
  };

  // Extract default values from the node definition
  nodeType.fields.forEach((field) => {
    defaultData[field.name] = field.value;
  });

  return defaultData;
}

// Get category colors for styling
export function getCategoryColor(category) {
  const colors = {
    input: "primary",
    processing: "indigo-500",
    output: "green-500",
    test: "amber-500",
    default: "gray-500",
  };

  return colors[category] || colors.default;
}

export function isArrayType(type) {
  return type.endsWith("[]");
}
