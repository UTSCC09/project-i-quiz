const createQuiz = async (quizData) => {
  return fetch("/api/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify(quizData),
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

const updateQuiz = async (quizData) => {
  return fetch("/api/quizzes/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify(quizData),
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

const getQuiz = async (quizId) => {
  return fetch(`/api/quizzes/${quizId}/questions`, {
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
        return null;
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getQuizzesForDashboard = async (quizStatus, userType) => {
  return fetch(`/api/quizzes/${quizStatus}/${userType}`, {
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
        return [];
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getQuizzesForInstructedCourse = async (courseId) => {
  return fetch(`/api/quizzes/course/instructed/${courseId}`, {
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
        return [];
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
};

const getQuizzesForEnrolledCourse = async (courseId) => {
  return fetch(`/api/quizzes/course/enrolled/${courseId}`, {
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
        return [];
      }
      return result.payload;
    })
    .catch((err) => {
      console.error(err);
    });
};

const basicUpdateQuiz = async (basicQuizUpdateData) => {
  return fetch("/api/quizzes", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify(basicQuizUpdateData),
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

const updateQuizQuestion = async (quizQuestionUpdateData) => {
  return fetch("/api/quizzes/question", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify(quizQuestionUpdateData),
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

const addQuizQuestions = async (quizQuestionsData) => {
  return fetch("/api/quizzes/question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify(quizQuestionsData),
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
  createQuiz,
  updateQuiz,
  getQuiz,
  getQuizzesForDashboard,
  getQuizzesForInstructedCourse,
  getQuizzesForEnrolledCourse,
  basicUpdateQuiz,
  updateQuizQuestion,
  addQuizQuestions,
};
