export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  triggerX: number; // world x position to trigger
}

export class QuizSystem {
  currentQuestion: QuizQuestion | null = null;
  answered = false;
  triggeredIndices: Set<number> = new Set();

  checkTrigger(questions: QuizQuestion[], playerWorldX: number): QuizQuestion | null {
    for (let i = 0; i < questions.length; i++) {
      if (!this.triggeredIndices.has(i) && playerWorldX >= questions[i].triggerX) {
        this.triggeredIndices.add(i);
        this.currentQuestion = questions[i];
        this.answered = false;
        return questions[i];
      }
    }
    return null;
  }

  answer(index: number): boolean {
    if (!this.currentQuestion || this.answered) return false;
    this.answered = true;
    return index === this.currentQuestion.correctIndex;
  }

  dismiss() {
    this.currentQuestion = null;
    this.answered = false;
  }

  reset() {
    this.currentQuestion = null;
    this.answered = false;
    this.triggeredIndices.clear();
  }
}
