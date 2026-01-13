"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Loader2,
  Zap,
  Clock,
  AlertTriangle,
  Target,
  BookOpen,
  Award,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import type {
  ExamType,
  ExamSubject,
  ExamResult,
  ExamSession as ExamSessionType,
} from "@/types/exam";
import { EXAM_CONFIGS, EXAM_XP_REWARDS } from "@/types/exam";

interface ExamSessionProps {
  childId: string;
  childGrade: string;
  onComplete?: (result: ExamResult) => void;
  onCancel?: () => void;
}

type Phase = "config" | "loading" | "exam" | "submitting" | "results";

const SUBJECT_OPTIONS: { value: ExamSubject; label: string }[] = [
  { value: "MATHEMATIQUES", label: "Mathematiques" },
  { value: "FRANCAIS", label: "Francais" },
  { value: "HISTOIRE_GEO", label: "Histoire-Geo" },
  { value: "SCIENCES", label: "Sciences" },
  { value: "ANGLAIS", label: "Anglais" },
  { value: "PHYSIQUE_CHIMIE", label: "Physique-Chimie" },
  { value: "SVT", label: "SVT" },
  { value: "PHILOSOPHIE", label: "Philosophie" },
];

const GRADE_TO_EXAM: Record<string, ExamType[]> = {
  TROISIEME: ["BREVET", "CUSTOM"],
  PREMIERE: ["BAC", "CUSTOM"],
  TERMINALE: ["BAC", "CUSTOM"],
};

export function ExamSession({
  childId,
  childGrade,
  onComplete,
  onCancel,
}: ExamSessionProps) {
  const [phase, setPhase] = useState<Phase>("config");
  const [examType, setExamType] = useState<ExamType>("CUSTOM");
  const [subject, setSubject] = useState<ExamSubject>("MATHEMATIQUES");
  const [difficulty, setDifficulty] = useState<"standard" | "challenging">(
    "standard",
  );
  const [session, setSession] = useState<ExamSessionType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, string | number | string[]>
  >({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldAutoSubmitRef = useRef<boolean>(false);

  // Available exam types for this grade
  const availableExamTypes = GRADE_TO_EXAM[childGrade] || ["CUSTOM"];

  // Timer effect
  useEffect(() => {
    if (phase === "exam" && session) {
      const updateTimer = () => {
        const now = Date.now();
        const endTime = new Date(session.endsAt).getTime();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remaining);

        if (remaining <= 0) {
          shouldAutoSubmitRef.current = true;
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, session]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (shouldAutoSubmitRef.current && phase === "exam") {
      shouldAutoSubmitRef.current = false;
      // Call submit without using callback dependency
      const autoSubmit = async () => {
        if (!session) return;
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("submitting");
        const timeSpent = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        );
        try {
          const response = await fetch("/api/exam-mode/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: session.id,
              childId,
              examType: session.examType,
              subject: session.subject,
              gradeLevel: session.gradeLevel,
              questions: session.questions,
              answers,
              timeSpent,
            }),
          });
          if (!response.ok) throw new Error("Erreur lors de la soumission");
          const examResult = (await response.json()) as ExamResult;
          setResult(examResult);
          setPhase("results");
          onComplete?.(examResult);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Erreur lors de la soumission",
          );
          setPhase("exam");
        }
      };
      autoSubmit();
    }
  }, [timeLeft, phase, session, childId, answers, onComplete]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Start exam
  const handleStart = useCallback(async () => {
    setPhase("loading");
    setError(null);
    startTimeRef.current = Date.now();

    try {
      const response = await fetch("/api/exam-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          examType,
          subject,
          difficulty,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors du chargement");
      }

      const examSession = (await response.json()) as ExamSessionType;
      setSession(examSession);
      setPhase("exam");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de lancer l'examen",
      );
      setPhase("config");
    }
  }, [childId, examType, subject, difficulty]);

  // Submit exam
  const handleSubmit = useCallback(async () => {
    if (!session) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("submitting");

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const response = await fetch("/api/exam-mode/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          childId,
          examType: session.examType,
          subject: session.subject,
          gradeLevel: session.gradeLevel,
          questions: session.questions,
          answers,
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission");
      }

      const examResult = (await response.json()) as ExamResult;
      setResult(examResult);
      setPhase("results");
      onComplete?.(examResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la soumission",
      );
      setPhase("exam");
    }
  }, [session, answers, childId, onComplete]);

  // Handle answer change
  const handleAnswerChange = (
    questionId: string,
    answer: string | number | string[],
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Navigation
  const handleNext = () => {
    if (session && currentIndex < session.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Retry
  const handleRetry = () => {
    setSession(null);
    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
    setPhase("config");
  };

  // Config Screen
  if (phase === "config") {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">
            Mode Revision Examen
          </h3>
          <p className="mt-2 text-gray-500">
            Entraine-toi dans les conditions reelles d&apos;un examen
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {/* Exam Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type d&apos;examen
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {availableExamTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setExamType(type)}
                  className={cn(
                    "rounded-xl border-2 p-3 text-center transition-colors",
                    examType === type
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <span className="font-medium">
                    {EXAM_CONFIGS[type].label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Matiere
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as ExamSubject)}
              className="mt-2 w-full rounded-xl border-2 border-gray-200 p-3 focus:border-amber-500 focus:outline-none"
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Difficulte
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setDifficulty("standard")}
                className={cn(
                  "rounded-xl border-2 p-3 text-center transition-colors",
                  difficulty === "standard"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <span className="font-medium">Standard</span>
                <p className="text-xs text-gray-500">Niveau attendu</p>
              </button>
              <button
                onClick={() => setDifficulty("challenging")}
                className={cn(
                  "rounded-xl border-2 p-3 text-center transition-colors",
                  difficulty === "challenging"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <span className="font-medium">Exigeant</span>
                <p className="text-xs text-gray-500">Pour se depasser</p>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-xl bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">
                  Duree: {EXAM_CONFIGS[examType].defaultDuration} minutes
                </p>
                <p className="text-sm text-amber-600">
                  {EXAM_CONFIGS[examType].defaultQuestionCount} questions •
                  Chronometre actif
                </p>
              </div>
            </div>
          </div>

          {/* XP Preview */}
          <div className="rounded-xl bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Zap className="h-4 w-4" />
              <span>
                Gagne jusqu&apos;a{" "}
                <strong>
                  {EXAM_XP_REWARDS.COMPLETION +
                    EXAM_XP_REWARDS.PERFECT +
                    EXAM_XP_REWARDS.PER_CORRECT_QUESTION *
                      EXAM_CONFIGS[examType].defaultQuestionCount}{" "}
                  XP
                </strong>{" "}
                avec un score parfait!
              </span>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              <AlertTriangle className="mr-2 inline h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Annuler
              </Button>
            )}
            <Button
              onClick={handleStart}
              className="flex-1 gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              Commencer l&apos;examen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (phase === "loading") {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-amber-100" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-amber-600" />
          </div>
          <p className="mt-4 font-medium text-gray-900">
            Preparation de l&apos;examen...
          </p>
          <p className="mt-1 text-sm text-gray-500">
            L&apos;IA genere des questions adaptees a ton niveau
          </p>
        </div>
      </div>
    );
  }

  // Submitting Screen
  if (phase === "submitting") {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-amber-600" />
          <p className="mt-4 font-medium text-gray-900">
            Correction en cours...
          </p>
          <p className="mt-1 text-sm text-gray-500">
            L&apos;IA analyse tes reponses
          </p>
        </div>
      </div>
    );
  }

  // Results Screen
  if (phase === "results" && result) {
    const isPassing = result.percentage >= 50;
    const isGood = result.percentage >= 70;
    const isExcellent = result.percentage >= 90;

    return (
      <div className="space-y-6">
        {/* Score Card */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="text-center">
            <div
              className={cn(
                "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
                isExcellent
                  ? "bg-gradient-to-br from-amber-400 to-yellow-500"
                  : isGood
                    ? "bg-emerald-100"
                    : isPassing
                      ? "bg-blue-100"
                      : "bg-orange-100",
              )}
            >
              {isExcellent ? (
                <Trophy className="h-10 w-10 text-white" />
              ) : isGood ? (
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              ) : isPassing ? (
                <Target className="h-10 w-10 text-blue-600" />
              ) : (
                <TrendingUp className="h-10 w-10 text-orange-600" />
              )}
            </div>

            <h3 className="mt-4 text-2xl font-bold text-gray-900">
              {result.grade}
            </h3>

            <div
              className={cn(
                "mx-auto mt-4 w-40 rounded-xl py-4",
                isGood
                  ? "bg-emerald-100"
                  : isPassing
                    ? "bg-blue-100"
                    : "bg-orange-100",
              )}
            >
              <p
                className={cn(
                  "text-4xl font-bold",
                  isGood
                    ? "text-emerald-700"
                    : isPassing
                      ? "text-blue-700"
                      : "text-orange-700",
                )}
              >
                {result.percentage}%
              </p>
              <p className="text-sm text-gray-500">
                {result.totalScore}/{result.maxScore} points
              </p>
            </div>

            {/* XP Earned */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-white">
              <Zap className="h-4 w-4" />
              <span className="font-semibold">+{result.xpEarned} XP</span>
            </div>

            {/* Time */}
            <p className="mt-3 text-sm text-gray-500">
              <Clock className="mr-1 inline h-4 w-4" />
              Temps: {formatTime(result.timeSpent)}
            </p>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h4 className="flex items-center gap-2 font-semibold text-gray-900">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Analyse Detaillee
          </h4>

          <p className="mt-4 text-gray-700">{result.aiAnalysis.summary}</p>

          {/* Strengths */}
          {result.aiAnalysis.strengths.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-emerald-700">
                Points forts
              </p>
              <ul className="mt-2 space-y-1">
                {result.aiAnalysis.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {result.aiAnalysis.weaknesses.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-orange-700">A ameliorer</p>
              <ul className="mt-2 space-y-1">
                {result.aiAnalysis.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Target className="h-4 w-4 shrink-0 text-orange-500" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.aiAnalysis.recommendations.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-blue-700">Conseils</p>
              <ul className="mt-2 space-y-1">
                {result.aiAnalysis.recommendations.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <ArrowRight className="h-4 w-4 shrink-0 text-blue-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Encouragement */}
          <div className="mt-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4">
            <p className="text-sm font-medium text-amber-800">
              {result.aiAnalysis.encouragement}
            </p>
          </div>
        </div>

        {/* Question Review */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h4 className="font-semibold text-gray-900">Revue des Questions</h4>
          <div className="mt-4 space-y-3">
            {result.questionResults.map((qr, idx) => (
              <div
                key={qr.questionId}
                className={cn(
                  "rounded-xl border p-4",
                  qr.isCorrect
                    ? "border-emerald-200 bg-emerald-50"
                    : qr.partialCredit
                      ? "border-amber-200 bg-amber-50"
                      : "border-red-200 bg-red-50",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    Question {idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        qr.isCorrect
                          ? "text-emerald-600"
                          : qr.partialCredit
                            ? "text-amber-600"
                            : "text-red-600",
                      )}
                    >
                      {qr.score}/{qr.maxPoints} pts
                    </span>
                    {qr.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{qr.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-3">
          <Button onClick={handleRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Nouvel examen
          </Button>
        </div>
      </div>
    );
  }

  // Exam Screen
  if (!session) return null;

  const currentQuestion = session.questions[currentIndex];
  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k] !== undefined && answers[k] !== "",
  ).length;
  const isTimeWarning = timeLeft < 300; // Less than 5 minutes

  return (
    <div className="space-y-4">
      {/* Timer & Progress Header */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2",
                isTimeWarning
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700",
              )}
            >
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Question {currentIndex + 1} / {session.questions.length}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {answeredCount}/{session.questions.length} repondues
            </span>
            <Button
              onClick={handleSubmit}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Terminer
            </Button>
          </div>
        </div>
        <Progress
          value={((currentIndex + 1) / session.questions.length) * 100}
          className="mt-3 h-2"
        />
      </div>

      {/* Question Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              currentQuestion.type === "mcq"
                ? "bg-blue-100 text-blue-700"
                : currentQuestion.type === "short_answer"
                  ? "bg-emerald-100 text-emerald-700"
                  : currentQuestion.type === "problem_solving"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-amber-100 text-amber-700",
            )}
          >
            {currentQuestion.type === "mcq"
              ? "QCM"
              : currentQuestion.type === "short_answer"
                ? "Reponse courte"
                : currentQuestion.type === "problem_solving"
                  ? "Probleme"
                  : "Reflexion"}
          </span>
          <span className="text-sm text-gray-500">
            {currentQuestion.points} point
            {currentQuestion.points > 1 ? "s" : ""}
          </span>
        </div>

        <h4 className="text-lg font-medium text-gray-900">
          {currentQuestion.question}
        </h4>

        {/* Steps hint for problem solving */}
        {currentQuestion.steps && currentQuestion.steps.length > 0 && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500">
              Etapes suggerees:
            </p>
            <ol className="mt-1 list-inside list-decimal text-sm text-gray-600">
              {currentQuestion.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Answer Input */}
        <div className="mt-6">
          {currentQuestion.type === "mcq" && currentQuestion.options ? (
            <div className="space-y-2">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerChange(currentQuestion.id, opt.id)}
                  className={cn(
                    "w-full rounded-xl border-2 p-4 text-left transition-colors",
                    answers[currentQuestion.id] === opt.id
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <span className="font-medium">{opt.text}</span>
                </button>
              ))}
            </div>
          ) : currentQuestion.type === "essay" ? (
            <textarea
              value={(answers[currentQuestion.id] as string) || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value)
              }
              placeholder="Redige ta reponse ici..."
              className="h-48 w-full rounded-xl border-2 border-gray-200 p-4 focus:border-amber-500 focus:outline-none"
            />
          ) : (
            <input
              type="text"
              value={(answers[currentQuestion.id] as string) || ""}
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value)
              }
              placeholder="Ta reponse..."
              className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-amber-500 focus:outline-none"
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
        <Button
          onClick={handlePrev}
          variant="outline"
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Precedent
        </Button>

        {/* Question dots */}
        <div className="hidden gap-1 sm:flex">
          {session.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-3 w-3 rounded-full transition-colors",
                idx === currentIndex
                  ? "bg-amber-500"
                  : answers[session.questions[idx].id]
                    ? "bg-emerald-400"
                    : "bg-gray-200",
              )}
            />
          ))}
        </div>

        {currentIndex < session.questions.length - 1 ? (
          <Button
            onClick={handleNext}
            className="gap-2 bg-amber-500 hover:bg-amber-600"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            Terminer l&apos;examen
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
