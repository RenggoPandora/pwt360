export type CameraCategory =
  | "traffic"
  | "public_space"
  | "tourism"
  | "transit";

export type TrafficCondition = "Lancar" | "Padat" | "Ramai" | "Tenang";

export interface DashboardCamera {
  id: string;
  number: string; // "01", "02", etc.
  name: string;
  category: CameraCategory;
  categoryLabel: string;
  condition: TrafficCondition;
  conditionColor: string;
  time: string; // "11.26"
  mapX: number; // percentage 0-100%
  mapY: number; // percentage 0-100%
  lat: number;
  lng: number;
  streamUrl: string;
  streamType: "hls" | "youtube";
  youtubeVideoId?: string;
  sourceName?: string;
  sourceUrl?: string;
  thumbnailSvgType: "traffic" | "park" | "landmark" | "transit";
  description?: string;
  locationName?: string;
  subdistrict?: string;
  status?: "online" | "hidden" | "standby";
  isVisible?: boolean;
  isOfficial?: boolean;
}

export type Camera = DashboardCamera;
