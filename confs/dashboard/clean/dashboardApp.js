//  IMPORTANTE: Considere um cenário onde cada componente esta rodando em uma máquina diferente.
//  Nesse caso, o arquivo de configuração deve ser editado para que cada componente aponte para o IP da máquina onde ele está rodando.
//  Exemplo:
//  archiver_ip = 10.11.19.80
//  arrebol_ip = 10.11.19.103
//  catalgo_ip = 10.11.19.41
//  dispatcher_ip = 10.11.19.49
//  scheduler_ip = 10.11.19.28
//  $catalog_db_name = catalog_db_name
//  $catalog_user =  catalog_user
//  $catalog_passwd = catalog_passwd

app.constant("appConfig", {
  "urlSapsService": "http://10.11.19.49:8091/",   //url e porta do saps-dipatcher
  "EGISecretKey": "<user_egi_secret_key>",        //a mesma senha definida em saps-dipatcher/config/dispatcher.conf
  "authPath": "users?auth",
  "authCreatePath": "users?register",
  "submissionPath": "processings",
  "regionDetailsPath": "regions/details",
  "imagesProcessedSearch": "regions/search",
  "emailPath": "email",
  "LOGIN_SUCCEED": "login.succeed",
  "LOGIN_FAILED": "login.failed",
  "LOGOUT_SUCCEED": "logout.succed",
  "DEFAULT_SB_VERSION": "version-001",
  "DEFAULT_SB_TAG": "tag-001",
  "SATELLITE_OPTS": [{
    "label": "Landsat 4",
    "value": "l4"
  }, {
    "label": "Landsat 5",
    "value": "l5"
  }, {
    "label": "Landsat 7",
    "value": "l7"
  }],
  "MODAL_OPENED": "modalOpened",
  "MODAL_CLOSED": "modalClosed",
  "scriptsTags": scriptsTags
});

