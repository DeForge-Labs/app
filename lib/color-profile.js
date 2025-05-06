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
    color: "red",
  },
];

const getColorByType = (type) => {
  const color = colorProfile.find((color) => color.type === type);
  return color ? color.color : "gray";
};

export default getColorByType;
