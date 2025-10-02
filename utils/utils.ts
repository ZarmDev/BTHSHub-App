import { apiKey, server } from "@/constants/environmentvars";
import * as FileSystem from 'expo-file-system';

// API Types
interface ApiResponse {
  ok: boolean;
  status: number;
  data: string;
}

interface TeamAnnouncement {
  teamName: string;
  content: string;
  mentions: string[];
}

interface ApiConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: string | FormData;
}

// Base fetch function with authentication
async function apiFetch(endpoint: string, options: ApiConfig = {}, token: string = ""): Promise<ApiResponse> {
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
      ...options.headers
    },
    ...options
  };

  // Add auth token for protected routes (all routes except /, /login, /createuser, /adminsetup)
  const protectedRoutes = [
    '/api/', '/mod/', '/admin/'
  ];
  if (protectedRoutes.some(route => endpoint.startsWith(route)) && token) {
    (config.headers as Record<string, string>)['Authorization'] = `${token}`;
  }
  const url = `${server}${endpoint}`;
  const response = await fetch(url, config);
  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    data: text
  };
}

// Unprotected routes
export async function getDefault(token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/', {}, token);
}

export async function login(username: string, password: string): Promise<ApiResponse> {
  const response = await apiFetch('/login', {
    method: 'POST',
    body: `${username}\n${password}`
  });
  return response;
}

export async function createUser(username: string, password: string, email: string): Promise<ApiResponse> {
  return await apiFetch('/createuser', {
    method: 'POST',
    body: `${username}\n${password}\n${email}`
  });
}

export async function adminSetup(token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/adminsetup', {
    method: 'POST'
  }, token);
}

// Protected routes (require JWT)
export async function getAllTeams(token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getallteams', {}, token);
}

export async function getPermissionLevel(token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getpermissionlevel', {}, token);
}

export async function getDailyAnnouncement(token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getdailyannoucement', {}, token);
}

export async function getSchedule(token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getschedule', {}, token);
}

export async function uploadSchedule(file: any, token: string = ""): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: 'application/pdf',
  } as any);

  const response = await fetch(`${server}/api/uploadschedule`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': token ? `${token}` : ''
    },
  });

  const text = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    data: text
  };
}

// Protected routes (require JWT + team membership)
export async function getTeamMembers(teamName: string, token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getteammembers', {
    method: 'GET',
    body: teamName
  }, token);
}

export async function getTeamCoaches(teamName: string, token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getteamcoaches', {
    method: 'GET',
    body: teamName
  }, token);
}

export async function getUserTeams(token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getmyteams', {
    method: 'GET'
  }, token);
}

export async function createTeamAnnouncement(
  teamName: string,
  content: string,
  mentions: string[] = [],
  token: string = ""
): Promise<ApiResponse> {
  const data: TeamAnnouncement = {
    teamName: teamName,
    content: content,
    mentions: mentions
  };
  return await apiFetch('/api/createannoucement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }, token);
}

export async function getTeamAnnouncements(teamName: string, token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getannoucements', {
    method: 'POST',
    body: teamName
  }, token);
}

export async function addUserToTeam(teamName: string, token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/addusertoteam', {
    method: 'POST',
    body: teamName
  }, token);
}

export async function getTeamInfo(teamName: string, token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/api/getteaminfo', {
    method: 'POST',
    body: teamName
  }, token);
}

// Moderator/Admin protected routes
export async function createTeam(teamName: string, isPrivate: boolean, token: string = ""): Promise<ApiResponse> {
  const privateFlag = isPrivate ? '1' : '0';
  return await apiFetch('/mod/createteam', {
    method: 'POST',
    body: `${teamName}\n${privateFlag}`
  }, token);
}

export async function addOtherUserToTeam(teamName: string, username: string, token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/mod/addotherusertoteam', {
    method: 'POST',
    body: `${teamName}\n${username}`
  }, token);
}

// Admin only protected routes
export async function setDailyAnnouncement(announcement: string, token: string = ""): Promise<ApiResponse> {
  return await apiFetch('/admin/setdailyannoucement', {
    method: 'POST',
    body: announcement
  }, token);
}

export async function updateOtherUserAdminLevel(
  targetUsername: string,
  adminLevel: '0' | '1' | '2',
  token: string = ""
): Promise<ApiResponse> {
  return await apiFetch('/admin/updateotheruseradminlevel', {
    method: 'POST',
    body: `${targetUsername}\n${adminLevel}`
  }, token);
}

// Helper function to logout
export function logout(): void {
  // Remove token from wherever you store it in your app (no-op here)
}

// Utility functions for parsing responses
export function parseTeamsResponse(response: ApiResponse): string[] | null {
  if (!response.ok) return null;
  try {
    return JSON.parse(response.data);
  } catch {
    return null;
  }
}

export function parseAnnouncementsResponse(response: ApiResponse): any[] | null {
  if (!response.ok) return null;
  try {
    return JSON.parse(response.data);
  } catch {
    return null;
  }
}

export function parseTeamInfoResponse(response: ApiResponse): any | null {
  if (!response.ok) return null;
  try {
    return JSON.parse(response.data);
  } catch {
    return null;
  }
}


// Usage of AI and https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
export async function fetchNearbyPlaces(latitude: number, longitude: number, textInput: string) {
  const url = `https://places.googleapis.com/v1/places:autocomplete`;

  const body = {
    input: textInput,
    locationBias: {
      circle: {
        center: {
          latitude,
          longitude,
        },
        radius: 5000.0, // meters
      },
    },
    // includedPrimaryTypes: ["park"], // optional: bias toward parks
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // don't show error even if apiKey is null
      "X-Goog-Api-Key": apiKey!,
      "X-Goog-FieldMask": "*", // or specify fields like 'places.displayName,places.location'
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Failed to fetch places:", await response.text());
    return [];
  }

  const data = await response.json();
  return data;
};

// Usage of AI
export async function fetchPlaceDetails(placeId: string) {
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${apiKey}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch place details:", await response.text());
    return null;
  }

  const data = await response.json();
  return data.location; // { latitude: number, longitude: number }
};

export const writeToDocumentDirectory = async (fileName: string, content: string) => {
  const fileUri = FileSystem.documentDirectory + fileName;
  await FileSystem.writeAsStringAsync(fileUri, content);
  console.log('File written successfully');
};

export async function readInDocumentDirectory(fileName: string): Promise<string | null> {
  const fileUri = FileSystem.documentDirectory + fileName;
  try {
    const content = await FileSystem.readAsStringAsync(fileUri);
    // console.log('File content:', content);
    return content;
  } catch (error: any) {
    console.log('Failed to read file:', error.message);
    return null;
  }
};

export const appendIfDoesntExistInDocumentDirectory = async (fileName: string, data: string) => {
  const prevData = await readInDocumentDirectory(fileName);
  if (prevData == null) {
    writeToDocumentDirectory(fileName, data);
  } else {
    // If already exists, don't write
    if (prevData?.includes(data)) {
      return;
    }
    writeToDocumentDirectory(fileName, prevData + '\n' + data);
  }
};

export async function doesFileExist(uri: string) {
  const result = await FileSystem.getInfoAsync(uri);
  return result.exists && !result.isDirectory;
}

export async function listDirectoryContents() {
  try {
    const contents = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'quizzes');
    console.log('Directory contents:', contents);
    return contents;
  } catch (error) {
    console.log('Error reading directory:', error);
  }
}

export function deleteFile(item: string) {
  FileSystem.deleteAsync(FileSystem.documentDirectory + "/" + item)
}