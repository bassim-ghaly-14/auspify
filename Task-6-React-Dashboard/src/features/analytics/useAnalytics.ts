import { useDataFetch } from '@/hooks/useDataFetch'
import { fetchAnalyticsData } from './analyticsService'
import type { AnalyticsRawData } from './analyticsService'

export function useAnalytics() {
  return useDataFetch<AnalyticsRawData>(fetchAnalyticsData)
}