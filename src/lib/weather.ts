import { CameraCategory } from "@/types/camera";

export type WeatherConditionType = "sunny" | "cloudy" | "rainy" | "thunderstorm";

export interface HourlyForecast {
  time: string;
  temp: string;
  rain: boolean;
  type?: WeatherConditionType;
}

export interface DynamicWeather {
  temperature: number;
  conditionText: string;
  conditionType: WeatherConditionType;
  isRaining: boolean;
  rainChance: number;
  humidity: number;
  windSpeed: number;
  hourly: HourlyForecast[];
  cityName: string;
}

// Map WMO Weather Codes to Indonesian descriptions, type, and rain boolean
export function parseWmoCode(code: number): {
  text: string;
  type: WeatherConditionType;
  isRaining: boolean;
} {
  if (code === 0) return { text: "Cerah, terik", type: "sunny", isRaining: false };
  if (code === 1 || code === 2) return { text: "Cerah berawan", type: "sunny", isRaining: false };
  if (code === 3) return { text: "Berawan tebal", type: "cloudy", isRaining: false };
  if (code === 45 || code === 48) return { text: "Berkabut", type: "cloudy", isRaining: false };
  if (code >= 51 && code <= 55) return { text: "Gerimis berpotensi hujan", type: "rainy", isRaining: true };
  if (code >= 61 && code <= 65) return { text: "Hujan sedang", type: "rainy", isRaining: true };
  if (code >= 80 && code <= 82) return { text: "Mendung, potensi hujan", type: "rainy", isRaining: true };
  if (code >= 95 && code <= 99) return { text: "Hujan disertai petir", type: "thunderstorm", isRaining: true };
  return { text: "Berawan", type: "cloudy", isRaining: false };
}

const weatherCache = new Map<string, { data: DynamicWeather; timestamp: number }>();

export async function fetchLivePinWeather(
  lat: number,
  lng: number,
  locationName: string,
  category?: CameraCategory
): Promise<DynamicWeather> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}_${category || "all"}`;
  const cached = weatherCache.get(cacheKey);

  // Cache 3 minutes
  if (cached && Date.now() - cached.timestamp < 180000) {
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
    const baseRainChance = hourly?.precipitation_probability?.[0] ?? (wmo.isRaining ? 65 : 15);

    // Microclimate modeling based on environment & terrain physics:
    const isTraffic = category === "traffic" || locationName.toLowerCase().includes("simpang");
    const isPark = category === "public_space" || locationName.toLowerCase().includes("taman") || locationName.toLowerCase().includes("alun");
    const isMountainTourism = locationName.toLowerCase().includes("wisata") || lat < -7.36; // Northwards towards Mount Slamet slopes
    const isTransit = category === "transit" || locationName.toLowerCase().includes("stasiun") || locationName.toLowerCase().includes("transit");

    let tempOffset = 0;
    let humOffset = 0;
    let windOffset = 0;
    let rainOffset = 0;
    let microText = wmo.text;

    if (isMountainTourism) {
      // Atmospheric lapse rate: mountain elevation is cooler with higher humidity & mountain breeze
      tempOffset = -2.8;
      humOffset = +6;
      windOffset = +3.2;
      rainOffset = +12;
      microText = wmo.isRaining ? "Hujan sejuk lereng gunung" : "Sejuk berangin lereng gunung";
    } else if (isTraffic) {
      // Urban heat island: asphalt surface reflection & vehicle density (+0.8C, lower humidity)
      tempOffset = +0.9;
      humOffset = -4;
      windOffset = +1.2;
      rainOffset = -3;
      microText = wmo.isRaining ? "Hujan di simpang jalan" : "Cerah terik, panas aspal";
    } else if (isPark) {
      // Vegetative transpiration & tree canopy shade (-0.6C, higher humidity)
      tempOffset = -0.6;
      humOffset = +4;
      windOffset = -0.7;
      microText = wmo.isRaining ? "Rintik gerimis di taman" : "Sejuk teduh pepohonan";
    } else if (isTransit) {
      // Open transit platform & track corridor
      tempOffset = +0.3;
      humOffset = -1;
      windOffset = +1.4;
      microText = wmo.isRaining ? "Hujan koridor transit" : "Cerah berangin di transit";
    }

    const finalTemp = Math.round(current.temperature_2m + tempOffset);
    const finalHum = Math.min(99, Math.max(35, Math.round(current.relative_humidity_2m + humOffset)));
    const finalWind = Math.max(1, Math.round(current.wind_speed_10m + windOffset));
    const finalRainChance = Math.min(100, Math.max(0, baseRainChance + rainOffset));

    // Determine final condition type
    let finalType: WeatherConditionType = wmo.type;
    if (wmo.type === "thunderstorm") {
      finalType = "thunderstorm";
    } else if (finalRainChance >= 50 || wmo.isRaining) {
      finalType = "rainy";
    } else if (current.weather_code === 0 || current.weather_code === 1 || current.weather_code === 2) {
      finalType = "sunny";
    } else {
      finalType = "cloudy";
    }

    const formattedHourly: HourlyForecast[] = [];
    if (hourly && hourly.time) {
      for (let i = 0; i < Math.min(5, hourly.time.length); i++) {
        const rawTime = hourly.time[i]; // "2026-11-21T12:00"
        const hourStr = rawTime.split("T")[1]?.slice(0, 5)?.replace(":", ".") || `${12 + i}.00`;
        const tempVal = Math.round((hourly.temperature_2m[i] ?? 27) + tempOffset);
        const codeVal = hourly.weather_code[i] ?? 0;
        const hourWmo = parseWmoCode(codeVal);
        const hourRainChance = (hourly.precipitation_probability?.[i] ?? 0) + rainOffset;

        let hourType: WeatherConditionType = hourWmo.type;
        if (hourRainChance >= 50) hourType = "rainy";

        formattedHourly.push({
          time: hourStr,
          temp: `${tempVal}°`,
          rain: hourType === "rainy" || hourType === "thunderstorm",
          type: hourType,
        });
      }
    }

    const result: DynamicWeather = {
      temperature: finalTemp,
      conditionText: microText,
      conditionType: finalType,
      isRaining: finalType === "rainy" || finalType === "thunderstorm",
      rainChance: finalRainChance,
      humidity: finalHum,
      windSpeed: finalWind,
      hourly: formattedHourly,
      cityName: locationName,
    };

    weatherCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.warn("Open-Meteo live weather fetch failed, using fallback:", err);
    return {
      temperature: 28,
      conditionText: "Cerah, terik",
      conditionType: "sunny",
      isRaining: false,
      rainChance: 20,
      humidity: 72,
      windSpeed: 8,
      hourly: [
        { time: "12.00", temp: "29°", rain: false, type: "sunny" },
        { time: "13.00", temp: "29°", rain: false, type: "sunny" },
        { time: "14.00", temp: "28°", rain: false, type: "cloudy" },
        { time: "15.00", temp: "27°", rain: true, type: "rainy" },
        { time: "16.00", temp: "26°", rain: true, type: "rainy" },
      ],
      cityName: locationName,
    };
  }
}
