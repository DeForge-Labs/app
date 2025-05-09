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
    title: "Object Variable",
    category: "input",
    type: "obj_var",
    icon: {
      type: "",
      content: "",
    },
    desc: "Object variable",
    inputs: [
      {
        desc: "The key of the object",
        name: "key",
        type: "Text",
      },
      {
        desc: "The value of the object",
        name: "value",
        type: "Text",
      },
    ],
    outputs: [
      {
        desc: "The object of the variable",
        name: "Object",
        type: "JSON",
      },
    ],
    fields: [
      {
        desc: "The key of the object",
        name: "key",
        type: "Text",
        value: "key...",
      },
      {
        desc: "The value of the object",
        name: "value",
        type: "Text",
        value: "value...",
      },
    ],
    diff: "medium",
    tags: ["object", "variable"],
  },
  {
    title: "Objects To Map",
    category: "processing",
    type: "obj_to_map",
    icon: {
      type: "",
      content: "",
    },
    desc: "Convert object to map",
    inputs: [
      {
        desc: "Objects to convert",
        name: "objects",
        type: "JSON[]",
      },
    ],
    outputs: [
      {
        desc: "The map of the objects",
        name: "map",
        type: "JSON",
      },
    ],
    fields: [
      {
        desc: "Objects to convert",
        name: "objects",
        type: "JSON[]",
        value: "[]",
      },
    ],
    diff: "medium",
    tags: ["object", "map"],
  },
];

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
