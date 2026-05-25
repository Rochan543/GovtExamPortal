import { Router, type IRouter } from "express";
import { db, questionsTable } from "@workspace/db";
import { eq, and, ilike } from "drizzle-orm";
import { authenticate, requireAdmin } from "../middlewares/authenticate";

const router: IRouter = Router();

router.get("/questions", authenticate, async (req, res): Promise<void> => {
  const { examId, sectionId, subjectId, topicId, difficulty, search } = req.query as Record<string, string>;

  let questions = await db.select().from(questionsTable);

  if (examId) questions = questions.filter(q => q.examId === parseInt(examId, 10));
  if (sectionId) questions = questions.filter(q => q.sectionId === parseInt(sectionId, 10));
  if (subjectId) questions = questions.filter(q => q.subjectId === parseInt(subjectId, 10));
  if (topicId) questions = questions.filter(q => q.topicId === parseInt(topicId, 10));
  if (difficulty) questions = questions.filter(q => q.difficulty === difficulty);
  if (search) questions = questions.filter(q => q.questionText.toLowerCase().includes(search.toLowerCase()));

  res.json(questions);
});

router.post("/questions", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const { questionText, optionA, optionB, optionC, optionD, correctAnswer, marks, ...rest } = req.body;
  if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer || !marks) {
    res.status(400).json({ error: "Required fields missing" });
    return;
  }
  const [question] = await db.insert(questionsTable).values({
    questionText, optionA, optionB, optionC, optionD, correctAnswer, marks, ...rest,
  }).returning();
  res.status(201).json(question);
});

router.get("/questions/:id", authenticate, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [question] = await db.select().from(questionsTable).where(eq(questionsTable.id, id));
  if (!question) { res.status(404).json({ error: "Question not found" }); return; }
  res.json(question);
});

router.patch("/questions/:id", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const updates = req.body;
  const [question] = await db.update(questionsTable).set(updates).where(eq(questionsTable.id, id)).returning();
  if (!question) { res.status(404).json({ error: "Question not found" }); return; }
  res.json(question);
});

router.delete("/questions/:id", authenticate, requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [question] = await db.delete(questionsTable).where(eq(questionsTable.id, id)).returning();
  if (!question) { res.status(404).json({ error: "Question not found" }); return; }
  res.sendStatus(204);
});

export default router;
