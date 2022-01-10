<template>
  <div class="column items-center q-pa-md">
    <div style="width:87%" class="q-my-md row justify-center">
      <q-card class="bg-grey-3 q-px-md q-pt-lg q-mb-lg q-pb-xs col-6">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div class="q-ml-sm col-12 text-subtitle1 text-primary">Nombre</div>
          <div class="text-grey q-ml-sm q-mb-xs">Ingrese el nombre</div>
          <q-input bg-color="white" rounded v-model="form.full_name" outlined dense
          error-message="Ingrese su nombre"
          :error="$v.form.full_name.$error" @blur="$v.form.full_name.$touch()"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div class="q-ml-sm col-12 text-subtitle1 text-primary">Correo</div>
          <div class="text-grey q-ml-sm q-mb-xs">Ingrese el correo</div>
          <q-input bg-color="white"
          v-model="form.email"
          type="email"
          outlined
          rounded
          dense
          error-message="Ingrese un email válido"
          :error="$v.form.email.$error"
          @blur="$v.form.email.$touch()"
          />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div class="q-ml-sm col-12 text-subtitle1 text-primary">Contraseña</div>
          <div class="text-grey q-ml-sm q-mb-xs">Ingrese la Contraseña</div>
          <q-input bg-color="white"
          :type="isPwd ? 'password' : 'text'"
          v-model="password"
          outlined
          rounded
          dense
          error-message="Ingrese una contraseña válida, mínimo 6 caracteres"
          :error="$v.password.$error"
          @blur="$v.password.$touch()">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer" color="primary" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div class="q-ml-sm col-12 text-subtitle1 text-primary">Repetir contraseña</div>
          <div class="text-grey q-ml-sm q-mb-xs">Repite tu contraseña</div>
          <q-input bg-color="white"
          :type="isPwd2 ? 'password' : 'text'"
          v-model="repeatPassword"
          outlined
          rounded
          dense
          error-message="Las contraseñas deben ser iguales"
          :error="$v.repeatPassword.$error"
          @blur="$v.repeatPassword.$touch()" >
          <template v-slot:append>
            <q-icon :name="isPwd2 ? 'visibility' : 'visibility_off'" class="cursor-pointer" color="primary" @click="isPwd2 = !isPwd2" />
          </template>
          </q-input>
        </div>
        <div class="row justify-center q-mb-lg">
          <q-btn no-caps class="q-py-xs" color="primary" text-color="white" label="Registrar" style="width:90%"
          @click="setUser()"/>
        </div>
      </q-card>
    </div>
  </div>
</template>
<script>
import { required, maxLength, email, sameAs, minLength } from 'vuelidate/lib/validators'
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      isPwd: true,
      isPwd2: true,
      password: '',
      repeatPassword: '',
      form: {}
    }
  },
  validations: {
    form: {
      full_name: { required },
      email: { required, email }
    },
    password: { required, maxLength: maxLength(256), minLength: minLength(6) },
    repeatPassword: { sameAsPassword: sameAs('password') }
  },
  mounted () {
    // this.getCountries()
  },
  methods: {
    ...mapMutations('generals', ['login']),
    async setUser () {
      this.$v.form.$touch()
      this.$v.password.$touch()
      this.$v.repeatPassword.$touch()
      if (!this.$v.form.$error && !this.$v.password.$error && !this.$v.repeatPassword.$error) {
        this.$q.loading.show({
          message: 'Registrando...'
        })
        this.form.password = this.password
        this.form.rols = 2
        var formData = new FormData()
        formData.append('dat', JSON.stringify(this.form))
        await this.$api.post('register', formData, {
          headers: {
            'Content-Type': undefined
          }
        }).then(res => {
          if (res) {
            this.$q.loading.hide()
            this.$q.notify({
              message: 'Ya formas parte, Bienvenido',
              color: 'positive'
            })
            this.loguear()
          }
        })
      }
    },
    loguear () {
      this.$api.post('login', this.form).then(res => {
        if (res) { // Se debe ejecutar una mutacion que modifique el state con sessionInfo
          const client = res.TRI_SESSION_INFO.roles.find(value => value === 2)
          if (client) {
            this.login(res)
            this.$router.push('/rooms')
          } /* else {
            this.login(res)
            this.$router.push('/')
          } */
        } else {
          console.log('error de ususario')
        }
        this.$q.loading.hide()
      })
    }
  }
}
</script>
