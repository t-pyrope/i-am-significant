export const getAspectedPlanetName = (planetName: string) => {
  return planetName === "господствующий" ? "Асцендент" : planetName;
};

export const getAscendantPlanetName = (
  houses: { house: number; sign: string }[],
): string => {
  const ascendantHouse = houses.find((h) => h.house === 1);

  return ascendantHouse?.sign ?? "";
};

export const getPrepositionalCase = (zodiacName: string) => {
  switch (zodiacName) {
    case "Овен":
      return "Овне";
    case "Телец":
      return "Тельце";
    case "Близнецы":
      return "Близнецах";
    case "Рак":
      return "Раке";
    case "Лев":
      return "Льве";
    case "Дева":
      return "Деве";
    case "Весы":
      return "Весах";
    case "Скорпион":
      return "Скорпионе";
    case "Стрелец":
      return "Стрельце";
    case "Козерог":
      return "Козероге";
    case "Водолей":
      return "Водолее";
    case "Рыбы":
      return "Рыбах";
    default:
      return zodiacName;
  }
};

export const getZodiacSymbolImageSrc = (sign_id: number) => {
  switch (sign_id) {
    case 1:
      return "/zodiac/aries.png";
    case 2:
      return "/zodiac/taurus.png";
    case 3:
      return "/zodiac/gemini.png";
    case 4:
      return "/zodiac/cancer.png";
    case 5:
      return "/zodiac/leo.png";
    case 6:
      return "/zodiac/virgo.png";
    case 7:
      return "/zodiac/libra.png";
    case 8:
      return "/zodiac/scorpio.png";
    case 9:
      return "/zodiac/sagittarius.png";
    case 10:
      return "/zodiac/capricorn.png";
    case 11:
      return "/zodiac/aquarius.png";
    case 12:
      return "/zodiac/pisces.png";
    default:
      return "";
  }
};

export const getNominativeCase = (zodiacName: string) => {
  switch (zodiacName) {
    case "Овне":
      return "Овен";
    case "Тельце":
      return "Телец";
    case "Близнецах":
      return "Близнецы";
    case "Раке":
      return "Рак";
    case "Льве":
      return "Лев";
    case "Деве":
      return "Дева";
    case "Весах":
      return "Весы";
    case "Скорпионе":
      return "Скорпион";
    case "Стрельце":
      return "Стрелец";
    case "Козероге":
      return "Козерог";
    case "Водолее":
      return "Водолей";
    case "Рыбах":
      return "Рыбы";
    default:
      return zodiacName;
  }
};
