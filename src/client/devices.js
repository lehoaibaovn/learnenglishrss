const size = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
};

export const devicesSizeNum = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const devices = {
  sm: `(min-width: ${size.sm})`,
  md: `(min-width: ${size.md})`,
  lg: `(min-width: ${size.lg})`,
  xl: `(min-width: ${size.xl})`,
  maxmd: `(max-width: ${devicesSizeNum.md-1}px)`,
};
