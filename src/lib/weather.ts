export interface HourlyForecast {
  time: string;
  temp: string;
  rain: boolean;
}

export interface DynamicWeather {
  temperature: number;
  conditionText: string;
  isRaining: boolean;
  rainChance: number;
  humidity: number;
  windSpeed: number;
  hourly: HourlyForecast[];
  cityName: string;
}

// Map WMO Weather Codes to Indonesian descriptions and rain boolean
export function parseWmoCode(code: number): { text: string; isRaining: boolean } {
  if (code === 0) return { text: "Cerah", isRaining: false };
  if (code === 1 || code === 2) return { text: "Cerah berawan", isRaining: false };
  if (code === 3) return { text: "Berawan", isRaining: false };
  if (code === 45 || code === 48) return { text: "Berkabut", isRaining: false };
  if (code >= 51 && code <= 55) return { text: "Gerimis berpotensi hujan", isRaining: true };
  if (code >= 61 && code <= 65) return { text: "Hujan sedang", isRaining: true };
  if (code >= 80 && code <= 82) return { text: "Mendung, potensi hujan", isRaining: true };
  if (code >= 95 && code <= 99) return { text: "Hujan disertai petir", isRaining: true };
  return { text: "Berawan", isRaining: false };
}

const weatherCache = new Map<string, { data: DynamicWeather; timestamp: number }>();

export async function fetchLivePinWeather(
  lat: number,
  lng: number,
  locationName: string
): Promise<DynamicWeather> {
  const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  const cached = weatherCache.get(cacheKey);

  // Cache 5 minutes
  if (cached && Date.now() - cached.timestamp < 300000) {
    return cached.data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Asia%2FJakarta&forecast_hours=6`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    const current = json.current;
    const hourly = json.hourly;

    const wmo = parseWmoCode(current.weather_code);
    const rainChance = hourly?.precipitation_probability?.[0] ?? (wmo.isRaining ? 65 : 20);

    const formattedHourly: HourlyForecast[] = [];
    if (hourly && hourly.time) {
      for (let i = 0; i < Math.min(5, hourly.time.length); i++) {
        const rawTime = hourly.time[i]; // "2026-11-21T12:00"
        const hourStr = rawTime.split("T")[1]?.slice(0, 5)?.replace(":", ".") || `${12 + i}.00`;
        const tempVal = Math.round(hourly.temperature_2m[i] ?? 27);
        const codeVal = hourly.weather_code[i] ?? 0;
        const hourWmo = parseWmoCode(codeVal);

        formattedHourly.push({
          time: hourStr,
          temp: `${tempVal}°`,
          rain: hourWmo.isRaining || (hourly.precipitation_probability?.[i] ?? 0) >= 40,
        });
      }
    }

    const result: DynamicWeather = {
      temperature: Math.round(current.temperature_2m),
      conditionText: wmo.text,
      isRaining: wmo.isRaining || rainChance >= 50,
      rainChance: rainChance,
      humidity: Math.round(current.relative_humidity_2m),
      windSpeed: Math.round(current.wind_speed_10m),
      hourly: formattedHourly,
      cityName: locationName,
    };

    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.warn("Open-Meteo live weather fetch failed, using fallback:", err);
    return {
      temperature: 27,
      conditionText: "Mendung, potensi hujan",
      isRaining: true,
      rainChance: 60,
      humidity: 78,
      windSpeed: 9,
      hourly: [
        { time: "12.00", temp: "28°", rain: false },
        { time: "13.00", temp: "28°", rain: false },
        { time: "14.00", temp: "27°", rain: true },
        { time: "15.00", temp: "26°", rain: true },
        { time: "16.00", temp: "26°", rain: true },
      ],
      cityName: locationName,
    };
  }
}
