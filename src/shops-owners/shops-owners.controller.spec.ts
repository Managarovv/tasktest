import { Test, TestingModule } from '@nestjs/testing';
import { ShopsOwnersController } from './shops-owners.controller';

describe('ShopsOwnersController', () => {
  let controller: ShopsOwnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopsOwnersController],
    }).compile();

    controller = module.get<ShopsOwnersController>(ShopsOwnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
