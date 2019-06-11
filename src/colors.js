import color from "color";

export default {
  ocean: "#27d0e2",

  text: "#6f6f6f",
  textLight: "#aaaaaa",

  border: "#e9e9e9",
  focus: "#1ea7fd",
  error: "#ea2e49",
  warning: "#ffac22",

  placeholder: "#d0d0d0",
  bg: "#fafafa",
};

export function opacity(c, op) {
  return color(c)
    .alpha(op)
    .string();
}

export function darken(c, n) {
  return color(c)
    .darken(n)
    .string();
}

export function lighten(c, n) {
  return color(c)
    .lighten(n)
    .string();
}
