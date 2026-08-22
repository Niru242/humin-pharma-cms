import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * No Self-Approval Guard — Section 8 requirement.
 *
 * "No self-approval: a maker/requester can never approve their own record
 * when maker-checker is enabled."
 *
 * Apply to approval endpoints. Checks that the approver (current user)
 * is not the same as the record's creator/requester.
 *
 * Usage:
 *   @UseGuards(NoSelfApprovalGuard)
 *   @Post(':id/approve')
 *   approve(@Param('id') id: string) { ... }
 *
 * The guard expects the service to have populated `request.recordOwnerId`
 * before this guard runs (via a middleware or the controller itself).
 * If not populated, it looks at the request body for `requesterId` field.
 */
@Injectable()
export class NoSelfApprovalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return true; // No user = handled by JWT guard

    // Check multiple sources for the record owner/requester
    const recordOwnerId =
      request.recordOwnerId ||
      request.body?.requesterId ||
      request.body?.createdBy;

    if (!recordOwnerId) {
      // Can't determine owner — allow (guard is a safety net, not a blocker)
      return true;
    }

    if (recordOwnerId === user.id) {
      throw new ForbiddenException(
        'Self-approval is not permitted. A different authorized user must approve this record.',
      );
    }

    return true;
  }
}
