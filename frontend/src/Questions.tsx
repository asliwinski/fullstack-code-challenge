import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  getQuestions,
  deleteQuestion,
  upsertQuestion,
} from "@queries/questions";
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

enum ModalType {
  UPSERT_QUESTION = "UPSERT_QUESTION",
  DELETE_QUESTION = "DELETE_QUESTION",
}

export function Questions() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const query = useQuery({ queryKey: ["questions"], queryFn: getQuestions });

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setModalOpen(ModalType.UPSERT_QUESTION);
    setCurrentQuestion(
      query.data?.find(
        (q: Question) => q._id === event.currentTarget.dataset.question
      )
    );
  }

  function handleClickDelete(event: React.MouseEvent<HTMLButtonElement>) {
    setModalOpen(ModalType.DELETE_QUESTION);
    setCurrentQuestion(
      query.data?.find(
        (q: Question) => q._id === event.currentTarget.dataset.question
      )
    );
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
            onMutate={query.refetch}
          />
        );
      case ModalType.DELETE_QUESTION:
        return (
          <DeleteDialog
            question={currentQuestion}
            onClose={reset}
            onMutate={query.refetch}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      {query.isLoading && <p>Loading...</p>}
      {query.isError && <p>Error: {query.error.message}</p>}
      {query.data && (
        <ol className="divide-y divide-gray-200">
          {query.data.map((question: any) => (
            <li
              className="flex p-2 items-center gap-2 justify-between"
              key={question._id}
            >
              {/*<div>{question.content}</div>*/}
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

type QuestionDialogProps = {
  question?: any;
  onClose: () => void;
  onMutate: () => void;
};

function QuestionDialog({ question, onClose, onMutate }: QuestionDialogProps) {
  const [content, setContent] = useState(question?.content || "");

  const questionMutation = useMutation({
    mutationFn: ({ content }: { content: string }) => {
      return upsertQuestion(content, question);
    },
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
          {/*<DialogDescription>{question.content}</DialogDescription>*/}
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
            onClick={() => questionMutation.mutate({ content })}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({ question, onClose, onMutate }: DialogProps) {
  const questionDelete = useMutation({
    mutationFn: () => {
      return deleteQuestion(question._id);
    },
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
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button type="submit" onClick={() => questionDelete.mutate()}>
            Delete question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DialogProps = {
  question: any;
  onClose: () => void;
  onMutate: () => void;
};

type Question = any;
