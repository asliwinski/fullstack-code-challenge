export async function getAnswersForUser(userId: string) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${userId}/answers`
  );
  return await response.json();
}

export async function upsertAnswer(
  userId: string,
  content: string,
  questionId: string,
  answer: any
) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${userId}/answers${
      answer ? `/${answer._id}` : ""
    }`,
    {
      method: answer ? "PUT" : "POST",
      body: JSON.stringify({ userId, questionId, content }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
}

export async function deleteAnswer(userId: string, answer: any) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/${userId}/answers/${answer._id}`,
    {
      method: "DELETE",
    }
  );
  return await response.json();
}
