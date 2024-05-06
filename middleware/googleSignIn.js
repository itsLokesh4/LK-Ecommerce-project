function googleSignIn() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(() => {
      const user = auth2.currentUser.get();
      const profile = user.getBasicProfile();
      const idToken = user.getAuthResponse().id_token;
  
      // Send the ID token to your server to authenticate the user
      //...
  
      // Redirect the user to the home page or another page
      window.location.href = '/';
    });
  }