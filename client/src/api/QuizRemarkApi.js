const createQuizRemark = async (quizId, questionId, comment) => {
  return fetch("/api/quiz-remarks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quizId: quizId,
      question: questionId,
      studentComment: comment,
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

const getQuizRemark = async (quizId) => {
  return fetch(`/api/quiz-remarks/my/${quizId}`, {
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

const getAllQuizRemarks = async (quizId) => {
  return fetch(`/api/quiz-remarks/all/${quizId}`, {
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

const resolveQuizRemark = async (quizRemarkId, score, instructorComment) => {
  return fetch(`/api/quiz-remarks/resolve/${quizRemarkId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      quizRemarkId: quizRemarkId,
      score: score,
      instructorComment: instructorComment,
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

const getRemarkInfoForStudent = async (questionId) => {
  return fetch(`/api/quiz-remarks/studentInfo/${questionId}`, {
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
      if (!result.success) {
        console.error(result.message);
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getRemarkInfoForInstructor = async (quizRemarkId) => {
  return fetch(`/api/quiz-remarks/instructorInfo/${quizRemarkId}`, {
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
      if (!result.success) {
        console.error(result.message);
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
};

export {
  createQuizRemark,
  getQuizRemark,
  getAllQuizRemarks,
  resolveQuizRemark,
  getRemarkInfoForStudent,
  getRemarkInfoForInstructor,
};
