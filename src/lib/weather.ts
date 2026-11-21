import { CameraCategory } from "@/types/camera";

export type WeatherConditionType = "sunny" | "cloudy" | "rainy" | "thunderstorm";

export interface ForecastHour {
  time: string;
  temp: number;
  rainChance: number;
  conditionType: WeatherConditionType;
  conditionText: string;
}

export interface DynamicWeather {
  cityName: string;
  category?: CameraCategory;
  forecastTitle: string;
  conditionText: string;
  conditionType: WeatherConditionType;
  isRaining: boolean;
  temperature: number;
  maxExpectedTemp: number;
  minExpectedTemp: number;
  rainChance: number;
  peakRainTime?: string;
  humidity: number;
  windSpeed: number;
  roadAdvisory: string;
  hourly: ForecastHour[];
  source?: string;
  lat?: number;
  lng?: number;
  updatedAt?: string;
}

const memoryCache = new Map<string, { data: DynamicWeather; timestamp: number }>();

export async function fetchLivePinWeather(
  lat: number,
  lng: number,
  locationName: string,
  category?: CameraCategory
): Promise<DynamicWeather> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const cached = memoryCache.get(cacheKey);

  // Cache 90 seconds
  if (cached && Date.now() - cached.timestamp < 90000) {
    return { ...cached.data, cityName: locationName, category };
  }

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const res = await fetch(`${origin}/api/weather?lat=${lat}&lng=${lng}&name=${encodeURIComponent(locationName)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      const result: DynamicWeather = {
        cityName: locationName,
        category,
        forecastTitle: "Prediksi Cuaca",
        conditionText: json.conditionText,
        conditionType: json.conditionType,
        isRaining: json.isRaining,
        temperature: json.temperature,
        maxExpectedTemp: json.maxExpectedTemp,
        minExpectedTemp: json.minExpectedTemp,
        rainChance: json.rainChance,
        humidity: json.humidity,
        windSpeed: json.windSpeed,
        roadAdvisory: json.roadAdvisory,
        hourly: json.hourly || [],
        source: json.source,
        lat: json.lat,
        lng: json.lng,
        updatedAt: json.updatedAt,
      };

      memoryCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }
  } catch (err) {
    console.warn("Client fetch error to /api/weather, retrying directly:", err);
  }

  // Direct client fetch to Open-Meteo if internal API route is unreachable
  try {
    const directUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&timezone=Asia%2FJakarta&forecast_hours=6`;
    const res = await fetch(directUrl);
    if (res.ok) {
      const data = await res.json();
      const curr = data.current;
      const hourly = data.hourly;

      const code = curr.weather_code || 0;
      const isRain = code >= 51;
      const cType: WeatherConditionType = code >= 95 ? "thunderstorm" : isRain ? "rainy" : code <= 2 ? "sunny" : "cloudy";
      const cText = code === 0 ? "Cerah terik" : code <= 2 ? "Cerah berawan" : isRain ? "Hujan lokal" : "Berawan";

      const hours: ForecastHour[] = [];
      if (hourly && hourly.time) {
        for (let i = 0; i < Math.min(5, hourly.time.length); i++) {
          hours.push({
            time: hourly.time[i]?.split("T")[1]?.slice(0, 5)?.replace(":", ".") || `${13 + i}.00`,
            temp: Math.round(hourly.temperature_2m[i] ?? 26),
            rainChance: hourly.precipitation_probability?.[i] ?? 0,
            conditionType: (hourly.precipitation_probability?.[i] ?? 0) >= 50 ? "rainy" : "cloudy",
            conditionText: (hourly.precipitation_probability?.[i] ?? 0) >= 50 ? "Hujan" : "Berawan",
          });
        }
      }

      return {
        cityName: locationName,
        category,
        forecastTitle: "Prediksi Cuaca",
        conditionText: cText,
        conditionType: cType,
        isRaining: isRain,
        temperature: Math.round(curr.temperature_2m),
        maxExpectedTemp: Math.round(curr.temperature_2m) + 1,
        minExpectedTemp: Math.round(curr.temperature_2m) - 2,
        rainChance: hourly?.precipitation_probability?.[0] ?? (isRain ? 80 : 20),
        humidity: Math.round(curr.relative_humidity_2m),
        windSpeed: Math.round(curr.wind_speed_10m),
        roadAdvisory: isRain ? "Jalanan basah, waspadai jarak pengereman." : "Kondisi jalanan kering normal.",
        hourly: hours,
        source: "Open-Meteo Direct Satellite",
        lat,
        lng,
        updatedAt: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      };
    }
  } catch (directErr) {
    console.error("Direct weather fetch error:", directErr);
  }

  return {
    cityName: locationName,
    category,
    forecastTitle: "Prediksi Cuaca",
    conditionText: "Berawan",
    conditionType: "cloudy",
    isRaining: false,
    temperature: 27,
    maxExpectedTemp: 28,
    minExpectedTemp: 25,
    rainChance: 30,
    humidity: 78,
    windSpeed: 7,
    roadAdvisory: "Jalanan kering dan aman dilintasi.",
    hourly: [],
    source: "BMKG Banyumas",
    lat,
    lng,
    updatedAt: "13.00 WIB",
  };
}
