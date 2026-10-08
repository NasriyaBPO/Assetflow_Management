export interface EmployeeSelfProfile {
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

export interface EmployeeMyAsset {
  id: string;
  assetCode: string;
  name: string;
  serialNumber: string | null;
  brand: string | null;
  model: string | null;
  status: string;
  condition: string;

  category: {
    id: string;
    name: string;
  };
}

export interface EmployeeAssetAssignment {
  id: string;
  assignedAt: string;
  notes: string | null;
  status: string;
  asset: EmployeeMyAsset;
}

export interface EmployeeMyAssetsResponse {
  employee: {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
  };

  assets: EmployeeAssetAssignment[];
}