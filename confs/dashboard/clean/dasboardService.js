authService.startEGICheckInSessionLogin = function () {
  window.location.href = 'https://saps-test.lsd.ufcg.edu.br/auth-egi' //endpoind do saps-dashboard (app.js)
}

// ou

authService.startEGICheckInSessionLogin = function () {
  window.location.href = 'http://10.11.19.41:8081/auth-egi'           //endpoind do saps-dashboard (app.js)
}
