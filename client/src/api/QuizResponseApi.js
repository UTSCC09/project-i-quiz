import { generateStudentPDF } from "utils/quizToPdfUtils";

const createQuizReponse = async (quizId, questionResponses) => {
  return fetch("/api/quiz-responses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quizId: quizId,
      questionResponses: questionResponses,
    }),
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      if (!result.success) {
        console.error(result.message);
        return null;
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getQuizResponse = async (quizId) => {
  return fetch(`/api/quiz-responses/my/${quizId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(err);
    });
};

const editQuizResponse = async (quizId, questionResponses) => {
  return fetch(`/api/quiz-responses/my/${quizId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionResponses: questionResponses,
    }),
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      if (!result.success) {
        console.error(result.message);
        return null;
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
};

const submitQuizResponse = async (quizId) => {
  return fetch(`/api/quiz-responses/submit/${quizId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quizId: quizId,
    }),
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(err);
    });
};

const generateStudentQuizPDF = async (quizId) => {
  return fetch(`/api/quiz-responses/generate/${quizId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      if (result.success) {
        const data = result.payload;
        const pdf = generateStudentPDF(
          data.course,
          data.quiz,
          data.questions,
          data.user,
          data.quizResponse
        );
        if (pdf) {
          pdf.save(data.fileName);
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

const getAllStudentResponsesForQuiz = async (quizId) => {
  return fetch(`/api/quiz-responses/all/${quizId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(err);
    });
}; 

const gradeQuizResponse = async (quizId, studentId, questionGrades, isFullyGraded) => {
  return fetch(`/api/quiz-responses/grade`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quizId: quizId,
      studentId: studentId,
      questionGrades: questionGrades,
      isFullyGraded: isFullyGraded
    }),
    withCredentials: true,
  })
    .then(async (response) => {
      if (response.status === 401) {
        await fetch("/api/users/logout", { method: "GET" }).then(() => {
          window.location.reload();
        });
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.error(err);
    });
};

export {
  createQuizReponse,
  getQuizResponse,
  editQuizResponse,
  submitQuizResponse,
  generateStudentQuizPDF,
  getAllStudentResponsesForQuiz,
  gradeQuizResponse
};
