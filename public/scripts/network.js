function signUp(data) {
  return $.ajax({
    method: "POST",
    url: "/api/users/register",
    data,
  });
}

function logIn(data) {
  return $.ajax({
    method: "POST",
    url: "/api/users/login",
    data,
  });
}
