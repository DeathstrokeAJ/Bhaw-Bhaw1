// actions.js
export const saveCredentials = (credentials) => ({
    type: "SAVE_CREDENTIALS",
    payload: credentials,
  });
  
  export const setNewsletterSubscription = (status) => ({
    type: "SET_NEWSLETTER_SUBSCRIPTION",
    payload: status,
  });
  