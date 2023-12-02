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

async function archiveCourse(courseId) {
  return fetch("/api/courses/archive", {
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

async function checkNewCourseAvailability(
  courseCode,
  CourseName,
  courseSemester
) {
  return fetch(`/api/courses/instructed/availability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({ courseCode, CourseName, courseSemester }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    });
}

async function createCourse(courseData) {
  return fetch("/api/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify(courseData),
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

async function fetchCourseObject(courseId) {
  return fetch("/api/courses/" + courseId, {
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
      return result;
    })
    .catch((err) => {
      console.error(err);
    });
}

async function updateAccessCode(courseId, accessCode) {
  return fetch("/api/courses/access_code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({
      courseId,
      accessCode,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      return result;
    });
}

async function enrollInCourse(courseId, accentColor, sessionNumber, onSuccess, onError) {
  return fetch("/api/courses/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    body: JSON.stringify({
      courseId,
      accentColor,
      sessionNumber,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        onSuccess(result.payload);
      }
      else {
        onError(result.message);
      }
    });
}

export {
  updateAccentColor,
  archiveCourse,
  dropCourse,
  checkNewCourseAvailability,
  createCourse,
  fetchEnrolledCourses,
  fetchInstructedCourses,
  updateAccessCode,
  fetchCourseObject,
  enrollInCourse,
};
