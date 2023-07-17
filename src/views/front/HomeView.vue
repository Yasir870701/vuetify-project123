<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <h1>購物網</h1>
      </VCol>
      <VCol cols="12" md="6" lg="3" v-for="product in products" :key="product._id">
        <ProductCard v-bind="product"></ProductCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
import { api } from '@/plugins/axios'
import { ref } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import ProductCard from '@/components/ProductCard.vue'

const createSnackbar = useSnackbar()

const products = ref([]);

(async () => {
  try {
    const { data } = await api.get('/products')
    products.value.push(...data.result)
  } catch (error) {
    createSnackbar({
      text: error.response.data.message,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
})()
</script>
