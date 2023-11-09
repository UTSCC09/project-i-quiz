async function updateAccentColor(courseId, accentColor) {
  return fetch("/api/courses/accent_color", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({
      courseId,
      accentColor,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    });
}

async function dropCourse(courseId) {
  return fetch("/api/courses/drop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({ courseId }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    });
}

// Fetch enrolled courses
async function fetchEnrolledCourses() {
  return fetch("/api/courses/enrolled", {
    method: "GET",
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
}

// Fetch instructed courses
async function fetchInstructedCourses() {
  return fetch("/api/courses/instructed", {
    method: "GET",
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
}

export {
  updateAccentColor,
  dropCourse,
  fetchEnrolledCourses,
  fetchInstructedCourses,
};
