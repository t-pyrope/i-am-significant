"use client";

import { NatalChartProps } from "../types";

const PLANET_SYMBOLS: Record<string, string> = {
  Солнце: "☉",
  Луна: "☽",
  Меркурий: "☿",
  Венера: "♀",
  Марс: "♂",
  Юпитер: "♃",
  Сатурн: "♄",
  Уран: "♅",
  Нептун: "♆",
  Плутон: "♇",
  Узел: "☊",
  Хирон: "⚷",
  "Часть удачи": "⊗",
  Lilith: "⚸",
};

const ZODIAC = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export function Chart({ planets, houses, size = 600 }: NatalChartProps) {
  const cx = 50;
  const cy = 50;

  // ASC = начало 1 дома.
  // В SVG угол 0° — справа, поэтому ASC специально
  // размещаем слева (180°).
  const asc = houses.find((h) => h.house === 1)?.degree ?? 0;

  const toSvgAngle = (degree: number) => degree - asc + 180;

  const point = (degree: number, radius: number) => {
    const angle = (toSvgAngle(degree) * Math.PI) / 180;

    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: size,
        aspectRatio: "1",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        {/* Фон */}
        <circle
          cx={cx}
          cy={cy}
          r="48"
          // fill="#fffdf7"
          stroke="#fff"
          strokeWidth="0.35"
        />

        {/* Кольцо знаков */}
        <circle
          cx={cx}
          cy={cy}
          r="39"
          fill="none"
          stroke="#fff"
          strokeWidth="0.3"
        />

        {/* Центральный круг */}
        <circle
          cx={cx}
          cy={cy}
          r="7"
          // fill="#fffdf7"
          stroke="#fff"
          strokeWidth="0.25"
        />

        {/* 12 секторов знаков */}
        {Array.from({ length: 12 }).map((_, i) => {
          const degree = i * 30;
          const a = point(degree, 39);
          const b = point(degree, 48);

          const label = point(degree + 15, 44);

          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#fff"
                strokeWidth="0.2"
              />

              <image
                href={`/zodiac-small/${ZODIAC[i]}.png`}
                x={label.x - 2.5}
                y={label.y - 2.5}
                width="4"
                height="4"
              />
            </g>
          );
        })}

        {/* Границы домов */}
        {houses.map((house) => {
          const inner = point(house.degree, 7);
          const outer = point(house.degree, 39);

          return (
            <line
              key={`line-${house.house}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#fff"
              strokeWidth="0.35"
            />
          );
        })}

        {/* Номера домов — посередине между cusp */}
        {houses.map((house, index) => {
          const next = houses[(index + 1) % houses.length];

          const start = house.degree;
          let end = next.degree;

          if (end <= start) end += 360;

          const middle = ((start + end) / 2) % 360;

          const pos = point(middle, 14);

          return (
            <text
              key={`number-${house.house}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="3.4"
              fill="#fff"
            >
              {house.house}
            </text>
          );
        })}

        {/* Планеты */}
        {planets.map((planet, index) => {
          const pos = point(planet.full_degree, 33);

          return (
            <text
              key={`${planet.name}-${index}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="5"
              fontFamily="serif"
              fill="#fff"
            >
              {PLANET_SYMBOLS[planet.name] ?? "●"}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
