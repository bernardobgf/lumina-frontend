const loginTab = document.getElementById("login-tab");
const registerTab = document.getElementById("register-tab");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

loginTab.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");

  loginTab.classList.add("bg-violet-600", "text-white");
  registerTab.classList.remove("bg-violet-600", "text-white");
});

registerTab.addEventListener("click", () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");

  registerTab.classList.add("bg-violet-600", "text-white");
  loginTab.classList.remove("bg-violet-600", "text-white");
  loginTab.classList.add("text-gray-400");
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("register-name").value;

  const email = document.getElementById("register-email").value;

  const password = document.getElementById("register-password").value;

  try {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    alert(data.message);

    registerForm.reset();

    loginTab.click();
  } catch (error) {
    alert(error.message);
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;

  const password = document.getElementById("login-password").value;

  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    localStorage.setItem("token", data.token);

    window.location.href = "app.html";
  } catch (error) {
    alert(error.message);
  }
});
