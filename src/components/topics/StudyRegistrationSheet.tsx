
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StudyRegistrationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicInfo: { id: number | string; title: string } | null;
  initialQuestionsAnswer: boolean | null;
  onInitialQuestionsAnswer: (hasAnsweredQuestions: boolean) => void;
  revisionInput: { topicId: number | string; correct: string; wrong: string } | null;
  onRevisionInputChange: (input: { topicId: number | string; correct: string; wrong: string }) => void;
  onRevisionSubmit: (e: React.FormEvent) => void;
}

export const StudyRegistrationSheet = ({
  open,
  onOpenChange,
  topicInfo,
  initialQuestionsAnswer,
  onInitialQuestionsAnswer,
  revisionInput,
  onRevisionInputChange,
  onRevisionSubmit,
}: StudyRegistrationSheetProps) => {
  if (!topicInfo) return null;
  
  const showRevisionForm = initialQuestionsAnswer && revisionInput?.topicId === topicInfo.id;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Registrar estudo de tema</SheetTitle>
          <SheetDescription>
            {topicInfo.title}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          {initialQuestionsAnswer === null ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-lg">Fez questões durante os estudos iniciais?</h3>
              </div>
              <p className="text-sm text-gray-600">
                Informar se você realizou questões durante o estudo inicial deste tema ajuda a organizar melhor seu cronograma de revisões.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => onInitialQuestionsAnswer(true)}
                  variant="default"
                  size="lg"
                  className="w-full"
                >
                  Sim, fiz questões
                </Button>
                <Button
                  onClick={() => onInitialQuestionsAnswer(false)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Não fiz questões
                </Button>
              </div>
            </div>
          ) : showRevisionForm ? (
            <form onSubmit={onRevisionSubmit} className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Registre seus acertos e erros iniciais (D0)</h3>
                <p className="text-sm text-gray-600">
                  Informe a quantidade de questões que você acertou e errou durante o estudo inicial.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Acertos
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={revisionInput?.correct || ""}
                    onChange={(e) =>
                      onRevisionInputChange({
                        topicId: topicInfo.id,
                        correct: e.target.value,
                        wrong: revisionInput?.wrong || ""
                      })
                    }
                    placeholder="Número de acertos"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Erros
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={revisionInput?.wrong || ""}
                    onChange={(e) =>
                      onRevisionInputChange({
                        topicId: topicInfo.id,
                        correct: revisionInput?.correct || "",
                        wrong: e.target.value
                      })
                    }
                    placeholder="Número de erros"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                variant="default"
                className="w-full mt-4"
              >
                Salvar resultados
              </Button>
            </form>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
};
