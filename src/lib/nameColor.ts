export const getNameColor = (performance: number): string => {
  if (performance < 400) return "#808080"
  else if (performance < 800) return "#804000"
  else if (performance < 1200) return "#008000"
  else if (performance < 1600) return "#00c0c0"
  else if (performance < 2000) return "#0000ff"
  else if (performance < 2400) return "#c0c000"
  else if (performance < 2800) return "#ff8000"
  else return "#ff0000"
}
