export interface Task {
  id: string;
  title: string;
  type: 'daily' | 'support' | 'adhoc';
  frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  category?: 'Daily' | 'Weekly' | 'Monthly';
  description: string;
  completed: boolean;
}

export interface KPI {
  id: string;
  name: string;
  target: string;
  weight: number; // percentage, e.g., 20 for 20%
  unit: string;
  currentValue: number;
  targetValue: number;
}

export interface Personnel {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tag: string;
  baseSalaryMin: number; // in VND
  baseSalaryMax: number; // in VND
  estimatedTotalMin: number; // in VND
  estimatedTotalMax: number; // in VND
  mainScope: string;
  subScope: string;
  supportScope: string;
  tasks: Task[];
  kpis: KPI[];
  // Added fields from the user's updated personnel list
  email?: string;
  phone?: string;
  code?: string;
}

export interface DailyReportInput {
  personnelId: string;
  date: string;
  completedTasks: string[];
  metrics: { [kpiId: string]: number };
  issues: string;
  note: string;
}
