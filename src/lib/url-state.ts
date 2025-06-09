export interface SearchParams {
  loc?: string[]; // Array for multiple locations
  from?: string;  // Single start date
  to?: string;    // Single end date
  day?: string;    // Particular day
}
  
  export function parseSearchParams(
    params: Record<string, string | string[] | undefined>
  ): SearchParams {
    return {
      loc: Array.isArray(params.loc) 
      ? params.loc 
      : params.loc 
        ? [params.loc] 
        : undefined,
        from: typeof params.from === 'string' ? params.from : undefined,
        to: typeof params.to === 'string' ? params.to : undefined,
        day: typeof params.to === 'string' ? params.to : undefined,
    };
  }

  export function stringifySearchParams(params: SearchParams): string {
    const urlParams = new URLSearchParams();
    
    // Handle array parameters (like loc)
    if (params.loc) {
      params.loc.forEach(loc => urlParams.append('loc', loc));
    }
    
    // Handle single-value parameters
    if (params.from) urlParams.append('from', params.from);
    if (params.to) urlParams.append('to', params.to);
    if (params.day) urlParams.append('day', params.day);
    
    return urlParams.toString();
  }