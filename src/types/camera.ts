export type CameraCategory =
  | "traffic"
  | "public_space"
  | "tourism"
  | "transit";

export type StreamStatus = "online" | "standby" | "offline" | "staging_review";

export type StreamType = "hls" | "youtube" | "iframe" | "mjpeg";

export interface Camera {
  id: string;
  slug: string;
  name: string;
  description?: string;
  locationName: string;
  subdistrict?: string;
  category: CameraCategory;
  lat: number;
  lng: number;
  streamUrl: string;
  streamType: StreamType;
  youtubeVideoId?: string;
  sourceName: string;
  sourceUrl: string;
  isOfficial: boolean;
  tier: 1 | 2; // Tier 1: Official (Auto), Tier 2: OSINT / Community (Staging Review)
  status: StreamStatus;
  lastChecked?: string;
  reportedCount?: number;
  featured?: boolean;
}

export interface CityWeather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  cityName: string;
  updatedAt: string;
}
