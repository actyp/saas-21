import { Test, TestingModule } from '@nestjs/testing';
import { QuestionManagementService } from './question-management.service';

describe('QuestionManagementService', () => {
  let service: QuestionManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionManagementService],
    }).compile();

    service = module.get<QuestionManagementService>(QuestionManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
