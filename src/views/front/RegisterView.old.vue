<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <h1>註冊</h1>
      </VCol>
      <VDivider></VDivider>
      <VCol cols="12">
        <VForm v-model="valid" @submit.prevent="register">
          <VTextField
            v-model="form.account"
            label="帳號"
            counter
            maxlength="20"
            :rules="[rules.required, rules.min, rules.max]"
          ></VTextField>
          <VTextField
            v-model="form.email"
            label="信箱"
            type="email"
            :rules="[rules.required, rules.email]"
          ></VTextField>
          <VTextField
            v-model="form.password"
            label="密碼"
            counter
            maxlength="20"
            type="password"
            :rules="[rules.required, rules.min, rules.max, rules.confirm]"
            ref="elPassword"
            @update:modelValue="elPasswordConfirm.validate()"
          ></VTextField>
          <VTextField
            v-model="form.confirmPassword"
            label="確認密碼"
            counter
            maxlength="20"
            type="password"
            :rules="[rules.required, rules.min, rules.max, rules.confirm]"
            ref="elPasswordConfirm"
            @update:modelValue="elPassword.validate()"
          ></VTextField>
          <div class="text-center">
            <VBtn type="submit" color="green">註冊</VBtn>
          </div>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import validator from 'validator'

const valid = ref(false)
const form = reactive({
  account: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const elPassword = ref(null)
const elPasswordConfirm = ref(null)

const rules = {
  required: (value) => !!value || '欄位必填',
  email: (value) => validator.isEmail(value) || '格式錯誤',
  min: (value) => value.length >= 4 || '長度必須大於 4 個字',
  max: (value) => value.length <= 20 || '長度必須小於 20 個字',
  confirm: (value) => form.confirmPassword === form.password || '密碼不一致'
}
</script>
