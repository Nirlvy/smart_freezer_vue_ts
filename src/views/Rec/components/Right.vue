<template>
  <el-card>
    <div class="info">
      <div class="title">识别商品</div>
      <el-form ref="ruleFormRef" class="form" label-width="auto" :model="data" :rules="rules">
        <el-form-item prop="name" label="名称">
          {{ data.name }}
        </el-form-item>
        <el-form-item label="选择">
          <el-switch v-model="data.choice" class="ml-2" inline-prompt active-text="拍照上传" inactive-text="手动上传" />
        </el-form-item>
        <el-form-item prop="img" label="上传图片">
          <el-image v-if="data.choice" :src="data.img != '' ? data.img : '../src/assets/img/img.png'" class="avatar" @click="getVideo" />
          <el-upload v-else class="avatar-uploader" :show-file-list="false" :before-upload="beforeUpload">
            <img v-if="data.img != ''" :src="data.img" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" size="large" round @click="upload(ruleFormRef)"> 上传 </el-button>
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
import { ElMessage, ElNotification, FormInstance, FormRules, UploadProps } from 'element-plus'
import { reactive, ref } from 'vue'
import { client } from '@/components/vue/Manage.vue'

const data = reactive({
  name: '',
  img: '',
  choice: true,
  dialog: false,
})
const videoRef = ref<HTMLVideoElement | null>(null)
const stream = ref<MediaStream | null>(null)
const constraints = {
  video: {
    width: { ideal: 400 },
    height: { ideal: 400 },
  },
}
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
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
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('不能大于2MB!')
  }
  const reader = new FileReader()
  reader.readAsDataURL(rawFile)
  reader.onload = () => {
    data.img = reader.result ? reader.result.toString() : ''
  }
  return false
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
      client.send('realtime_idenrec', data.img)
      ElMessage.success('发送成功')
      client.subscribe('realtime_iden')
      client.onMessageArrived = (message) => {
        if (message.destinationName === 'realtime_iden') {
          data.name = message.payloadString
        }
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
.avatar {
  width: 200px;
  height: 200px;
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
