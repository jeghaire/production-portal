export interface SearchParams {
    loc?: string;
    yr?: string;
    // search?: string;
    // rtg?: string;
    // lng?: string;
    // pgs?: string;
    // page?: string;
  }
  
  export function parseSearchParams(
    params: Record<string, string | string[] | undefined>
  ): SearchParams {
    return {
      loc: typeof params.loc === 'string' ? params.loc : undefined,
      yr: typeof params.yr === 'string' ? params.yr : undefined,
      // yr: Array.isArray(params.yr) ? params.yr[0] : params.yr,
      // search: typeof params.search === 'string' ? params.search : undefined,
      // rtg: typeof params.rtg === 'string' ? params.rtg : undefined,
      // lng: typeof params.lng === 'string' ? params.lng : undefined,
      // pgs: Array.isArray(params.pgs) ? params.pgs[0] : params.pgs,
      // page: typeof params.page === 'string' ? params.page : undefined,
    };
  }
  
  export function stringifySearchParams(params: SearchParams): string {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        urlParams.append(key, value);
      }
    });
    return urlParams.toString();
  }