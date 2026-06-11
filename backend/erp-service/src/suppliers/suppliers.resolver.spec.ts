import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersResolver } from './suppliers.resolver';

describe('SuppliersResolver', () => {
  let resolver: SuppliersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliersResolver],
    }).compile();

    resolver = module.get<SuppliersResolver>(SuppliersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
