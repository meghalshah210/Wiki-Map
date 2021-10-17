// Client facing scripts here
$(() => {
  // <section id="login-container">
  // <div class="img">
  //   <img src='../../assets/map.png' alt='image' height=400px width=400px>
  // </div>
  // <div class="login-form">
  //   <h1>Login</h1>
  const $logInForm = $(`
      <form id="login-form" method="POST" action="api/users/login">
        <div class="form-group">
          <label for="email">Email address</label>
            <input required type="email" class="form-control" style="width:300px;" id="email" name="email" placeholder="Enter email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
            <input required type="password" class="form-control" style="width:300px;" id="password" name="password" placeholder="Password">
        </div>
        <button type="submit" class="login-button">Login</button>
      </form>
    </div>
  </section>
  `);
  window.$logInForm = $logInForm;

  $("#login-form").on("submit", function (e) {
    e.preventDefault();

    const data = $(this).serialize();
    logIn(data).then((json) => {
      console.log("this is json from logIn:", json);
      if (!json.user) {
        views_manager.show("error", "Failed to login");
        return;
      }
      // header.update(json.user);
      console.log("logged in!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      views_manager.show("mapsDisplay");
    });
  });
});
