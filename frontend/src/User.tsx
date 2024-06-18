import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  upsertAnswer,
  deleteAnswer,
  getAnswersForUser,
} from "@queries/answers";
import { useParams } from "react-router-dom";
import { getUsers } from "@queries/users";
import { getQuestions } from "@queries/questions";
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

type Question = any;

enum ModalType {
  UPSERT_ANSWER = "UPSERT_ANSWER",
  DELETE_ANSWER = "DELETE_ANSWER",
}

export function User() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);

  const { userId } = useParams();
  const userAnswersQuery = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getAnswersForUser(userId!),
    enabled: !!userId,
  });
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: getUsers });
  const questionsQuery = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setModalOpen(ModalType.UPSERT_ANSWER);
    setCurrentQuestion(
      questionsQuery.data?.find(
        (q: Question) => q._id === event.currentTarget.dataset.question
      )
    );
  }

  function handleClickDelete(event: React.MouseEvent<HTMLButtonElement>) {
    setModalOpen(ModalType.DELETE_ANSWER);
    setCurrentQuestion(
      questionsQuery.data?.find(
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
      case ModalType.UPSERT_ANSWER:
        return (
          <AnswerDialog
            userId={userId || ""}
            question={currentQuestion}
            onClose={reset}
            onMutate={userAnswersQuery.refetch}
            answer={userAnswersQuery.data.find(
              (a: any) => a.question === currentQuestion._id
            )}
          />
        );
      case ModalType.DELETE_ANSWER:
        return (
          <DeleteDialog
            userId={userId || ""}
            question={currentQuestion}
            onClose={reset}
            onMutate={userAnswersQuery.refetch}
            answer={userAnswersQuery.data.find(
              (a: any) => a.question === currentQuestion._id
            )}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto ">
      {userAnswersQuery.isLoading && <p>Loading...</p>}
      {userAnswersQuery.isError && (
        <p>Error: {userAnswersQuery.error.message}</p>
      )}
      {usersQuery.data && (
        <div className="flex space-x-2">
          <div className="font-bold">User:</div>
          <div>
            {usersQuery.data.find((user: any) => user._id === userId)?.name}
          </div>
        </div>
      )}
      {userAnswersQuery.data && (
        <div>
          {userAnswersQuery.data.map((answer: any) => (
            <div key={answer._id}>
              <div className="flex items-center gap-2 justify-between">
                <div className="font-bold mt-4 mb-2">
                  {
                    questionsQuery.data?.find(
                      (question: any) => question._id === answer.question
                    )?.content
                  }
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    data-question={answer.question}
                    onClick={handleClick}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    data-question={answer.question}
                    onClick={handleClickDelete}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <p>{answer.content}</p>
            </div>
          ))}
        </div>
      )}

      <h1 className="text-xl font-bold text-center mb-4 mt-8">Add answer</h1>
      <div className="mb-6">
        {questionsQuery.isLoading && <p>Loading...</p>}
        {questionsQuery.isError && <p>Error: {questionsQuery.error.message}</p>}
        {questionsQuery.data && (
          <ol className="divide-y divide-gray-200">
            {questionsQuery.data
              ?.filter(
                (question: Question) =>
                  !userAnswersQuery.data
                    ?.map((a: any) => a.question)
                    .includes(question._id)
              )
              .map((question: any) => (
                <li
                  className="flex p-4 gap-2 items-center justify-between"
                  key={question._id}
                >
                  <div>{question.content}</div>
                  <Button
                    variant="outline"
                    data-question={question._id}
                    onClick={handleClick}
                  >
                    Add answer
                  </Button>
                </li>
              ))}
          </ol>
        )}
        {renderModal()}
      </div>
    </div>
  );
}

function AnswerDialog({
  userId,
  question,
  onClose,
  onMutate,
  answer,
}: DialogProps) {
  const [content, setContent] = useState(answer?.content || "");

  const answerMutation = useMutation({
    mutationFn: ({
      userId,
      content,
      questionId,
    }: {
      userId: string;
      content: string;
      questionId: string;
    }) => {
      return upsertAnswer(userId, content, questionId, answer);
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
          <DialogTitle>{`${answer ? "Edit" : "Add"} answer`}</DialogTitle>
          <DialogDescription>{question.content}</DialogDescription>
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
            onClick={() =>
              answerMutation.mutate({
                userId,
                content,
                questionId: question._id,
              })
            }
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({
  userId,
  question,
  onClose,
  onMutate,
  answer,
}: DialogProps) {
  const answerDelete = useMutation({
    mutationFn: ({ userId }: { userId: string }) => {
      return deleteAnswer(userId, answer);
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
          <DialogTitle>Delete answer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the answer to this question?
          </DialogDescription>
          <div className="font-bold text-sm">{question.content}</div>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button type="submit" onClick={() => answerDelete.mutate({ userId })}>
            Delete answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DialogProps = {
  userId: string;
  question: any;
  onClose: () => void;
  onMutate: () => void;
  answer?: any;
};
