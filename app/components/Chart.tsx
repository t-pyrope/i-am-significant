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

  const asc = houses.find((h) => h.house === 1)?.degree ?? 0;

  // ASC слева, движение градусов — против часовой стрелки
  const toSvgAngle = (degree: number) => asc - degree + 180;

  const point = (degree: number, radius: number) => {
    const angle = (toSvgAngle(degree) * Math.PI) / 180;

    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  // Расстояние между двумя точками на круге
  const angularDistance = (a: number, b: number) => {
    const diff = Math.abs(a - b) % 360;

    return Math.min(diff, 360 - diff);
  };

  // Определяем радиус каждой планеты,
  // чтобы близкие планеты не накладывались
  const getPlanetPositions = () => {
    const sorted = planets
      .map((planet, originalIndex) => ({
        planet,
        originalIndex,
      }))
      .sort((a, b) => a.planet.full_degree - b.planet.full_degree);

    const positions = new Map<
      number,
      {
        degree: number;
        radius: number;
      }
    >();

    const MIN_DISTANCE = 7;
    const BASE_RADIUS = 33;
    const RADIUS_STEP = 6;

    const groups: (typeof sorted)[] = [];
    let currentGroup: typeof sorted = [];

    sorted.forEach((item, index) => {
      const prev = sorted[index - 1];

      if (
        prev &&
        angularDistance(item.planet.full_degree, prev.planet.full_degree) <
          MIN_DISTANCE
      ) {
        currentGroup.push(item);
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }

        currentGroup = [item];
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    // Склеиваем первую и последнюю группу,
    // если они близки через 0° / 360°
    if (groups.length > 1) {
      const firstGroup = groups[0];
      const lastGroup = groups[groups.length - 1];

      const first = firstGroup[0].planet.full_degree;

      const last = lastGroup[lastGroup.length - 1].planet.full_degree;

      if (angularDistance(first, last) < MIN_DISTANCE) {
        const merged = [...lastGroup, ...firstGroup];

        groups.shift();
        groups.pop();
        groups.unshift(merged);
      }
    }

    groups.forEach((group) => {
      // Если планета одна — оставляем на базовом радиусе
      if (group.length === 1) {
        const item = group[0];

        positions.set(item.originalIndex, {
          degree: item.planet.full_degree,
          radius: BASE_RADIUS,
        });

        return;
      }

      // Группу близких планет разносим по радиусу
      group.forEach((item, index) => {
        positions.set(item.originalIndex, {
          degree: item.planet.full_degree,
          radius: BASE_RADIUS - index * RADIUS_STEP,
        });
      });
    });

    return positions;
  };

  const planetPositions = getPlanetPositions();

  const bgScale = 2.4;
  const bgSize = 78 * bgScale;

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
        {/* Внешний круг */}
        <circle
          cx={cx}
          cy={cy}
          r="48"
          fill="transparent"
          stroke="#fff"
          strokeWidth="0.35"
        />

        <defs>
          <clipPath id="chart-bg-clip">
            <circle cx={cx} cy={cy} r="39" />
          </clipPath>
        </defs>

        <image
          href="/bg.png"
          x={(100 - bgSize) / 2}
          y={(100 - bgSize) / 2}
          width={bgSize}
          height={bgSize}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#chart-bg-clip)"
        />

        {/* Внутренняя граница кольца знаков */}
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
          fill="transparent"
          stroke="#fff"
          strokeWidth="0.25"
        />

        {/* 12 знаков зодиака */}
        {Array.from({ length: 12 }).map((_, i) => {
          const degree = i * 30;

          const a = point(degree, 39);
          const b = point(degree, 48);

          const label = point(degree + 15, 44);

          return (
            <g key={ZODIAC[i]}>
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
                x={label.x - 2}
                y={label.y - 2}
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
              key={`house-line-${house.house}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#fff"
              strokeWidth="0.35"
            />
          );
        })}

        {/* Номера домов */}
        {houses.map((house, index) => {
          const next = houses[(index + 1) % houses.length];

          const start = house.degree;

          let end = next.degree;

          if (end <= start) {
            end += 360;
          }

          const middle = ((start + end) / 2) % 360;

          const pos = point(middle, 10);

          return (
            <text
              key={`house-number-${house.house}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="2"
              fill="#fff"
              fontStyle="italic"
            >
              {/*{house.house}*/}
            </text>
          );
        })}

        {/* Планеты */}
        {planets.map((planet, index) => {
          const position = planetPositions.get(index);

          if (!position) return null;

          const pos = point(position.degree, position.radius);

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
