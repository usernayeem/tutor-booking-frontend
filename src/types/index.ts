// Export standard types here
export type Role = "SUPER_ADMIN" | "ADMIN" | "TUTOR" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
