export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules:[
    '@vee-validate/nuxt',
    'nuxt-nodemailer',
    '@nuxtjs/tailwindcss',
  ],
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
  nodemailer: {
    from: process.env.NUXT_NODEMAILER_FROM,
    host: process.env.NUXT_NODEMAILER_HOST,
    port: parseInt(process.env.NUXT_NODEMAILER_PORT!),
    auth: {
      user: process.env.NUXT_NODEMAILER_EMAIL,
      pass: process.env.NUXT_NODEMAILER_PASS,
    },
  }
})