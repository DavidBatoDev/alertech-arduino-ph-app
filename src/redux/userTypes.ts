// userTypes.ts (you can store these in userSlice.ts as well)

// Shared fields
export interface BaseUser {
    id: string;
    username: string;
    email?: string;
  }
  
  // Fields unique to regular users
  export interface RegularUser extends BaseUser {
    type: 'user';
    // e.g. contactNumber, address, etc.
    contactNumber?: string;
    address?: string;
  }
  
  // Fields unique to neighbors
  export interface NeighborUser extends BaseUser {
    type: 'neighbor';
    // e.g. address, contact, fireStationUUID, etc.
    address?: string;
    contact?: string;
    description?: string;
    fireStationUUID?: string;
  }
  
  // The union type
  export type User = RegularUser | NeighborUser;
  