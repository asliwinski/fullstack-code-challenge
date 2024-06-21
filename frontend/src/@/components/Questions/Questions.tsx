import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@api/trpcClient";
import type { Question } from "@/types";

enum ModalType {
  UPSERT_QUESTION = "UPSERT_QUESTION",
  DELETE_QUESTION = "DELETE_QUESTION",
}

export function Questions() {
  const [currentQuestion, setCurrentQuestion] = useState<
    Question | null | undefined
  >(null);
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const questionsQuery = trpc.getQuestions.useQuery();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setCurrentQuestion(
      questionsQuery.data?.find(
        (q) => q._id === event.currentTarget.dataset.question
      )
    );
    setModalOpen(ModalType.UPSERT_QUESTION);
  }

  function handleClickDelete(event: React.MouseEvent<HTMLButtonElement>) {
    setCurrentQuestion(
      questionsQuery.data?.find(
        (q) => q._id === event.currentTarget.dataset.question
      )
    );
    setModalOpen(ModalType.DELETE_QUESTION);
  }

  function reset() {
    setCurrentQuestion(null);
    setModalOpen(null);
  }

  function renderModal() {
    switch (modalOpen) {
      case ModalType.UPSERT_QUESTION:
        return (
          <QuestionDialog
            question={currentQuestion}
            onClose={reset}
            onMutate={questionsQuery.refetch}
          />
        );
      case ModalType.DELETE_QUESTION:
        return currentQuestion ? (
          <DeleteDialog
            question={currentQuestion}
            onClose={reset}
            onMutate={questionsQuery.refetch}
          />
        ) : null;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      {questionsQuery.isLoading && <p>Loading...</p>}
      {questionsQuery.isError && <p>Error: {questionsQuery.error.message}</p>}
      {questionsQuery.data && (
        <ol className="divide-y divide-gray-200">
          {questionsQuery.data.map((question) => (
            <li
              className="flex p-2 items-center gap-2 justify-between"
              key={question._id}
            >
              <div>{question.content}</div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  data-question={question._id}
                  onClick={handleClick}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  data-question={question._id}
                  onClick={handleClickDelete}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <Button onClick={() => setModalOpen(ModalType.UPSERT_QUESTION)}>
        Create new question
      </Button>
      {renderModal()}
    </div>
  );
}

function QuestionDialog({
  question,
  onClose,
  onMutate,
}: Omit<DialogProps, "question"> & {
  question?: Question | null;
}) {
  const [content, setContent] = useState(question?.content || "");

  const questionMutation = trpc.upsertQuestion.useMutation({
    onSuccess: () => {
      onClose();
      onMutate();
    },
    onError: (error) => console.error(error),
  });

  return (
    <Dialog defaultOpen onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`${question ? "Edit" : "Add"} question`}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => questionMutation.mutate({ content, question })}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({ question, onClose, onMutate }: DialogProps) {
  const questionDelete = trpc.deleteQuestion.useMutation({
    onSuccess: () => {
      onClose();
      onMutate();
    },
    onError: (error) => console.error(error),
  });

  return (
    <Dialog defaultOpen onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete question</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this question?
          </DialogDescription>
          <div className="font-bold text-sm">{question.content}</div>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => questionDelete.mutate(question._id)}
          >
            Delete question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DialogProps = {
  question: Question;
  onClose: () => void;
  onMutate: () => void;
};
