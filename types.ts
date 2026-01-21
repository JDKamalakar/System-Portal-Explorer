
export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PROMPT = 'prompt',
  UNSUPPORTED = 'unsupported'
}

export interface PortalFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface SystemStatus {
  online: boolean;
  battery: {
    level: number;
    charging: boolean;
  } | null;
  memory: number | null;
}
