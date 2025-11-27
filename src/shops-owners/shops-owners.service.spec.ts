import { Test, TestingModule } from '@nestjs/testing';
import { ShopsOwnersService } from './shops-owners.service';

describe('ShopsOwnersService', () => {
  let service: ShopsOwnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopsOwnersService],
    }).compile();

    service = module.get<ShopsOwnersService>(ShopsOwnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
