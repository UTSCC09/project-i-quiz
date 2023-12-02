const createQuizRemark = async (quizId, questionRemarks) => {
    return fetch("/api/quiz-remarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: quizId,
        questionRemarks: questionRemarks
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
  
const resolveQuizRemark = async (quizRemarkId, questionRemarks) => {
    return fetch(`/api/quiz-remarks/resolve/${quizRemarkId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId: quizId,
        questionRemarks,
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
        }
        return result.success;
      })
      .catch((err) => {
        console.error(err);
      });
  };
  
  export {
    createQuizRemark,
    getQuizRemark,
    getAllQuizRemarks,
    resolveQuizRemark
  };