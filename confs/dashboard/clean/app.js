// production environment
const issuerEGI = new openid.Issuer({
  issuer: "https://aai.egi.eu/auth/realms/egi",
  authorization_endpoint: "https://aai.egi.eu/auth/realms/egi/protocol/openid-connect/auth",
  token_endpoint: "https://aai.egi.eu/auth/realms/egi/protocol/openid-connect/token",
  userinfo_endpoint: "https://aai.egi.eu/auth/realms/egi/protocol/openid-connect/userinfo",
  jwks_uri: "https://aai.egi.eu/auth/realms/egi/protocol/openid-connect/certs"   
})

const clientEGI = new issuerEGI.Client({
  client_id: "aaaaa-bbbb-cccccc",
  client_secret: "XXXXXXX",
  redirect_uris: ["https://saps.vm.fedcloud.eosc-synergy.eu/auth-egi-callback"], //endpoind do saps-dashboard (app.js)
  response_types: ["code"],
});



// development environment
const issuerEGI = new openid.Issuer({
  issuer: "https://aai-dev.egi.eu/auth/realms/egi",
  authorization_endpoint: "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/auth",
  token_endpoint: "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/token",
  userinfo_endpoint: "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/userinfo",
  jwks_uri: "https://aai-dev.egi.eu/auth/realms/egi/protocol/openid-connect/certs"
})


const clientEGI = new issuerEGI.Client({
  client_id: "aaaaa-bbbb-cccccc",
  client_secret: "XXXXXXX",
  redirect_uris: ["http://localhost:8081/auth-egi-callback"],             //endpoind do saps-dashboard (app.js)
  // redirect_uris: ["https://saps-test.lsd.ufcg.edu.br/auth-egi-callback"],   //endpoind do saps-dashboard (app.js)
  response_types: ["code"],
});

