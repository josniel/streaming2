<template>
  <div>
    <div class="text-h3 text-bold text-primary text-center q-mt-lg">{{room.name}}</div>
    <div class="row justify-center q-my-lg">
      <video id="video" controls autoplay ></video>
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
      hasVideo: false
    }
  },
  mounted () {
    this.getRoomById()
    this.connectWebSocket()
    // window.URL = window.URL || window.webkitURL
    navigator.streaming = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    console.log('window >> ', window)
  },
  methods: {
    connectWebSocket () {
      ws.connect()
      this.roomChannel = ws.subscribe('room:' + this.id)
      const roomChannel = this.roomChannel
      console.log('roomChannel >> ', roomChannel)
      roomChannel.on('stream', (data) => {
        console.log('data >> ', data)
        if (data.isActive === true) {
          const video = document.querySelector('#video')
          video.srcObject = data.root.srcObject
        }
      })

      roomChannel.on('error', (error) => {
        console.log('This is the error', error)
      })

      /* roomChannel.on('close', () => {
      }) */
    },
    async getRoomById () {
      await this.$api.get('getRoomById/' + this.$route.params.id).then(res => {
        if (res) {
          this.room = res
        }
      })
    }
  }
}
</script>
