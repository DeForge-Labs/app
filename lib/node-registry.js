// Use the provided JSON data
export const nodeRegistry = [
  {
    title: "Number",
    category: "input",
    type: "num_var",
    icon: {
      type: "",
      content: "",
    },
    desc: "Number variable",
    inputs: [],
    outputs: [
      {
        desc: "",
        name: "Number",
        type: "Number",
      },
    ],
    fields: [
      {
        desc: "",
        name: "Number",
        type: "Number",
        value: 0,
      },
    ],
    diff: "easy",
    tags: ["int", "float", "number"],
  },
  {
    title: "User Input",
    category: "input",
    type: "str_var",
    icon: {
      type: "",
      content: "",
    },
    desc: "String input from users",
    inputs: [],
    outputs: [
      {
        desc: "",
        name: "Text",
        type: "Text",
      },
    ],
    fields: [
      {
        desc: "",
        name: "Text",
        type: "Text",
        value: "Enter text here...",
      },
    ],
    diff: "easy",
    tags: ["str", "text", "user", "input"],
  },
  {
    title: "API Call",
    category: "processing",
    type: "api_node",
    icon: {
      type: "",
      content: "",
    },
    desc: "call external API",
    inputs: [
      {
        desc: "The endpoint of the API",
        name: "endpoint",
        type: "Text",
      },
      {
        desc: "The body of the API",
        name: "body",
        type: "JSON",
      },
      {
        desc: "The headers of the API",
        name: "headers",
        type: "JSON",
      },
    ],
    outputs: [
      {
        desc: "The response of the API",
        name: "output",
        type: "Text",
      },
    ],
    fields: [
      {
        desc: "The method of the API",
        name: "method",
        type: "select",
        value: "GET",
        options: ["GET", "POST", "PUT", "DELETE"],
      },
      {
        desc: "The endpoint of the API",
        name: "endpoint",
        type: "Text",
        value: "endpoint...",
      },
      {
        desc: "The body of the API",
        name: "body",
        type: "Map",
        value: "Enter body here...",
      },
      {
        desc: "The headers of the API",
        name: "headers",
        type: "Map",
        value: "Enter headers here...",
      },
      {
        desc: "Api Key of Telegram Bot",
        name: "TG_API_KEY",
        type: "env",
        defaultValue: "eydnfnuani...",
      },
    ],
    diff: "hard",
    tags: ["api", "http", "external"],
  },
  {
    title: "Map Variable",
    category: "input",
    type: "map_var",
    icon: {
      type: "",
      content: "",
    },
    desc: "Map variable",
    inputs: [],
    outputs: [
      {
        desc: "The map of the variable",
        name: "Map",
        type: "JSON",
      },
    ],
    fields: [
      {
        desc: "The map of the variable",
        name: "Map",
        type: "Map",
        value: {},
      },
    ],
    diff: "medium",
    tags: ["map", "object", "variable"],
  },
];

// Helper function to get a node type by its type ID
export function getNodeTypeByType(type) {
  return nodeRegistry.find((node) => node.type === type);
}

// Helper function to get default data for a node type
export function getDefaultDataForNodeType(type) {
  const nodeType = getNodeTypeByType(type);

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
