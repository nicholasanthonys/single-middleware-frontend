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
          :rules="[val => val && val.length > 0||
          'Please type something']"
      />

      <q-input
          filled
          type="email"
          v-model="email"
          label="Email *"
          hint="Your Email"
          :rules="[val => !!val || 'Email is missing', isValidEmail]"
      />

      <q-input
          type="password"
          filled
          v-model="password"
          label="Your Password "
          :rules="[val =>val &&  val.length >= 8||
          'Password should at least 8 characters' ]"
      />

      <q-input
          v-if="mode==='register'"
          type="password"
          filled
          v-model="confirmPassword"
          label="Confirm Password "
          :rules="[val => !!val  || 'Confirm your password'
          ,isConfirmPasswordMatch ]"
      />


      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"/>
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
      email: null,
      password: null,
      confirmPassword: null,
      isLoading: false,
    }
  },
  methods: {
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || 'Invalid email';
    },
    isConfirmPasswordMatch(val) {
      return val === this.password || 'Password not match';
    },
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
      // Login
      if (this.mode === "login") {
        await this.login();
      } else {
        // Register
        await this.register();
      }
    },
    async login() {
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
        this.$q.notify({
          message: 'Login Success.',
          color: 'secondary'
        })

      } catch (err) {
        this.$q.notify({
          message: err.response.data.message,
          color: 'negative'
        })
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
        })
        this.$emit('on-register-success');
        this.$q.notify({
          message: 'Register Success.',
          color: 'secondary'
        })

      } catch (err) {
        this.message = 'Register Failed'
        this.$q.notify({
          message: err.response.data.message,
          color: 'negative'
        })
        console.log(err)
      }
    }
  }
}
</script>
