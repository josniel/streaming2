<template>
  <div>
    <div class="text-h3 text-bold text-primary text-center q-mt-xl">Salas</div>
    <q-btn color="primary" no-caps label="Nueva Sala" icon="add" class="q-ml-md" @click="showDialog()"/>
    <div :key="index" v-for="(item, index) in rooms" class="row justify-around">
      <q-card class="col-3 row items-center justify-center q-pa-lg bg-primary q-my-sm" @click="item.user_id === user._id ? $router.push('/room/' + item._id) : $router.push('/streaming/' + item._id)">
        <div class="text-white text-bold">{{item.name}}</div>
      </q-card>
    </div>
    <q-dialog v-model="show">
      <q-card class="row items-center justify-center q-pa-lg">
        <q-input bg-color="white" v-model="form.name" label="Introduzca el nombre" outlined dense error-message="Ingrese su nombre"/>
        <q-btn color="primary" no-caps label="Nueva Sala" icon="add" class="q-ml-md" @click="setRoom()"/>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      rooms: [],
      form: {},
      show: false,
      user: {}
    }
  },
  form: {
    name: { required }
  },
  mounted () {
    this.getRooms()
    this.getUser()
  },
  methods: {
    async getRooms () {
      this.$api.get('getRooms').then(res => {
        if (res) {
          this.rooms = res
        }
      })
    },
    async showDialog () {
      this.show = true
    },
    async setRoom () {
      this.$q.loading.show({
        message: 'Creando Sala...'
      })
      this.$api.post('setRoom', this.form).then(res => {
        if (res) {
          this.$q.loading.hide()
          this.$q.notify({
            message: 'Sala creada con exito',
            color: 'positive'
          })
          this.show = false
          this.form = {}
          this.getRooms()
        }
      })
    },
    async getUser () {
      await this.$api('user_info').then(res => {
        if (res) {
          this.user = res
        }
      })
    }
  }
}
</script>
