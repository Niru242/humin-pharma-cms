import { SetMetadata } from '@nestjs/common';

export const DATA_SCOPE_OVERRIDE_KEY = 'dataScopeOverride';

/**
 * Override the default data scope behavior for a specific route.
 * 
 * By default, the DataScopeInterceptor applies filtering based on the
 * user's assigned scope. Use this to:
 * - Skip scope filtering (e.g., for system-wide endpoints like health)
 * - Force a specific scope type regardless of user assignment
 *
 * Usage:
 *   @DataScopeOverride('skip')     // No scope filtering
 *   @DataScopeOverride('self')     // Always filter to self only
 */
export const DataScopeOverride = (override: 'skip' | 'self' | 'all') =>
  SetMetadata(DATA_SCOPE_OVERRIDE_KEY, override);
