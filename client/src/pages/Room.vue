<template>
  <div>
    <div class="text-h3 text-bold text-primary text-center q-mt-lg">{{room.name}}</div>
    <div class="q-ml-xl">
      <!-- <q-btn color="primary" label="Activar Video" no-caps icon="videocam" class="q-ml-md"/>
      <q-btn color="primary" label="Activar Audio" no-caps icon="music_note" class="q-ml-md"/> -->
      <q-toggle v-model="hasVideo" icon="videocam" color="primary" size="xl" @input="setVideo()"/>
      <!-- <q-toggle v-model="hasAudio" icon="music_note" color="primary" size="xl" @input="setAudio()"/> -->
    </div>
    <div v-if="hasVideo" class="row justify-center q-mb-lg">
      <video id="video" muted autoplay ></video>
      <!-- <canvas id="canvas" width="1280" height="720"></canvas> -->
    </div>
    <!-- <div v-if="!hasVideo && hasAudio" class="row justify-center q-mt-lg">
      <audio autoplay controls :src="audio"></audio>
    </div> -->
  </div>
</template>
<script>
import env from '../env'
import 'babel-polyfill'
import Ws from '@adonisjs/websocket-client'
const ws = Ws(env.sockectUrl)
export default {
  data () {
    return {
      id: this.$route.params.id,
      room: {},
      video: '',
      mediaStream: null,
      hasVideo: false,
      roomChannel: null
    }
  },
  async created () {
    this.connectWebSocket()
    // ws.connect()
  },
  mounted () {
    this.getRoomById()
    // this.connectSocket()
    // window.URL = window.URL || window.webkitURL
    navigator.streaming = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    console.log('window >> ', window)
    /* navigator.getUserMedia({ audio: true, video: true }, function (vid) {

    }) */
  },
  methods: {
    async getRoomById () {
      await this.$api.get('getRoomById/' + this.$route.params.id).then(res => {
        if (res) {
          this.room = res
        }
      })
    },
    async setVideo () {
      this.$q.loading.show()
      if (this.hasVideo) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        console.log('mediaStream :>> ', this.mediaStream)
        const video = document.querySelector('#video')
        video.srcObject = this.mediaStream
        this.initStream(video.srcObject)
        this.$q.loading.hide()
      } /* else {
        this.mediaStream = await navigator.mediaDevices.stop()
        console.log('mediaStream :>> ', this.mediaStream.Prototype)
        const video = document.querySelector('#video')
        video.srcObject = mediaStream
        this.$q.loading.hide()
      } */
      this.$q.loading.hide()
    },
    connectWebSocket () {
      ws.connect()
      this.roomChannel = ws.subscribe('room:' + this.id)
      const roomChannel = this.roomChannel
      console.log('roomChannel >> ', roomChannel)
      /* roomChannel.on('message', (data) => {
        console.log('data >> ', data)
        if (data === true) {
          this.$api.get('show_all_messages/' + this.id).then(v => {
            if (v) {
              this.data.messages = v.messages
            }
          })
        }
      }) */

      roomChannel.on('error', (error) => {
        console.log('This is the error', error)
      })

      /* roomChannel.on('close', () => {
      }) */
    },
    async initStream (media) {
      console.log('media >> ', media)
      // this.roomChannel = ws.getSubscription('consultation:' + this.id)
      this.roomChannel.emit('emitstream', {
        isNewStream: true,
        root: { ...media },
        topic: this.id
      })
    },
    goBack () {
      ws.close()
      this.$router.go(-1)
    }
  }
}
</script>
