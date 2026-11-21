import { getSupabaseClient } from "./client";
import { DASHBOARD_CAMERAS } from "@/data/cameras";
import { DashboardCamera, CameraCategory, TrafficCondition } from "@/types/camera";

export interface SupabaseCameraRow {
  id: string;
  number: string;
  name: string;
  category: CameraCategory;
  category_label: string;
  condition: TrafficCondition;
  condition_color: string;
  time: string;
  map_x: number;
  map_y: number;
  lat: number;
  lng: number;
  stream_url: string;
  stream_type: "hls" | "youtube";
  youtube_video_id?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  thumbnail_svg_type: "traffic" | "park" | "landmark" | "transit";
  status: "online" | "standby" | "hidden";
  tier: number;
}

// Convert database snake_case row to frontend camelCase DashboardCamera
export function mapRowToDashboardCamera(row: any): DashboardCamera {
  const parsedLat = parseFloat(row.lat);
  const parsedLng = parseFloat(row.lng);

  return {
    id: row.id,
    number: row.number,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label || "Lalu Lintas",
    condition: row.condition,
    conditionColor: row.condition_color,
    time: row.time || "11.26",
    mapX: Number(row.map_x ?? 50),
    mapY: Number(row.map_y ?? 50),
    lat: Number.isFinite(parsedLat) ? parsedLat : -7.4244,
    lng: Number.isFinite(parsedLng) ? parsedLng : 109.2302,
    streamUrl: row.stream_url,
    streamType: row.stream_type || "hls",
    youtubeVideoId: row.youtube_video_id || undefined,
    sourceName: row.source_name || undefined,
    sourceUrl: row.source_url || undefined,
    thumbnailSvgType: row.thumbnail_svg_type || "traffic",
    status: row.status || "online",
    isVisible: row.status === "online",
  };
}

// Convert frontend camelCase DashboardCamera to database snake_case row
export function mapDashboardCameraToRow(cam: Partial<DashboardCamera>): Partial<SupabaseCameraRow> {
  const row: any = {};
  if (cam.id !== undefined) row.id = cam.id;
  if (cam.number !== undefined) row.number = cam.number;
  if (cam.name !== undefined) row.name = cam.name;
  if (cam.category !== undefined) row.category = cam.category;
  if (cam.categoryLabel !== undefined) row.category_label = cam.categoryLabel;
  if (cam.condition !== undefined) row.condition = cam.condition;
  if (cam.conditionColor !== undefined) row.condition_color = cam.conditionColor;
  if (cam.lat !== undefined) row.lat = cam.lat;
  if (cam.lng !== undefined) row.lng = cam.lng;
  if (cam.streamUrl !== undefined) row.stream_url = cam.streamUrl;
  if (cam.streamType !== undefined) row.stream_type = cam.streamType;
  if (cam.youtubeVideoId !== undefined) row.youtube_video_id = cam.youtubeVideoId;
  if (cam.thumbnailSvgType !== undefined) row.thumbnail_svg_type = cam.thumbnailSvgType;
  if (cam.status !== undefined) row.status = cam.status;
  return row;
}

// Local storage key for in-browser persistence when Supabase keys are not set
const LOCAL_STORAGE_KEY = "pwt360_admin_cameras";

// In-memory / localStorage cache helper
function getLocalAdminCameras(): DashboardCamera[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("localStorage read error:", e);
    }
  }
  return DASHBOARD_CAMERAS.map((c) => ({
    ...c,
    status: c.status || "online",
    isVisible: true,
  }));
}

function saveLocalAdminCameras(cams: DashboardCamera[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cams));
    } catch (e) {
      console.warn("localStorage write error:", e);
    }
  }
}

// Fetch all public cameras (visible online only)
export async function getPublicCameras(): Promise<DashboardCamera[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    const local = getLocalAdminCameras();
    return local.filter((c) => c.status !== "hidden");
  }

  try {
    const { data, error } = await supabase
      .from("cameras")
      .select("*")
      .eq("status", "online")
      .order("number", { ascending: true });

    if (error || !data || data.length === 0) {
      const local = getLocalAdminCameras();
      return local.filter((c) => c.status !== "hidden");
    }

    return data.map(mapRowToDashboardCamera);
  } catch (err) {
    const local = getLocalAdminCameras();
    return local.filter((c) => c.status !== "hidden");
  }
}

// Fetch all cameras for Admin (including hidden & standby)
export async function getAllCamerasAdmin(): Promise<DashboardCamera[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getLocalAdminCameras();
  }

  try {
    const { data, error } = await supabase
      .from("cameras")
      .select("*")
      .order("number", { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocalAdminCameras();
    }

    return data.map(mapRowToDashboardCamera);
  } catch (err) {
    return getLocalAdminCameras();
  }
}

// Admin: Update camera (Name, Lat/Lng Pin, Visibility, Category, Condition)
export async function updateCameraAdmin(
  id: string,
  updates: Partial<DashboardCamera>
): Promise<{ success: boolean; data?: DashboardCamera; error?: string }> {
  // Always update local cache so changes are immediately visible
  const localList = getLocalAdminCameras();
  const index = localList.findIndex((c) => c.id === id);
  let updatedCam: DashboardCamera | null = null;

  if (index !== -1) {
    localList[index] = { ...localList[index], ...updates };
    updatedCam = localList[index];
    saveLocalAdminCameras(localList);
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: true, data: updatedCam || undefined };
  }

  try {
    const dbRow = mapDashboardCameraToRow(updates);
    const { data, error } = await supabase
      .from("cameras")
      .update(dbRow)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? mapRowToDashboardCamera(data) : undefined };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Admin: Add new camera pin
export async function createCameraAdmin(
  newCam: DashboardCamera
): Promise<{ success: boolean; error?: string }> {
  const localList = getLocalAdminCameras();
  localList.push(newCam);
  saveLocalAdminCameras(localList);

  const supabase = getSupabaseClient();
  if (!supabase) {
    return { success: true };
  }

  try {
    const row = mapDashboardCameraToRow(newCam);
    const { error } = await supabase.from("cameras").insert([row]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
