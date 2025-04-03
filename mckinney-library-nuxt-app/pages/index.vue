<!--Login Page -->

<template>
  <!-- Header (logo and link to website)-->
  <header class="navbar">
    <div class="logo">
      <img src="/logo.jpg" alt="MPLF Logo" />
    </div>
    <nav>
      <a href="https://mckinneyplf.org" target="_blank">MPLF Website</a>
    </nav>
  </header>

  <!-- Login Form -->
  <div class="container">
    <div class="wrapper">
      <form @submit.prevent="validateForm" ref="loginForm">
        <h1>Welcome!</h1>
        <h3>Please sign in to continue</h3>

        <div class="input-box">
          <input type="text" v-model.trim="email" placeholder="Email" required ref="emailInput" />
        </div>
        <div class="input-box">
          <input type="password" v-model.trim="password" placeholder="Password" required ref="passwordInput" />
        </div>

        <div class="remember-forgot">
          <label><input type="checkbox" v-model="rememberMe"> Remember me</label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" class="btn">Sign in</button>

        <div class="request-invitation">
          <p><a href="#">Or Request an Invitation</a></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { navigateTo } from '#app';

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const emailInput = ref(null);
    const passwordInput = ref(null);
    const loginForm = ref(null);

    const validateForm = () => {
  let isValid = true;

  // Updated email validation pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email.value.trim()) {
    emailInput.value.setCustomValidity("Please enter your email.");
    isValid = false;
  } else if (!emailPattern.test(email.value.trim())) {
    emailInput.value.setCustomValidity("Please enter a valid email address (example@domain.com).");
    isValid = false;
  } else {
    emailInput.value.setCustomValidity(""); // Reset validation message
  }

  // Updated password validation pattern
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
  if (!password.value) {
    passwordInput.value.setCustomValidity("Please enter your password.");
    isValid = false;
  } else if (!passwordPattern.test(password.value)) {
    passwordInput.value.setCustomValidity(
      "Password must be 8-20 characters long, include an uppercase letter, a lowercase letter, and a number."
    );
    isValid = false;
  } else {
    passwordInput.value.setCustomValidity(""); // Reset validation message
  }

  // Trigger built-in validation messages
  emailInput.value.reportValidity();
  passwordInput.value.reportValidity();

  if (isValid) {
    alert("Form submitted successfully!");
    navigateTo("/dashboard");
  }
};

// Watch the form fields to reset any validation state when changed
watchEffect(() => {
  if (email.value) {
    emailInput.value.setCustomValidity("");
  }
  if (password.value) {
    passwordInput.value.setCustomValidity("");
  }
});

    return {
      email,
      password,
      rememberMe,
      validateForm,
      emailInput,
      passwordInput,
      loginForm,
    };
  },
};

definePageMeta({
  layout: 'login'
});
</script>



<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Aclonica&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Alice', sans-serif;
}

body, .container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #ECF3FF;
}

.wrapper {
  width: 420px;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,.1);
}

.wrapper h1 {
  font-size: 35px;
  text-align: center;
  color: #42446A;
  margin-bottom: 10px;
  font-family: 'Aclonica', san-serif;
}

.wrapper h3 {
  font-size: 17px;
  font-weight: 100;
  text-align: center;
  color: #42446A;
}

.wrapper .input-box {
  width: 100%;
  height: 50px;
  margin: 15px 0;
}

.wrapper .input-box:nth-of-type(2) {
  margin-bottom: 30px;
}

.input-box input {
  width: 100%;
  height: 100%;
  background: #ECF3FF;
  border: none;
  outline: none;
  border: 1.5px solid rgba(184, 183, 183, 0.848);
  border-radius: 10px;
  font-size: 16px;
  color: grey;
  padding: 5px 10px 10px 10px;
}

.input-box input::placeholder {
  color: #666;
}

.wrapper .remember-forgot {
  display: flex;
  flex-direction: column;
  font-size: 15px;
  margin: -15px 0 15px;
  align-items: flex-start;
}

.remember-forgot label {
  color: #42446A;
  margin-bottom: 5px;
}

.remember-forgot label input {
  accent-color: #fff;
  margin-right: 3px;
}

.remember-forgot a {
  color: #42446A;
  text-decoration: none;
}

.remember-forgot a:hover {
  text-decoration: underline;
}

.wrapper .btn {
  width: 40%;
  height: 45px;
  background: #ECF3FF;
  border: none;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  cursor: pointer;
  font-size: 16px;
  color: #42446A;
  font-weight: 600;
  display: block;
  margin: 20px auto;
  font-family: 'Aclonica', sans-serif;
}

.wrapper .btn:hover {
  background: #dbe7f9;
}

.wrapper .request-invitation {
  font-size: 14.5px;
  text-align: center;
  margin-top: 20px;
}

.request-invitation p a {
  color: #42446A;
  text-decoration: none;
}

.request-invitation p a:hover {
  text-decoration: underline;
}
/* Header Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 10px 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  width: 160px;
  height: auto;
  margin-right: 10px;
}

nav a {
  margin: 0 10px;
  text-decoration: underline;
  color: #333;
  font-weight: none;
  font-size: 12px;
}

.logout {
  background: #545679;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 8px;
}

</style>
