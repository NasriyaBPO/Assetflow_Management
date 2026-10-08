export interface AssetsByStatus {
  AVAILABLE: number;
  ASSIGNED: number;
  DAMAGED: number;
  UNDER_REPAIR: number;
  LOST: number;
  RETIRED: number;
}

export interface AssetByCategory {
  categoryId: string;
  categoryName: string;
  count: number;
}

export interface RecentAssignment {
  id: string;
  assignedAt: string;
  returnedAt: string | null;
  status: 'ACTIVE' | 'RETURNED';

  asset: {
    id: string;
    assetCode: string;
    name: string;
    status: string;
  };

  employee: {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
  };
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string | null;
  createdAt: string;

  asset: {
    id: string;
    assetCode: string;
    name: string;
  };
}

export interface DashboardSummary {
  totalAssets: number;
  assetsByStatus: AssetsByStatus;
  assetsByCategory: AssetByCategory[];
  recentAssignments: RecentAssignment[];
  recentActivity: RecentActivity[];
}