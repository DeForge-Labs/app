const colorProfile = [
  {
    type: "text",
    color: "blue",
  },
  {
    type: "number",
    color: "green",
  },
  {
    type: "json",
    color: "black",
  },
  {
    type: "boolean",
    color: "red",
  },
  {
    type: "flow",
    color: "purple",
  },
  {
    type: "date",
    color: "orange",
  },
  {
    type: "rag",
    color: "cyan",
  },
];

const getColorByType = (type) => {
  const color = colorProfile.find((color) => color.type === type);
  return color ? color.color : "gray";
};

export default getColorByType;
