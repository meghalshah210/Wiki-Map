function signUp(data) {
  console.log("inside signup - network");
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
