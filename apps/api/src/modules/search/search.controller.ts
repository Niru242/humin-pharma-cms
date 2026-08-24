import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /** GET /v1/search?q=term&limit=20 — Global search across all entities. */
  @Get()
  async search(
    @Query('q') q: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: RequestUser,
  ) {
    const results = await this.searchService.search(
      q,
      user as RequestUser,
      limit ? parseInt(limit, 10) : 20,
    );
    return { items: results, query: q, totalItems: results.length };
  }
}
