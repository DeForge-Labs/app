export const nodeRegistry = [
  {
    title: "User Input",
    category: "Input",
    type: "inputNode",
    desc: "Collect string input from users",
    inputs: [],
    outputs: [{ name: "output", type: "string" }],
    fields: {
      value: { type: "string", default: "" },
      label: { type: "string", default: "User Input" },
    },
    diff: "easy",
    tags: ["input", "user", "text"],
  },
  {
    title: "Function",
    category: "Processing",
    type: "functionNode",
    desc: "Process data with custom logic",
    inputs: [{ name: "input", type: "any" }],
    outputs: [{ name: "output", type: "any" }],
    fields: {
      code: { type: "code", default: "return input;" },
      label: { type: "string", default: "Function" },
    },
    diff: "medium",
    tags: ["code", "function", "transform"],
  },
  {
    title: "API Output",
    category: "Output",
    type: "apiNode",
    desc: "Send data to external API",
    inputs: [{ name: "input", type: "any" }],
    outputs: [],
    fields: {
      endpoint: { type: "string", default: "" },
      method: {
        type: "select",
        options: ["GET", "POST", "PUT", "DELETE"],
        default: "GET",
      },
      label: { type: "string", default: "API Output" },
    },
    diff: "medium",
    tags: ["api", "http", "external"],
  },
  {
    title: "Database Query",
    category: "Data",
    type: "databaseNode",
    desc: "Query a database",
    inputs: [{ name: "params", type: "object" }],
    outputs: [{ name: "results", type: "array" }],
    fields: {
      query: { type: "code", default: "SELECT * FROM users" },
      connection: { type: "string", default: "" },
      label: { type: "string", default: "Database Query" },
    },
    diff: "hard",
    tags: ["database", "sql", "query"],
  },
  {
    title: "AI Completion",
    category: "AI",
    type: "aiNode",
    desc: "Generate text with AI",
    inputs: [{ name: "prompt", type: "string" }],
    outputs: [{ name: "completion", type: "string" }],
    fields: {
      model: {
        type: "select",
        options: ["gpt-4", "gpt-3.5-turbo"],
        default: "gpt-3.5-turbo",
      },
      temperature: { type: "number", default: 0.7 },
      label: { type: "string", default: "AI Completion" },
    },
    diff: "medium",
    tags: ["ai", "nlp", "text"],
  },
  {
    title: "Math Operation",
    category: "Processing",
    type: "mathNode",
    desc: "Perform math operations",
    inputs: [
      { name: "a", type: "number" },
      { name: "b", type: "number" },
    ],
    outputs: [{ name: "result", type: "number" }],
    fields: {
      operation: {
        type: "select",
        options: ["+", "-", "*", "/"],
        default: "+",
      },
      label: { type: "string", default: "Math Operation" },
    },
    diff: "easy",
    tags: ["math", "calculation", "number"],
  },
  {
    title: "Text Template",
    category: "Processing",
    type: "templateNode",
    desc: "Format text with variables",
    inputs: [{ name: "variables", type: "object" }],
    outputs: [{ name: "text", type: "string" }],
    fields: {
      template: { type: "text", default: "Hello, {{name}}!" },
      label: { type: "string", default: "Text Template" },
    },
    diff: "easy",
    tags: ["text", "template", "format"],
  },
];

// Helper function to get a node type by its type ID
export function getNodeTypeByType(type) {
  return nodeRegistry.find((node) => node.type === type);
}

// Helper function to get default data for a node type
export function getDefaultDataForNodeType(type) {
  const nodeType = getNodeTypeByType(type);

  if (!nodeType || !nodeType.fields) {
    return { label: type };
  }

  const defaultData = {};

  // Extract default values from the node definition
  Object.entries(nodeType.fields).forEach(([key, field]) => {
    defaultData[key] = field.default;
  });

  return defaultData;
}
