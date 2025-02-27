<template>
  <div class="login-page">
  <div class="wrapper">
    <form @submit.prevent="handleSubmit">
      <h1>Welcome!</h1>
      <h3>Please sign in to continue</h3>

      <div class="input-box">
        <input type="text" v-model="email" placeholder="Email" required />
      </div>
      <div class="input-box">
        <input type="password" v-model="password" placeholder="Password" required />
      </div>

      <div class="remember-forgot">
        <label>
          <input type="checkbox" v-model="rememberMe" />Remember me
        </label>
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
export default {
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
    };
  },
  methods: {
    handleSubmit() {
      console.log("Logging in with:", this.email, this.password, this.rememberMe);
      // Handle login logic here (API call, validation, etc.)
    },
  },
};

definePageMeta({
  layout: false, // This removes the default layout (header, navbar)
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

body {
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
  font-family: 'Aclonica', sans-serif;
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
</style>
