export async function getQuestions() {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/questions`);
  return await response.json();
}

export async function upsertQuestion(content: string, question?: any) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/questions${
      question ? `/${question._id}` : ""
    }`,
    {
      method: question ? "PUT" : "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
}

export async function deleteQuestion(questionId: string) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/questions/${questionId}`,
    {
      method: "DELETE",
    }
  );
  return await response.json();
}
