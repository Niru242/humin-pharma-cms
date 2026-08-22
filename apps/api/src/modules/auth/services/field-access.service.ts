import { Injectable } from '@nestjs/common';
import { RequestUser } from '../decorators/current-user.decorator';

/**
 * Field Access Service — Layer 3 of the three-layer access control (Section 4 + 5).
 *
 * Handles field-level sensitivity classification and masking.
 * Bank details, statutory IDs, and medical data are masked/encrypted
 * and require explicit field permission even if the user can see the record.
 *
 * Sensitivity tiers (Section 5):
 * - Public:       Name, department, designation
 * - Internal:     Employee code, DOJ, reporting chain
 * - Restricted:   Bank details, statutory IDs (PAN, Aadhaar)
 * - Confidential: Medical records, disciplinary cases
 *
 * Usage in services:
 *   const sanitized = this.fieldAccess.filterFields(employee, user);
 */

export type SensitivityTier = 'public' | 'internal' | 'restricted' | 'confidential';

/**
 * Define which fields belong to which sensitivity tier per entity type.
 */
const FIELD_SENSITIVITY_MAP: Record<string, Record<string, SensitivityTier>> = {
  employee: {
    // Public
    firstName: 'public',
    lastName: 'public',
    employeeCode: 'public',
    departmentName: 'public',
    designationName: 'public',
    plantName: 'public',
    profilePhoto: 'public',

    // Internal
    dateOfJoining: 'internal',
    dateOfBirth: 'internal',
    email: 'internal',
    reportingManagerId: 'internal',
    employmentStatus: 'internal',
    grade: 'internal',

    // Restricted
    panNumber: 'restricted',
    aadhaarNumber: 'restricted',
    bankAccountNumber: 'restricted',
    bankIfsc: 'restricted',
    bankName: 'restricted',
    uanNumber: 'restricted',
    esicNumber: 'restricted',
    contactNumber: 'restricted',
    personalEmail: 'restricted',
    emergencyContact: 'restricted',
    salary: 'restricted',
    ctc: 'restricted',

    // Confidential
    medicalHistory: 'confidential',
    medicalRestrictions: 'confidential',
    disciplinaryNotes: 'confidential',
    grievanceDetails: 'confidential',
  },
};

/**
 * Which roles can see which sensitivity tiers.
 * Higher-tier access implies lower-tier access.
 */
const ROLE_FIELD_ACCESS: Record<string, SensitivityTier[]> = {
  super_admin: ['public', 'internal', 'restricted', 'confidential'],
  hr_admin: ['public', 'internal', 'restricted', 'confidential'],
  hr_executive: ['public', 'internal', 'restricted'],
  time_office: ['public', 'internal'],
  payroll_maker: ['public', 'internal', 'restricted'],
  payroll_approver: ['public', 'internal', 'restricted'],
  hod_manager: ['public', 'internal'],
  mgmt_approver: ['public', 'internal'],
  qa_compliance: ['public', 'internal'],
  ld_trainer: ['public', 'internal'],
  ehs_medical: ['public', 'internal', 'confidential'], // Medical can see confidential medical data
  recruiter: ['public', 'internal'],
  employee: ['public', 'internal', 'restricted'], // Can see own restricted data
  contractor_admin: ['public'],
  auditor: ['public', 'internal', 'restricted', 'confidential'], // Read-only but full visibility
  it_support: ['public'],
};

/**
 * Masking functions for sensitive fields.
 */
const MASK_FUNCTIONS: Record<string, (value: string) => string> = {
  panNumber: (v) => v ? `${v.substring(0, 2)}${'*'.repeat(5)}${v.substring(7)}` : '',
  aadhaarNumber: (v) => v ? `${'*'.repeat(8)}${v.substring(8)}` : '',
  bankAccountNumber: (v) => v ? `${'*'.repeat(v.length - 4)}${v.substring(v.length - 4)}` : '',
  contactNumber: (v) => v ? `${'*'.repeat(6)}${v.substring(v.length - 4)}` : '',
  personalEmail: (v) => {
    if (!v) return '';
    const [local, domain] = v.split('@');
    return `${local.substring(0, 2)}${'*'.repeat(local.length - 2)}@${domain}`;
  },
  salary: (v) => '***',
  ctc: (v) => '***',
};

@Injectable()
export class FieldAccessService {
  /**
   * Filter/mask fields in a record based on the user's role and access level.
   *
   * @param record - The raw database record
   * @param user - The authenticated request user
   * @param entityType - The type of entity (e.g. 'employee')
   * @param isSelf - Whether this is the user's own record (relaxed masking for 'self')
   */
  filterFields<T extends Record<string, any>>(
    record: T,
    user: RequestUser,
    entityType: string,
    isSelf: boolean = false,
  ): Partial<T> {
    const fieldMap = FIELD_SENSITIVITY_MAP[entityType];
    if (!fieldMap) {
      // No field sensitivity defined for this entity type — return as-is
      return record;
    }

    const allowedTiers = this.getAccessibleTiers(user, isSelf);
    const result: Record<string, any> = {};

    for (const [field, value] of Object.entries(record)) {
      const tier = fieldMap[field];

      if (!tier) {
        // Field not in sensitivity map — default to 'internal' visibility
        if (allowedTiers.has('internal')) {
          result[field] = value;
        }
        continue;
      }

      if (allowedTiers.has(tier)) {
        // User can see this field — return as-is
        result[field] = value;
      } else if (this.shouldMask(tier, allowedTiers)) {
        // User can't see raw value — apply masking
        const maskFn = MASK_FUNCTIONS[field];
        result[field] = (maskFn != null) && value ? maskFn(String(value)) : '[RESTRICTED]';
      }
      // If tier is 'confidential' and user doesn't have access, field is omitted entirely
    }

    return result as Partial<T>;
  }

  /**
   * Filter fields for a list of records.
   */
  filterFieldsList<T extends Record<string, any>>(
    records: T[],
    user: RequestUser,
    entityType: string,
  ): Partial<T>[] {
    return records.map((record) => this.filterFields(record, user, entityType));
  }

  /**
   * Check if the user can access a specific field.
   */
  canAccessField(
    user: RequestUser,
    entityType: string,
    fieldName: string,
    isSelf: boolean = false,
  ): boolean {
    const fieldMap = FIELD_SENSITIVITY_MAP[entityType];
    if (!fieldMap) return true;

    const tier = fieldMap[fieldName];
    if (!tier) return true;

    const allowedTiers = this.getAccessibleTiers(user, isSelf);
    return allowedTiers.has(tier);
  }

  /**
   * Get the sensitivity tier for a specific field.
   */
  getFieldSensitivity(entityType: string, fieldName: string): SensitivityTier | null {
    return FIELD_SENSITIVITY_MAP[entityType]?.[fieldName] || null;
  }

  /**
   * Get the list of fields the user CANNOT see for an entity type.
   * Useful for SELECT queries to avoid loading restricted data.
   */
  getRestrictedFields(user: RequestUser, entityType: string): string[] {
    const fieldMap = FIELD_SENSITIVITY_MAP[entityType];
    if (!fieldMap) return [];

    const allowedTiers = this.getAccessibleTiers(user, false);
    const restricted: string[] = [];

    for (const [field, tier] of Object.entries(fieldMap)) {
      if (!allowedTiers.has(tier)) {
        restricted.push(field);
      }
    }

    return restricted;
  }

  // --- Private helpers ---

  private getAccessibleTiers(user: RequestUser, isSelf: boolean): Set<SensitivityTier> {
    const tiers = new Set<SensitivityTier>();

    for (const roleCode of user.roles) {
      const roleTiers = ROLE_FIELD_ACCESS[roleCode];
      if (roleTiers) {
        for (const tier of roleTiers) {
          tiers.add(tier);
        }
      }
    }

    // Self-access: employees can always see their own restricted data
    if (isSelf) {
      tiers.add('public');
      tiers.add('internal');
      tiers.add('restricted');
    }

    return tiers;
  }

  /**
   * Determine if a field should be masked (shown partially) vs omitted entirely.
   * Restricted fields are masked; Confidential fields are omitted.
   */
  private shouldMask(
    fieldTier: SensitivityTier,
    allowedTiers: Set<SensitivityTier>,
  ): boolean {
    // If the field is 'restricted' and user has 'internal' access, mask it
    // If the field is 'confidential', omit entirely
    if (fieldTier === 'restricted' && allowedTiers.has('internal')) {
      return true;
    }
    return false;
  }
}
