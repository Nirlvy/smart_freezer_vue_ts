<template>
  <el-card>
    <div class="info">
      <div class="title">上传商品</div>
      <el-form :model="data" class="form" label-width="auto" :rules="rules">
        <el-form-item prop="name" label="名称">
          <el-input v-model="data.name" placeholder="" />
        </el-form-item>
        <el-form-item label="选择">
          <el-switch v-model="data.choice" class="ml-2" inline-prompt active-text="拍照上传" inactive-text="手动上传" />
        </el-form-item>
        <el-form-item prop="img" label="上传图片">
          <el-image v-if="data.choice" :src="data.img != '' ? data.img : '../src/assets/img/img.png'" @click="getVideo" />
          <el-upload v-else class="avatar-uploader" :show-file-list="false" :before-upload="beforeUpload" :auto-upload="false">
            <img v-if="data.img != ''" :src="data.img" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" size="large" round @click="upload(ruleFormRef)">上传</el-button>
        </el-form-item>
      </el-form>
      <el-dialog v-model="data.dialog" width="450" @closed="closeVideo">
        <div class="dialog">
          <video ref="videoRef" autoplay />
          <!-- <canvas ref="canvasRef" /> -->
          <el-button type="primary" @click="capture">拍照</el-button>
        </div>
      </el-dialog>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus'
import { reactive, ref } from 'vue'
import mqtt from 'paho-mqtt'

const data = reactive({
  name: '',
  img: '',
  choice: true,
  dialog: false,
})
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const constraints = {
  video: {
    width: { ideal: 400 },
    height: { ideal: 400 },
  },
}
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入产品名', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入产品名'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  img: [
    { required: true, message: '请选择图片', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择图片'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('必须为 JPG 或者 PNG 格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('不能大于2MB!')
    return false
  }
  return true
}

const vedio = () => {
  navigator.mediaDevices.getUserMedia(constraints).then((s) => {
    if (videoRef.value) {
      stream.value = s
      videoRef.value.srcObject = stream.value
    }
  })
}

const getVideo = () => {
  data.dialog = true
  vedio()
  drawBox()
}

const drawBox = () => {
  requestAnimationFrame(() => {
    const video = videoRef.value
    const canvas = canvasRef.value
    const context = canvas?.getContext('2d')
    const width = video?.videoWidth
    const height = video?.videoHeight
    if (canvas && width && height && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(video, 0, 0, width, height)
      context.strokeStyle = 'red'
      context.lineWidth = 5
      context.strokeRect(width / 4, height / 4, width / 2, height / 2)
      drawBox()
    }
  })
}

const capture = () => {
  if (!videoRef.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const context = canvas.getContext('2d')
  context?.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
  data.img = canvas.toDataURL('image/png')
  data.dialog = false
}

const closeVideo = () => {
  stream.value?.getTracks().forEach((track) => {
    track.stop()
  })
}

const upload = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      const client = new mqtt.Client('broker.emqx.io', 8083, 'nirlvy')
      client.connect({
        onSuccess: () => {
          console.log('Connected')
          client.send('/signup/send', data.img + '-' + data.name)
          client.subscribe('/signup/complete')
        },
        keepAliveInterval: 10,
        onFailure: (err) => {
          console.log('Connection failed:', err.errorMessage)
        },
      })
      client.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log('MQTT连接已断开：' + responseObject.errorMessage)
        }
      }
      client.onMessageArrived = (message) => {
        console.log('Message received:', message.payloadString)
        // TODO:接收
      }
    }
  })
}
</script>

<style scoped>
.title {
  font-size: xx-large;
  text-align: center;
  margin-bottom: 50px;
  align-items: center;
}
.form {
  font-size: larger;
}
.avatar-uploader {
  text-align: center;
}
.button {
  position: absolute;
  right: 0%;
  margin-top: 100px;
}
.dialog {
  display: flex;
  flex-direction: column;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 203px;
  height: 203px;
  text-align: center;
}
</style>
