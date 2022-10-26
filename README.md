# SAPS
* Verifique de estar usando Ubuntu 16.04 ou 18.04


# Componentes SAPS
1. [Common](#common)
1. [Catalog](#catalog)
1. [Archiver](#archiver)
1. [Dispatcher](#dispatcher)
1. [Scheduler](#scheduler)
1. [Dashboard](#dashboard)
1. [Arrebol](#arrebol)
    1. [Clean Option](#clean-option)
    1. [Container Option](#container-option)
1. [Workers](#workers)
1. [Atachando volume ao nfs](#atachando-volume)
1. [Testes NOP](#testes-nop)

-------------------------------------------------------------------
## [Common](https://github.com/ufcg-lsd/saps-common)
* Esse repositório é necessário para:
    1. [Catalog](#catalog)
    2. [Archiver](#archiver)
    3. [Dispatcher](#dispatcher)
    4. [Scheduler](#scheduler)

### Instalação:
1. Instale o JDK, Maven, Git
    ```
    sudo apt-get update
    sudo apt-get -y install openjdk-8-jdk
    sudo apt-get -y install maven
    sudo apt-get -y install git
    ```
2. Clone e instale as dependencias
    ```
    git clone https://github.com/ufcg-lsd/saps-common ~/saps-common
    cd ~/saps-common
    sudo mvn install 
    ```

-------------------------------------------------------------------
## [Catalog](https://github.com/ufcg-lsd/saps-catalog)
### Variaveis a serem definidas:
* $catalog_user=catalog_user
* $catalog_passwd=catalog_passwd
* $catalog_db_name=catalog_db_name
* $installed_version= Verifique a sua versão do PostgreSQL 

### Instalação:
1. Configure o [saps-common](#common)
2. Clone e instale as dependencias
    ```
    git clone https://github.com/ufcg-lsd/saps-catalog ~/saps-catalog
    cd ~/saps-catalog
    sudo mvn install 
    ```
3. Instale o postgres
    ``` 
    sudo apt-get install -y postgresql
    ```
4. Configure o Catalog
    ``` 
    sudo su postgres
    export catalog_user=catalog_user
    export catalog_passwd=catalog_passwd
    export catalog_db_name=catalog_db_name
    psql -c "CREATE USER $catalog_user WITH PASSWORD '$catalog_passwd';"
    psql -c "CREATE DATABASE $catalog_db_name OWNER $catalog_user;"
    psql -c "GRANT ALL PRIVILEGES ON DATABASE $catalog_db_name TO $catalog_user;"
    exit
    ```
5. Configure o PostgreSQL
    ```
    sudo su
    export installed_version=`ls /etc/postgresql`
    sed -i 's/peer/md5/g' /etc/postgresql/$installed_version/main/pg_hba.conf
    bash -c echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/$installed_version/main/pg_hba.conf
    sed -i "$ a\listen_addresses = '*'" /etc/postgresql/$installed_version/main/postgresql.conf
    service postgresql restart
    exit
    ```
6. Teste o acesso de outra máquina para o Catalog
    ```
    psql -h $catalog_ip_address -p 5432 $catalog_db_name $catalog_user
    ```

-------------------------------------------------------------------
## [Archiver](https://github.com/ufcg-lsd/saps-archiver)
### Variaveis a serem definidas:
* $nfs_server_folder_path=/nfs

### Instalação:
1. Configure o [saps-common](#common)
2. Instale as dependencias do [saps-catalog](#catalog)
    ```
    git clone https://github.com/ufcg-lsd/saps-catalog ~/temp/saps-catalog
    cd ~/temp/saps-catalog
    sudo mvn install 
    cd -
    sudo rm -rf ~/temp/saps-catalog
    sudo rm -d ~/temp/
    ```
3. Clone e instale as dependencias
    ```
    git clone https://github.com/ufcg-lsd/saps-archiver ~/saps-archiver
    cd ~/saps-archiver
    sudo mvn install 
    ```
4. Configure o servidor
* NFS (Opção 1)
    * Configurando
        ```
        sudo su
        apt-get install -y nfs-kernel-server
        export nfs_server_folder_path=/nfs
        mkdir -p $nfs_server_folder_path
        echo $nfs_server_folder_path '*(rw,insecure,no_subtree_check,async,no_root_squash)' >> /etc/exports 
        service nfs-kernel-server enable
        service nfs-kernel-server restart
        exit
        ```
    * Testando
        ```
        showmount -e localhost
        ```

* SWIFT (Opção 2)
    ```
    TODO
    ```

### Configuração:
Configure o arquivo /config/archiver.conf de acordo com os outros componentes
* Exemplo (nfs): [archiver.conf](./confs/archiver/clean/archiver.conf) 

### Execução:
* Executando archiver
    ```
    bash bin/start-service
    ```

* Parando archiver
    ```
    bash bin/stop-service
    ```

------------------------------------------------------------------
## [Dispatcher](https://github.com/ufcg-lsd/saps-dispatcher)
### Instalação:
1. Configure o [saps-common](#common)
2. Instale as dependencias do [saps-catalog](#catalog)
    ```
    git clone https://github.com/ufcg-lsd/saps-catalog ~/temp/saps-catalog
    cd ~/temp/saps-catalog
    sudo mvn install 
    cd -
    sudo rm -rf ~/temp/saps-catalog
    sudo rm -d ~/temp/
    ```
3. Clone e instale as dependencias
    ```
    git clone https://github.com/ufcg-lsd/saps-dispatcher ~/saps-dispatcher
    cd ~/saps-dispatcher
    sudo mvn install 
    ```
4. Instale as dependências do script python (get_wrs.py)
    ```
    sudo apt-get install -y python-gdal
    sudo apt-get install -y python-shapely
    sudo apt-get -y install curl jq sed
    ```

### Configuração:
Configure o arquivo **/config/dispatcher.conf** de acordo com os outros componentes
* Exemplo (nfs): [dispatcher.conf](./confs/dispatcher/clean/dispatcher.conf) 

### Execução:
* Executando dispatcher
    ```
    bash bin/start-service
    ```

* Parando dispatcher
    ```
    bash bin/stop-service
    ```

-------------------------------------------------------------------
## [Scheduler](https://github.com/ufcg-lsd/saps-scheduler)
### Instalação:
1. Configure o [saps-common](#common)
2. Instale as dependencias do [saps-catalog](#catalog)
    ```
    git clone https://github.com/ufcg-lsd/saps-catalog ~/temp/saps-catalog
    cd ~/temp/saps-catalog
    sudo mvn install 
    cd -
    sudo rm -rf ~/temp/saps-catalog
    sudo rm -d ~/temp/
    ```
3. Clone e instale as dependencias
    ```
    git clone https://github.com/ufcg-lsd/saps-scheduler ~/saps-scheduler
    cd ~/saps-scheduler
    sudo mvn install 
    ```
### Configuração:
Configure o arquivo **/config/scheduler.conf** de acordo com os outros componentes
* Exemplo (nfs): [scheduler.conf](./confs/scheduler/clean/scheduler.conf) 

### Execução:
* Executando scheduler
    ```
    bash bin/start-service
    ```

* Parando scheduler
    ```
    bash bin/stop-service
    ```

-------------------------------------------------------------------
## [Dashboard](https://github.com/ufcg-lsd/saps-dashboard)
### Instalação:
1. Instale o curl e o nodejs
    ```
    sudo apt-get update
    sudo apt-get install -y curl
    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo apt install -y npm
    ```
2. Clone e instale as dependencias
    ```
    git clone https://github.com/ufcg-lsd/saps-dashboard ~/saps-dashboard
    cd ~/saps-dashboard
    npm install
    ```

### Configuração:
Configure os arquivos **/backend.config** e **/public/dashboardApp.js** de acordo com os outros componentes
* Exemplo: [backend.config](./confs/dashboard/clean/backend.config) 
* Exemplo: [dashboardApp.js](./confs/dashboard/clean/dashboardApp.js) 

### Execução:
* Executando dashboard
    ```
    sudo bash bin/start-dashboard
    ```

* Parando dashboard
    ```
    sudo bash bin/stop-dashboard
    ```

-------------------------------------------------------------------
## [Arrebol](https://github.com/ufcg-lsd/arrebol) 
### ***Clean Option***
### Variaveis a serem definidas:
* $arrebol_db_passwd=@rrebol
* $arrebol_db_name=arrebol

### Instalação:
1. Instale o JDK, Maven e Git
    ```
    sudo apt-get update
    sudo apt-get -y install openjdk-8-jdk
    sudo apt-get -y install maven
    sudo apt-get -y install git
    sudo apt-get install -y postgresql
    ```
2. Instale o ansible 
    ```
    sudo apt update
    sudo apt install --y software-properties-common
    sudo apt-add-repository --yes --update ppa:ansible/ansible
    sudo apt install -y ansible
    ```
3. Clone e instale as dependencias
    ```
    git clone -b develop https://github.com/cilasmarques/arrebol ~/arrebol
    cd ~/arrebol
    sudo mvn install
    ```
4. Configure o BD do arrebol
    ``` 
    sudo su postgres
    export arrebol_db_passwd=@rrebol
    export arrebol_db_name=arrebol 
    psql -c "ALTER USER postgres PASSWORD '$arrebol_db_passwd';"
    psql -c "CREATE DATABASE $arrebol_db_name OWNER postgres;"
    exit
    ```

### Configuração:
Configure os arquivos **src/main/resources/application.properties** e **src/main/resources/arrebol.json** de acordo com os outros componentes
* Exemplo: [application.properties](./confs/arrebol/clean/application.properties) 
* Exemplo: [arrebol.json](./confs/arrebol/clean/arrebol.json) 

### Antes de executar, configure os workers do arrebol 
* Essa configuração deve ser feita na **mesma máquina que executará** o arrebol**.
* Para configurar o worker, siga esses [passos](#-workers)

### Execução:
* Executando arrebol
    ```
    sudo bash bin/start-service.sh
    ```

* Parando arrebol
    ```
    sudo bash bin/stop-service.sh
    ```

### Checagem
* Requisição
    ```
    curl http://127.0.0.1:8080/queues/default
    ```
* Resposta esperada
    ```
    {"id":"default","name":"Default Queue","waiting_jobs":0,"worker_pools":1,"pools_size":5}
    ```


-------------------------------------------------------------------
### ***Container Option***

### Instalação:
1. Clone o repositório
    ```
    git clone -b develop https://github.com/cilasmarques/arrebol ~/arrebol
    ```
2. Instale as dependencias do docker
    ```
    cd arrebol/deploy
    sudo bash setup.sh
    ```

### Configuração:
Configure os arquivos da pasta **deploy/config/** de acordo com os outros componentes
* Exemplo: [postgres.env](./confs/arrebol/container/postgres.env) 
* Exemplo: [pgadmin.env](./confs/arrebol/container/pgadmin.env) 
* Exemplo: [application.properties](./confs/arrebol/container/application.properties) 
* Exemplo: [arrebol.json](./confs/arrebol/container/arrebol.json) 
* Exemplo: [init.sql](./confs/arrebol/container/init.sql) 


### Antes de executar, configure os workers do arrebol 
* Essa configuração deve ser feita na **mesma máquina que executará** o arrebol**.
* Para configurar o worker, siga esses [passos](#-workers)

### Execução:
* Executando arrebol
    ```
    sudo bash deploy.sh start
    ```

* Parando arrebol
    ```
    sudo bash deploy.sh stop
    ```

### Checagem
* Requisição
    ```
    curl http://<arrebol_ip>:8080/queues/default
    ```
* Resposta esperada
    ```
    {"id":"default","name":"Default Queue","waiting_jobs":0,"worker_pools":1,"pools_size":5}
    ```

-------------------------------------------------------------------
## Workers
### Configuração:
Configure os arquivos da pasta **/worker/deploy/hosts.conf ** de acordo com os outros componentes
* Exemplo:
    ```
    # worker_ip[anything]
    worker_ip_1=10.11.19.104

    remote_user=ubuntu

    # The NFS Server Address
    nfs_server=10.11.19.80

    # The NFS Server directory to mount
    nfs_server_dir=/nfs

    # Required (if not specified, ansible will use the host ssh keys)
    ansible_ssh_private_key_file=/home/ubuntu/keys/saps22
    ```

### Instalação:
```
cd ~/arrebol/worker/deploy/
sudo bash install.sh
```

### Checagem
* Requisição
    ```
    curl http://<worker_ip>:5555/version
    ```
* Resposta esperada
    ```
    {"id":"default","name":"Default Queue","waiting_jobs":0,"worker_pools":1,"pools_size":5}
    ```

-------------------------------------------------------------------
## Atachando volume
1. Crie uma patição no volume
    * Comando: ```fdisk <volume>```
    * Exemplo: ```fdisk /dev/sdb```
1. Verifique se a partição foi feita
    * Comando: ```lsblk```
1. Defina um tipo de formatação para a partição
    * Comando: ```mkfs --type <formato> <particao>```
    * Exemplo: ``` mkfs --type ext4 /dev/sdb1```
1. Monte a partição em um diretorio: 
    * Comando: ```mount <particao> <diretorio>```
    * Exemplo: ```mount /dev/sdb1 /nfs```

-------------------------------------------------------------------
## Testes NOP
### Adicione as tags dos testes NOP nas configurações dos seguintes componentes
1. [Dashboard](#-dashboard)
    * Arquivo: [dashboardApp.js](https://github.com/ufcg-lsd/saps-dashboard/blob/develop/public/dashboardApp.js)
    * Exemplo: [dashboardApp.js](./confs/dashboard/clean/dashboardApp.js) 
1. [Dispatcher](#dispatcher)
    * Arquivo: [execution_script_tags.json](https://github.com/ufcg-lsd/saps-dispatcher/blob/develop/resources/execution_script_tags.json)
    * Exemplo: [dispatcher.conf](./confs/dispatcher/clean/dispatcher.conf)
1. [Scheduler](#scheduler)
    * Arquivo: [execution_script_tags.json](https://github.com/ufcg-lsd/saps-scheduler/blob/develop/resources/execution_script_tags.json)
    * Exemplo: [scheduler.conf](./confs/scheduler/clean/scheduler.conf)

### Clone o repositório saps-quality-assurance
```
git clone -b https://github.com/ufcg-lsd/saps-quality-assurance ~/saps-quality-assurance
cd ~/saps-quality-assurance
```

### Execute os testes
* Comando: ```sudo bash bin start-systemtest <admin_email> <admin_password> <dispatcher_ip_addrres> <submission_rest_server_port>```
* Exemplo: ```sudo bash bin start-systemtest dispatcher_admin_email dispatcher_admin_password 127.0.0.1 8091```

