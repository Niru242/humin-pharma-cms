/**
 * JWT payload structure — included in access token.
 * Never put sensitive PII here (Section 4).
 */
export interface JwtPayload {
  sub: string;          // userId (UUID)
  roleIds: string[];    // Array of role IDs assigned to this user
  dataScope: DataScope; // What data this user can see
  tokenVersion: number; // Incremented on password change / forced logout
  iat?: number;
  exp?: number;
}

/**
 * Data scope — defines what organizational scope a user's permissions apply to.
 * Applied at the query level, not just the response (Section 4).
 */
export interface DataScope {
  type: 'all' | 'company' | 'plant' | 'department' | 'self';
  companyIds?: string[];
  plantIds?: string[];
  departmentIds?: string[];
}

/**
 * Login request/response shapes
 */
export interface LoginRequest {
  email: string;
  password: string;
  mfaCode?: string; // Required when MFA is enabled for the user
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    mfaRequired: boolean;
  };
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string; // Rotated
}
