export interface SearchParams {
  loc?: string[]; // Array for multiple locations
  yr?: string;    // Single year
  mnt?: string;   // Single month
  from?: string;  // Single start date
  to?: string;    // Single end date
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
        mnt: typeof params.mnt === 'string' ? params.mnt : undefined,
        yr: typeof params.yr === 'string' ? params.yr : undefined,
        from: typeof params.from === 'string' ? params.from : undefined,
        to: typeof params.to === 'string' ? params.to : undefined,
    };
  }

  export function stringifySearchParams(params: SearchParams): string {
    const urlParams = new URLSearchParams();
    
    // Handle array parameters (like loc)
    if (params.loc) {
      params.loc.forEach(loc => urlParams.append('loc', loc));
    }
    
    // Handle single-value parameters
    if (params.yr) urlParams.append('yr', params.yr);
    if (params.mnt) urlParams.append('mnt', params.mnt);
    if (params.from) urlParams.append('from', params.from);
    if (params.to) urlParams.append('to', params.to);
    
    return urlParams.toString();
  }