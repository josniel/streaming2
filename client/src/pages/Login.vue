<template>
  <div class="column items-center" style="height:100%; width:100%">
    <div class="q-mt-xl row justify-center" style="width:80%; height:8%">
      <q-card class="bg-grey-3 q-px-md q-pt-lg q-pb-xl">
        <div class="row justify-center">
          <div class="col-12 q-ml-sm text-subtitle1 text-primary">Correo</div>
          <div class="col-12 q-ml-sm q-mb-xs text-grey text-weight-regular">Ingrese su correo electronico</div>
          <q-input
            bg-color="white"
            style="width: 100%"
            rounded
            dense
            outlined
            v-model="form.email"
            :error="$v.form.email.$error"
            error-message="Este campo es requerido"
            @blur="$v.form.email.$touch()"
            type="email"/>
        </div>
        <div class="row justify-center">
          <div class="col-12 q-ml-sm text-subtitle1 text-primary">Contraseña</div>
          <div class="col-12 q-ml-sm q-mb-xs text-grey text-weight-regular">Ingresa tu contraseña</div>
          <q-input
            bg-color="white"
            style="width: 100%"
            rounded
            dense
            outlined
            v-model="form.password"
            :error="$v.form.password.$error"
            error-message="Este campo es requerido"
            @blur="$v.form.password.$touch()"
            :type="isPwd ? 'password' : 'text'">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"/>
              </template>
          </q-input>
          <div class="row items-center">
            <div class="text-center text-grey">Olvide</div>
            <div class="text-center q-ml-xs text-primary">mi contraseña</div>
          </div>
        </div>
        <div class="row justify-center items-center">
          <q-btn flat no-caps dense color="grey" label="Registrarme" @click="$router.push('/registro/cliente')"/>
        </div>
        <div class="q-mt-md row justify-center q-mb-xl">
            <q-btn no-caps class="q-py-xs" color="primary" text-color="white" label="Iniciar Sesión" :loading="loading" style="width:90%"
            @click="loguear()"/>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      loading: false,
      form: {
      },
      isPwd: true
    }
  },
  validations: {
    form: {
      email: { required },
      password: { required }
    }
  },
  methods: {
    ...mapMutations('generals', ['login']),
    loguear () {
      this.$v.$touch()
      if (!this.$v.form.$error) {
        this.loading = true
        this.$q.loading.show({
          message: 'Iniciando sesión'
        })
        this.$api.post('login', this.form).then(res => {
          if (res) { // Se debe ejecutar una mutacion que modifique el state con sessionInfo
            // const client = res.TRI_SESSION_INFO.roles.find(value => value === 2)
            if (res.TRI_SESSION_INFO.enable === false) {
              this.loading = false
              this.$q.dialog({
                title: 'Alerta',
                message: 'Este usuario ha sido bloqueado por el administrador. Debe ponerse en contacto con nosotros para más información.',
                cancel: false,
                persistent: true
              }).onOk(() => {
                // ok
              }).onCancel(() => {
                // cancel
              })
            } else if (res.TRI_SESSION_INFO.roles[0] === 3) {
              this.login(res)
              this.$router.push('/')
            } else if (res.TRI_SESSION_INFO.roles[0] === 2) {
              this.login(res)
              this.$router.push('/rooms')
            } else if (res.TRI_SESSION_INFO.roles[0] === 1) {
              this.login(res)
              this.$router.push('/inicio_administrador')
            }
          } else {
            console.log('error de ususario')
            this.loading = false
            this.$q.loading.hide()
          }
          this.$q.loading.hide()
        })
      }
    }
  }

}
</script>

<style>

</style>
