import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import { Answer, Question } from "@/types";

enum ModalType {
  UPSERT_ANSWER = "UPSERT_ANSWER",
  DELETE_ANSWER = "DELETE_ANSWER",
}

export function User() {
  const [currentQuestion, setCurrentQuestion] = useState<
    Question | null | undefined
  >(null);
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);

  const { userId } = useParams();
  const userAnswersQuery = trpc.getAnswersForUser.useQuery(userId!);
  const usersQuery = trpc.getUsers.useQuery();
  const questionsQuery = trpc.getQuestions.useQuery();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setCurrentQuestion(
      questionsQuery.data?.find(
        (q) => q._id === event.currentTarget.dataset.question
      )
    );
    setModalOpen(ModalType.UPSERT_ANSWER);
  }

  function handleClickDelete(event: React.MouseEvent<HTMLButtonElement>) {
    setCurrentQuestion(
      questionsQuery.data?.find(
        (q) => q._id === event.currentTarget.dataset.question
      )
    );
    setModalOpen(ModalType.DELETE_ANSWER);
  }

  function reset() {
    setCurrentQuestion(null);
    setModalOpen(null);
  }

  function renderModal() {
    if (!currentQuestion) return null;
    const answer = userAnswersQuery.data?.find(
      (a) => a.question === currentQuestion?._id
    );

    switch (modalOpen) {
      case ModalType.UPSERT_ANSWER:
        return (
          <AnswerDialog
            userId={userId || ""}
            question={currentQuestion}
            onClose={reset}
            onMutate={userAnswersQuery.refetch}
            answer={answer}
          />
        );
      case ModalType.DELETE_ANSWER:
        return answer ? (
          <DeleteAnswerDialog
            userId={userId || ""}
            question={currentQuestion}
            onClose={reset}
            onMutate={userAnswersQuery.refetch}
            answer={answer}
          />
        ) : null;
      default:
        return null;
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {userAnswersQuery.isLoading && <p>Loading...</p>}
      {userAnswersQuery.isError && (
        <p>Error: {userAnswersQuery.error.message}</p>
      )}
      {usersQuery.data && (
        <div className="flex space-x-2">
          <div className="font-bold">User:</div>
          <div>{usersQuery.data.find((user) => user._id === userId)?.name}</div>
        </div>
      )}
      {userAnswersQuery.data && (
        <div>
          {userAnswersQuery.data.map((answer) => (
            <div key={answer._id}>
              <div className="flex items-center gap-2 justify-between">
                <div className="font-bold mt-4 mb-2 text-justify">
                  {
                    questionsQuery.data?.find(
                      (question) => question._id === answer.question
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
              <p className="text-justify">{answer.content}</p>
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
                (question) =>
                  !userAnswersQuery.data
                    ?.map((a) => a.question)
                    .includes(question._id)
              )
              .map((question) => (
                <li
                  className="flex py-4 gap-2 items-center justify-between"
                  key={question._id}
                >
                  <div className="text-justify">{question.content}</div>
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
}: Omit<DialogProps, "answer"> & { answer?: Answer }) {
  const [content, setContent] = useState(answer?.content || "");

  const answerMutation = trpc.upsertAnswer.useMutation({
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
                answer,
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

function DeleteAnswerDialog({
  userId,
  question,
  onClose,
  onMutate,
  answer,
}: DialogProps) {
  const answerDelete = trpc.deleteAnswer.useMutation({
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
          <Button
            type="submit"
            onClick={() =>
              answerDelete.mutate({ answerId: answer._id, userId })
            }
          >
            Delete answer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DialogProps = {
  userId: string;
  question: Question;
  onClose: () => void;
  onMutate: () => void;
  answer: Answer;
};
