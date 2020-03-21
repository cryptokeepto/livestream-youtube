async function login() {
  try {
    window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=468852174650-ggnokgn4bn6hlu4vdurhvldr1icqdar0.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Fcryptokeepto.com%2Fcallback.html&scope=https://www.googleapis.com/auth/youtube&response_type=token `;
  } catch (error) {
    console.error(error);
  }
}
