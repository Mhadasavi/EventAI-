import { Router } from 'express';
import {
  handleChat,
  handleGeneratePlan,
  handleAuditContract,
} from '../controllers/gemini.controller';

const router = Router();

router.post(['/chat', '/api/gemini/chat'], handleChat);
router.post(['/generate-plan', '/api/gemini/generate-plan'], handleGeneratePlan);
router.post(['/audit-contract', '/api/gemini/audit-contract'], handleAuditContract);

export { router as geminiRouter };
export default router;
