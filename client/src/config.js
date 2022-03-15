export default {
  apiUrl:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://exjobb-image-upscaling.herokuapp.com',
  title: 'Versus',
  isUser: true
}
