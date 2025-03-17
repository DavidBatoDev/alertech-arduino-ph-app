// userTypes.ts

// Shared fields
export interface BaseUser {
  id: string;
  username: string;
  email?: string;
}

// Fields unique to regular users
export interface RegularUser extends BaseUser {
  type: 'user';
  // Existing optional fields
  contactNumber?: string;
  address?: string;

  // NEW fields from your Firestore doc:
  fireStationUUID?: string;
  gasLeak?: boolean;
  humidity?: number;
  status?: string;
  temperature?: number;
  validation?: number;
}

// Fields unique to neighbors
export interface NeighborUser extends BaseUser {
  type: 'neighbor';
  address?: string;
  contact?: string;
  description?: string;
  fireStationUUID?: string;
}

// The union type
export type User = RegularUser | NeighborUser;
