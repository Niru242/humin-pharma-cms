import { Injectable } from '@nestjs/common';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { RequestUser } from '../decorators/current-user.decorator';

/**
 * Data Scope Service — Layer 2 of the three-layer access control (Section 4).
 *
 * Applied at the QUERY level, not just the response. This means unauthorized
 * data never even reaches the application layer.
 *
 * Scope types:
 * - 'all'        → no filtering (Super Admin)
 * - 'company'    → filter by company_id IN user's assigned company IDs
 * - 'plant'      → filter by plant_id IN user's assigned plant IDs
 * - 'department' → filter by department_id IN user's assigned department IDs
 * - 'self'       → filter by employee_id = user's own employee record
 *
 * Usage in services:
 *   const qb = this.repo.createQueryBuilder('employee');
 *   this.dataScopeService.applyScope(qb, user, 'employee');
 *   return qb.getMany();
 */

export interface ScopeColumnMapping {
  companyColumn?: string;      // e.g. 'employee.company_id'
  plantColumn?: string;        // e.g. 'employee.plant_id'
  departmentColumn?: string;   // e.g. 'employee.department_id'
  selfColumn?: string;         // e.g. 'employee.id' or 'attendance.employee_id'
  selfValue?: string;          // defaults to user.id (can override to user's employee ID)
}

/**
 * Default column mappings for common entity types.
 * Services can override these when calling applyScope().
 */
const DEFAULT_MAPPINGS: Record<string, ScopeColumnMapping> = {
  employee: {
    companyColumn: 'employee.company_id',
    plantColumn: 'employee.plant_id',
    departmentColumn: 'employee.department_id',
    selfColumn: 'employee.user_id',
  },
  attendance: {
    companyColumn: 'attendance.company_id',
    plantColumn: 'attendance.plant_id',
    departmentColumn: 'attendance.department_id',
    selfColumn: 'attendance.employee_id',
  },
  leave: {
    companyColumn: 'leave.company_id',
    plantColumn: 'leave.plant_id',
    departmentColumn: 'leave.department_id',
    selfColumn: 'leave.employee_id',
  },
};

@Injectable()
export class DataScopeService {
  /**
   * Apply data scope filtering to a query builder.
   *
   * @param qb - TypeORM SelectQueryBuilder
   * @param user - The authenticated request user
   * @param entityAlias - The alias of the main entity in the query (e.g. 'employee')
   * @param overrideMapping - Custom column mapping (overrides defaults)
   */
  applyScope<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    user: RequestUser,
    entityAlias: string,
    overrideMapping?: Partial<ScopeColumnMapping>,
  ): SelectQueryBuilder<T> {
    const scopeType = user.dataScope?.type || 'self';
    const entityIds = user.dataScope?.entityIds || [];

    // 'all' scope = no filtering (Super Admin)
    if (scopeType === 'all') {
      return qb;
    }

    const mapping: ScopeColumnMapping = {
      ...(DEFAULT_MAPPINGS[entityAlias] || {}),
      ...overrideMapping,
    };

    switch (scopeType) {
      case 'company':
        if (mapping.companyColumn && entityIds.length > 0) {
          qb.andWhere(`${mapping.companyColumn} IN (:...scopeCompanyIds)`, {
            scopeCompanyIds: entityIds,
          });
        }
        break;

      case 'plant':
        if (mapping.plantColumn && entityIds.length > 0) {
          qb.andWhere(`${mapping.plantColumn} IN (:...scopePlantIds)`, {
            scopePlantIds: entityIds,
          });
        }
        break;

      case 'department':
        if (mapping.departmentColumn && entityIds.length > 0) {
          qb.andWhere(`${mapping.departmentColumn} IN (:...scopeDeptIds)`, {
            scopeDeptIds: entityIds,
          });
        }
        break;

      case 'self':
        if (mapping.selfColumn) {
          const selfValue = mapping.selfValue || user.id;
          qb.andWhere(`${mapping.selfColumn} = :scopeSelfId`, {
            scopeSelfId: selfValue,
          });
        }
        break;

      default:
        // Unknown scope type — default to most restrictive (self)
        if (mapping.selfColumn) {
          qb.andWhere(`${mapping.selfColumn} = :scopeSelfId`, {
            scopeSelfId: user.id,
          });
        }
    }

    return qb;
  }

  /**
   * Check if a specific record is within the user's data scope.
   * Use for single-record access checks (e.g., before update/delete).
   *
   * @returns true if the user can access this record
   */
  canAccessRecord(
    user: RequestUser,
    record: {
      companyId?: string;
      plantId?: string;
      departmentId?: string;
      userId?: string;
      employeeId?: string;
    },
  ): boolean {
    const scopeType = user.dataScope?.type || 'self';
    const entityIds = user.dataScope?.entityIds || [];

    switch (scopeType) {
      case 'all':
        return true;

      case 'company':
        return record.companyId ? entityIds.includes(record.companyId) : false;

      case 'plant':
        return record.plantId ? entityIds.includes(record.plantId) : false;

      case 'department':
        return record.departmentId ? entityIds.includes(record.departmentId) : false;

      case 'self':
        return (
          record.userId === user.id ||
          record.employeeId === user.id
        );

      default:
        return false;
    }
  }

  /**
   * Get the scope type display name for logging/error messages.
   */
  getScopeDescription(user: RequestUser): string {
    const scopeType = user.dataScope?.type || 'self';
    const entityIds = user.dataScope?.entityIds || [];

    switch (scopeType) {
      case 'all': return 'Full access (all plants)';
      case 'company': return `Company scope (${entityIds.length} companies)`;
      case 'plant': return `Plant scope (${entityIds.length} plants)`;
      case 'department': return `Department scope (${entityIds.length} departments)`;
      case 'self': return 'Self only';
      default: return 'Unknown scope';
    }
  }
}
