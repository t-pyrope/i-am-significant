export const getAspectedPlanetName = (planetName: string) => {
  return planetName === "господствующий" ? "Асцендент" : planetName;
};

export const getAscendantPlanetName = (
  houses: { house: number; sign: string }[],
): string => {
  const ascendantHouse = houses.find((h) => h.house === 1);

  return ascendantHouse?.sign ?? "";
};
