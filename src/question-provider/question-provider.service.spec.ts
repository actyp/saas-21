import { Test, TestingModule } from '@nestjs/testing';
import { QuestionProviderService } from './question-provider.service';

describe('QuestionProviderService', () => {
  let service: QuestionProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionProviderService],
    }).compile();

    service = module.get<QuestionProviderService>(QuestionProviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
