import { api } from "../api/client";

import type{ DashboardAnalytics } from "../types/analytics.types";

export class AnalyticsService {
  public async getDashboard(): Promise<DashboardAnalytics> {
    const response = await api.get<DashboardAnalytics>("/analytics/dashboard");

    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
