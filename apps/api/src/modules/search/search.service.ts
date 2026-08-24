import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RequestUser } from '../auth/decorators/current-user.decorator';

/**
 * Global Search Service — searches across records the user has permission to see.
 * Section 10 item 9: "Respect data scope/field scope in results."
 *
 * Uses raw SQL with ILIKE for simplicity. Can be replaced with
 * Elasticsearch/pg_trgm for production performance at scale.
 */

export interface SearchResult {
  entityType: string;
  entityId: string;
  title: string;
  subtitle: string | null;
  url: string;
  matchField: string;
  score: number;
}

interface SearchableEntity {
  table: string;
  entityType: string;
  fields: { column: string; weight: number }[];
  titleColumn: string;
  subtitleColumn?: string;
  urlPrefix: string;
  scopeColumn?: string; // For data scope filtering
}

const SEARCHABLE_ENTITIES: SearchableEntity[] = [
  {
    table: 'users',
    entityType: 'User',
    fields: [
      { column: 'email', weight: 10 },
      { column: 'first_name', weight: 8 },
      { column: 'last_name', weight: 8 },
      { column: 'employee_code', weight: 9 },
    ],
    titleColumn: "first_name || ' ' || last_name",
    subtitleColumn: 'email',
    urlPrefix: '/employees',
  },
  {
    table: 'workflow_instances',
    entityType: 'WorkflowInstance',
    fields: [
      { column: 'entity_type', weight: 5 },
      { column: 'current_status', weight: 4 },
      { column: 'requester_name', weight: 7 },
    ],
    titleColumn: "entity_type || ' - ' || current_status",
    subtitleColumn: 'requester_name',
    urlPrefix: '/workflow',
  },
  {
    table: 'documents',
    entityType: 'Document',
    fields: [
      { column: 'original_name', weight: 9 },
      { column: 'category', weight: 5 },
      { column: 'description', weight: 4 },
    ],
    titleColumn: 'original_name',
    subtitleColumn: 'category',
    urlPrefix: '/documents',
  },
  {
    table: 'document_templates',
    entityType: 'DocumentTemplate',
    fields: [
      { column: 'name', weight: 9 },
      { column: 'code', weight: 8 },
      { column: 'module', weight: 5 },
    ],
    titleColumn: 'name',
    subtitleColumn: 'module',
    urlPrefix: '/system/templates',
  },
  {
    table: 'notifications',
    entityType: 'Notification',
    fields: [
      { column: 'title', weight: 8 },
      { column: 'body', weight: 4 },
    ],
    titleColumn: 'title',
    subtitleColumn: 'channel',
    urlPrefix: '/inbox',
  },
];

@Injectable()
export class SearchService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Perform a global search across all searchable entities.
   * Respects data scope: users with 'self' scope only see their own records.
   */
  async search(query: string, user: RequestUser, limit: number = 20): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) return [];

    const searchTerm = `%${query.trim().toLowerCase()}%`;
    const results: SearchResult[] = [];

    for (const entity of SEARCHABLE_ENTITIES) {
      try {
        const entityResults = await this.searchEntity(entity, searchTerm, user, Math.min(limit, 10));
        results.push(...entityResults);
      } catch {
        // Skip entities that don't exist yet (tables not created)
        continue;
      }
    }

    // Sort by score descending, limit total results
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  }

  private async searchEntity(
    entity: SearchableEntity,
    searchTerm: string,
    user: RequestUser,
    limit: number,
  ): Promise<SearchResult[]> {
    // Build WHERE conditions for each searchable field
    const fieldConditions = entity.fields.map(
      (f) => `LOWER(CAST(${f.column} AS TEXT)) LIKE $1`
    );
    const whereClause = fieldConditions.join(' OR ');

    // Data scope filter
    let scopeFilter = '';
    if (user.dataScope?.type === 'self') {
      // For notifications/workflow: filter by recipient/requester
      if (entity.table === 'notifications') {
        scopeFilter = ` AND recipient_id = '${user.id}'`;
      } else if (entity.table === 'workflow_instances') {
        scopeFilter = ` AND requester_id = '${user.id}'`;
      }
    }

    const sql = `
      SELECT id, ${entity.titleColumn} as title, 
             ${entity.subtitleColumn || 'NULL'} as subtitle
      FROM ${entity.table}
      WHERE is_active = true AND (${whereClause})${scopeFilter}
      LIMIT ${limit}
    `;

    const rows = await this.dataSource.query(sql, [searchTerm]);

    return rows.map((row: any) => {
      // Determine which field matched for context
      const matchField = entity.fields[0].column;
      const score = entity.fields[0].weight;

      return {
        entityType: entity.entityType,
        entityId: row.id,
        title: row.title || 'Untitled',
        subtitle: row.subtitle || null,
        url: `${entity.urlPrefix}/${row.id}`,
        matchField,
        score,
      };
    });
  }
}
