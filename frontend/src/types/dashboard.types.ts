/**
 * Dashboard Related Types
 */

export enum WidgetType {
  KPI_CARD = 'kpi_card',
  CHART = 'chart',
  TABLE = 'table',
  ALERT = 'alert',
  LIST = 'list',
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  AREA = 'area',
  DONUT = 'donut',
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  endpoint?: string;
  refreshInterval?: number;
  size: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
  };
  config?: Record<string, unknown>;
}

export interface DashboardLayout {
  id: string;
  name: string;
  role: string;
  widgets: WidgetConfig[];
}

export interface KPIData {
  label: string;
  value: number | string;
  trend?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
  }[];
}

export interface AlertData {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  read: boolean;
}
