
export interface CheckIn {
  id: number;
  call_id?: string;
  start_timestamp?: number;
  end_timestamp?: number;
  duration_ms?: number | null;
  response_id?: number;
  total_duration_unit_price?: number;
  from_number?: number;
  to_number?: number;
  event?: string;
  call_type?: string;
  agent_id?: string;
  call_status?: string;
  transcript?: string;
  recording_url?: string;
  public_log_url?: string;
  disconnection_reason?: string;
  direction?: string;
}

export interface CheckInsResponse {
  data: CheckIn[];
  total: number;
}

export interface CheckInFilters {
  page?: number;
  perPage?: number;
  status?: string;
  siteId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  debug?: string;
}
