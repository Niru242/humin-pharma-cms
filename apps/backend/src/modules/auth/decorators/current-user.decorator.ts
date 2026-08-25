import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract the authenticated user from the request.
 * Usage: @CurrentUser() user: RequestUser
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

/**
 * Type for the user object attached to the request by JwtAuthGuard.
 */
export interface RequestUser {
  id: string;
  email: string;
  roles: string[];
  dataScope: {
    type: string;
    entityIds: string[];
  };
  tokenVersion: number;
}
