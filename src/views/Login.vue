<template>
  <div id="authentication">
    <div class="card" style="width: 400px">
      <header class="card-header">
        <p class="card-header-title">
          {{ mode === "login" ? "Login" : "Register" }}
        </p>
      </header>

      <div class="card-content">
        <CardLoginRegister :mode="mode" @on-register-success="mode = 'login'" />
      </div>
      <footer class="card-footer">
        <div class="auth-action-label-container card-footer-item">
          <p @click="mode = 'register'" v-if="mode === 'login'">
            Click here to Register
          </p>
          <p @click="mode = 'login'" v-if="mode === 'register'">
            Click here to Sign in
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import CardLoginRegister from "@/components/Authentication/FormLoginRegister";
export default {
  components: { CardLoginRegister },
  data() {
    return {
      mode: "login",
    };
  },
};
</script>
<style scoped lang="scss">
#authentication {
  width: 100%;
  min-height: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .auth-action-label-container {
    &:hover {
      cursor: pointer;
      color: purple;
    }
  }
}
</style>
