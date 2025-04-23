
export interface UserPermission {
  role: "admin" | "manager" | "seller";
  permissions: string[];
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  exp: number;
  lastActivity: number;
}

