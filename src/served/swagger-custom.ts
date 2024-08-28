async function postData(url, data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  if (response.status >= 400) {
    throw new Error("invalid credentials");
  }
  return response.json();
}

const AUTH_CREDENTIALS = {
  email: "admin@gmail.com",
  password: "02012001",
};

postData("api/v1/auth/login", AUTH_CREDENTIALS)
  .then((data) => {
    setTimeout(() => {
      (window as any).ui.preauthorizeApiKey("JWT-auth", data?.data?.access_token);
      console.log("preauth success");
    }, 1000);
  })
  .catch((e) => {
    console.error(`preauth failed: ${e}`);
  });
