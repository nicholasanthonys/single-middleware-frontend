<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form
        @submit="onSubmit"
        @reset="resetForm"
        class="q-gutter-md"
    >
      <q-input
          filled
          v-model="name"
          label="Name *"
          hint="Name and surname"
          v-if="mode!=='login' "
      />

      <q-input
          filled
          type="email"
          v-model="email"
          label="Email *"
          hint="Your Email"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
          type="password"
          filled
          v-model="password"
          label="Your Password "

      />


      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script>

export default {
  props: {
    mode: String
  },
  watch: {
    /* whenever prop mode : login/register change, reset the from*/
    mode() {
      this.resetForm()
    }
  },
  data() {
    return {
      name: null,
      email: "test123@mailinator.com",
      password: "nicho1234",
      confirmPassword: null,
      isLoading  : false,
    }
  },
  methods: {
    resetForm() {
      this.name = null
      this.email = null
      this.password = null
      this.confirmPassword = null
      // You should call it on the next frame
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
    async onSubmit() {
      console.log("onSubmit triggered")
      // Login
      if (this.mode === "login") {
        await this.login();
      } else {
        // Register
        await this.register();
      }
    },
    async login() {
      console.log("Do login triggered")
      this.isLoading = true

      let credential = {
        email: this.email,
        password: this.password,
        redirect: '/',
      }
      try {
        this.isLoading = true
        await this.$store.dispatch('auth/login', credential)

        this.$emit('authenticated')

      } catch (err) {
        this.message = 'Login Failed'
      }
      this.isLoading = false
    },
    async register() {
      try {
        await this.$store.dispatch('auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          redirect : '/login'
        })

      } catch (err) {
        this.message = 'Register Failed'
        console.log(err)
      }
    }
  }
}
</script>
