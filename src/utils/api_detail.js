export const API_url = "http://localhost:3000";
if (process.env.NODE_ENV === 'production') {
  API_url = 'enterProdURL';
}