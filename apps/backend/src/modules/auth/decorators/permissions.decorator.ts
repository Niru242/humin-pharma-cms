import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'requiredPermissions';

/**
 * Declare which permissions a route handler requires.
 * 
 * Usage:
 *   @RequirePermissions('employee.create')
 *   @RequirePermissions('employee.read', 'attendance.read')  // ANY of these
 *
 * The PermissionGuard checks that the user's roles include at least one
 * of the listed permissions. If multiple are required (AND logic), use
 * multiple decorators or combine with @RequireAllPermissions.
 *
 * Section 4: "build a permission matrix/builder, don't hardcode
 * if role === 'admin' checks scattered through code"
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
