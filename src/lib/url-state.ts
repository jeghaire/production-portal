export interface SearchParams {
  loc?: string[]; // Array for multiple locations
  yr?: string;    // Single year
  mnt?: string;   // Single month
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
      // yr: Array.isArray(params.yr) ? params.yr[0] : params.yr,
    };
  }
  
  // export function stringifySearchParams(params: SearchParams): string {
  //   const urlParams = new URLSearchParams();
  //   Object.entries(params).forEach(([key, value]) => {
  //     if (value !== undefined) {
  //       urlParams.append(key, value);
  //     }
  //   });
  //   return urlParams.toString();
  // }

  export function stringifySearchParams(params: SearchParams): string {
    const urlParams = new URLSearchParams();
    
    // Handle array parameters (like loc)
    if (params.loc) {
      params.loc.forEach(loc => urlParams.append('loc', loc));
    }
    
    // Handle single-value parameters
    if (params.yr) urlParams.append('yr', params.yr);
    if (params.mnt) urlParams.append('mnt', params.mnt);
    
    return urlParams.toString();
  }