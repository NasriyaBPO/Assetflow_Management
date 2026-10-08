export interface MyEmployeeProfile {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string | null;
  designation: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;

  _count: {
    assignments: number;
  };
}

export interface MyAssignedAsset {
  id: string;
  assignedAt: string;
  notes: string | null;
  status: 'ACTIVE' | 'RETURNED';

  asset: {
    id: string;
    assetCode: string;
    name: string;
    serialNumber: string | null;
    brand: string | null;
    model: string | null;
    status:
      | 'AVAILABLE'
      | 'ASSIGNED'
      | 'DAMAGED'
      | 'UNDER_REPAIR'
      | 'LOST'
      | 'RETIRED';

    condition:
      | 'NEW'
      | 'GOOD'
      | 'FAIR'
      | 'DAMAGED';

    category: {
      id: string;
      name: string;
    };
  };
}

export interface MyAssetsResponse {
  employee: {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
  };

  assets: MyAssignedAsset[];
}