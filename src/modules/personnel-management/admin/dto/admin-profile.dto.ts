export interface AdminProfileDto {
  id: number;
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: {
    id: number;
    name: string;
    permissions: string[];
  };
  department?: string;
  employeeNumber?: string;
  image?: string;
  lastLoginAt?: Date;
  joinedAt: Date;
}
