## Componentes SAPS
* Verifique de estar usando Ubuntu 16.04 ou 18.04
0. [Common](#〰-common)
1. [Catalog](#〰-catalog)
2. [Archiver](#〰-archiver)
3. [Dispatcher](#〰-dispatcher)
4. [Scheduler](#〰-scheduler)
5. [Dashboard](#〰-dashboard)
6. [Arrebol](#〰-arrebol)
    1. [Clean Option](#clean-option)
    2. [Container Option](#container-option)
7. [Worker (arrebol)](#arrebol)
8. Atachando volume ao nfs
9. Testes NOP


-------------------------------------------------------------------
## 〰 Common
* Esse repositório é necessário para:
    1. [Catalog](##catalog)
    2. [Archiver](##archiver)
    3. [Dispatcher](##dispatcher)
    4. [Scheduler](##scheduler)

### Instalação:
1. Instalar JDK, Maven, Git
    ```
    sudo apt-get update
    sudo apt-get -y install openjdk-8-jdk
    sudo apt-get -y install maven
    sudo apt-get -y install git
    ```
2. Clonar e  instalar dependencias
    ```
    git clone https://github.com/ufcg-lsd/saps-common ~/saps-common
    cd ~/saps-common
    sudo mvn install 
    ```

-------------------------------------------------------------------
## 〰 Catalog
### Variaveis a serem definidas:
* $catalog_user         (default = catalog_user)
* $catalog_passwd       (default = catalog_passwd)
* $catalog_db_name      (default = catalog_db_name)
* $installed_version

### Instalação:
1. Configurar o [saps-common](##common)
2. Clonar e instalar dependencias
    ```
    git clone https://github.com/ufcg-lsd/saps-catalog ~/saps-catalog
    cd ~/saps-catalog
    sudo mvn install 
    ```
3. Instalar o postgres
    ``` 
    sudo apt-get install -y postgresql
    ```
4. Configurar o Catalog
    ``` 
    sudo su postgres
    psql -c "CREATE USER $catalog_user WITH PASSWORD '$catalog_passwd';"
    psql -c "CREATE DATABASE $catalog_db_name OWNER $catalog_user;"
    psql -c "GRANT ALL PRIVILEGES ON DATABASE $catalog_db_name TO $catalog_user;"
    ```
5. Configurar PostgreSQL
    * Verifique a versão **<installed_version>** do postgres com o comando:
        ```
        ls /etc/postgresql 
        ```
    * Configure as permissões:
        ```
        sudo sed -i 's/peer/md5/g' /etc/postgresql/<installed_version>/main/pg_hba.conf

        sudo bash -c 'echo "host all all 0.0.0.0/0 md5" >> /etc/postgresql/<installed_version>/main/pg_hba.conf'

        sudo sed -i "$ a\listen_addresses = '*'" /etc/postgresql/<installed_version>/main/postgresql.conf

        sudo service postgresql restart
        ```
6. Teste o acesso de outra máquina para o Catalog
    ```
        psql -h $catalog_ip_address -p 5432 $catalog_db_name $catalog_user
    ```

-------------------------------------------------------------------
## 〰 Archiver
### Variaveis a serem definidas:
* $nfs_server_folder_path   (default= /nfs)

### Instalação:
1. Configurar o [saps-common](##common)
2. Instalar dependencias do [saps-catalog](##catalog)
    ```
    git clone https://github.com/ufcg-lsd/saps-catalog ~/saps-catalog
    cd ~/saps-catalog
    mvn install 
    rm -rf ~/saps-catalog
    ```
3. Configurar o [saps-archiver](##archiver)
    ```
    git clone https://github.com/ufcg-lsd/saps-archiver ~/saps-archiver
    cd ~/saps-archiver
    sudo mvn install 
    ```
4. Configurar servidor
* NFS (Opção 1)
    * Configurando
        ```
        sudo apt-get install -y nfs-kernel-server
        mkdir -p $nfs_server_folder_path
        echo "$nfs_server_folder_path *(rw,insecure,no_subtree_check,async,no_root_squash)" >> /etc/exports
        sudo service nfs-kernel-server enable
        sudo service nfs-kernel-server restart
        ```
    * Testando
        ```
        showmount -e localhost
        ```

* SWIFT (Opção 2)
    ```
    TODO
    ```

5. Instalando apache
    ```
    sudo apt-get install -y apache2

    sudo vim /etc/apache2/sites-available/default-ssl.conf
        DocumentRoot $nfs_server_folder_path

    sudo vim /etc/apache2/sites-available/000-default.conf
        DocumentRoot $nfs_server_folder_path
        +        Options +Indexes
        +        <Directory $nfs_server_folder_path>
        +                Options Indexes FollowSymLinks
        +                AllowOverride None
        +                Require all granted
        +        </Directory>
        a2enmod headers

    sudo vim /etc/apache2/apache2.conf
    <FilesMatch ".+\.(txt|TXT|nc|NC|tif|TIF|tiff|TIFF|csv|CSV|log|LOG|metadata)$">
            ForceType application/octet-stream
            Header set Content-Disposition attachment
    </FilesMatch>

    sudo service apache2 restart
    ```

### Configuração:
Configure o arquivo /config/archiver.conf de acordo com os outros componentes
* Exemplo (nfs): [archiver.conf](./confs/archiver/clean/archiver.conf) 

### Execução:
* Executando archiver
    ```
    bash bin/start-service.sh
    ```

* Parando archiver
    ```
    bash bin/stop-service.sh
    ```

------------------------------------------------------------------
## 〰 Dispatcher
### Instalação:
1. Configurar o [saps-common](##common)
2. Instalar dependencias do [saps-catalog](##catalog)
    ```
    git clone https://github.com/ufcg-lsd/saps-catalog ~/saps-catalog
    cd ~/saps-catalog
    mvn install 
    rm -rf ~/saps-catalog
    ```
3. Configurar o [saps-dispatcher](##dispatcher)
    ```
    git clone https://github.com/ufcg-lsd/saps-dispatcher ~/saps-dispatcher
    cd ~/saps-dispatcher
    sudo mvn install 
    ```
4. Instalar dependências do script python (get_wrs.py)
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
    bash bin/start-service.sh
    ```

* Parando dispatcher
    ```
    bash bin/stop-service.sh
    ```

-------------------------------------------------------------------
## 〰 Scheduler
### Instalação:
1. Configurar o [saps-common](##common)
2. Instalar dependencias do [saps-catalog](##catalog)
    ```
    git clone https://github.com/ufcg-lsd/saps-catalog ~/saps-catalog
    cd ~/saps-catalog
    mvn install 
    rm -rf ~/saps-catalog
    ```
3. Configurar o [saps-scheduler](##scheduler)
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
    bash bin/start-service.sh
    ```

* Parando scheduler
    ```
    bash bin/stop-service.sh
    ```

-------------------------------------------------------------------
## 〰 Dashboard
### Instalação:
1. Instalando curl e Node
    ```
    sudo apt-get update
    sudo apt-get install -y curl
    curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
2. Configurar o [saps-dashboard](##dashboard)
    ```
    git clone https://github.com/ufcg-lsd/saps-dashboard ~/saps-dashboard
    cd ~/saps-dashboard
    sudo npm install
    ```

### Configuração:
Configure os arquivos **/backend.config** e **/public/dashboardApp.js** de acordo com os outros componentes
* Exemplo: [backend.config](./confs/dashboard/clean/backend.config) 
* Exemplo: [dashboardApp.js](./confs/dashboard/clean/dashboardApp.js) 

### Execução:
* Executando dashboard
    ```
    bash bin/start-dashboard
    ```

* Parando dashboard
    ```
    bash bin/stop-dashboard
    ```

-------------------------------------------------------------------
## 〰 Arrebol 
### ***Clean Option***
### Variaveis a serem definidas:
* $arrebol_db_passwd    (default = @rrebol)
* $arrebol_db_name      (default = arrebol)

### Instalação:
1. Instalando JDK, Maven e Git
    ```
    sudo apt-get update
    sudo apt-get -y install openjdk-8-jdk
    sudo apt-get -y install maven
    sudo apt-get -y install git
    sudo apt-get install -y postgresql
    ```
2. Configurar o [arrebol](##arrebol)
    ```
    git clone -b develop-saps https://github.com/ufcg-lsd/arrebol ~/arrebol
    cd ~/arrebol
    sudo mvn install
    ```
4. Configurar o BD do arrebol
    ``` 
    sudo su postgres 
    psql -c "ALTER USER postgres PASSWORD '$arrebol_db_passwd';"
    psql -c "CREATE DATABASE $arrebol_db_name OWNER postgres;"
    ```


### Configuração:
Configure os arquivos **src/main/resources/application.properties** e **src/main/resources/arrebol.json** de acordo com os outros componentes
* Exemplo: [application.properties](./confs/arrebol/clean/application.properties) 
* Exemplo: [arrebol.json](./confs/arrebol/clean/arrebol.json) 

### Execução:
* Executando arrebol
    ```
    bash bin/start-service.sh
    ```

* Parando arrebol
    ```
    bash bin/stop-service.sh
    ```

### Checando
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
### Variaveis a serem definidas:
* $arrebol_db_passwd    (default = @rrebol)
* $arrebol_db_name      (default = arrebol)

### Instalação:
1. Configurar o [arrebol](##arrebol)
    ```
    git clone -b develop-saps https://github.com/ufcg-lsd/arrebol ~/arrebol
    cd ~/arrebol
    sudo mvn install
    ```
2. Instalar dependencias
    ```
    cd arrebol/deploy
    sudo bash setup.sh
    ```
4. Configurar o BD do arrebol
    ``` 
    sudo su postgres 
    psql -c "ALTER USER postgres PASSWORD '$arrebol_db_passwd';"
    psql -c "CREATE DATABASE $arrebol_db_name OWNER postgres;"
    ```


### Configuração:
Configure os arquivos da pasta **deploy/config/** de acordo com os outros componentes
* Exemplo: [postgres.env](./confs/arrebol/docker-image/postgres.env) 
* Exemplo: [pgadmin.env](./confs/arrebol/docker-image/pgadmin.env) 
* Exemplo: [application.properties](./confs/arrebol/docker-image/application.properties) 
* Exemplo: [arrebol.json](./confs/arrebol/docker-image/arrebol.json) 
* Exemplo: [init.sql](./confs/arrebol/docker-image/init.sql) 


### Execução:
* Executando arrebol
    ```
    sudo bash deploy-stack.sh
    ```

* Parando arrebol
    ```
    sudo docker stack rm lsd
    sudo docker volume rm lsd_postgresdata
    ```

### Checando
* Requisição
    ```
    curl http://127.0.0.1:8080/queues/default
    ```
* Resposta esperada
    ```
    {"id":"default","name":"Default Queue","waiting_jobs":0,"worker_pools":1,"pools_size":5}
    ```

-------------------------------------------------------------------
## 〰 Worker (Arrebol)
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
* Instale o ansible
    ```
    sudo apt update
    sudo apt install software-properties-common
    sudo apt-add-repository --yes --update ppa:ansible/ansible
    sudo apt install -y ansible
    ```

* Faça o deploy do worker
    ```
    sudo bash arrebol/worker/deploy/install.sh
    ```

### Checando
* Requisição
    ```
    curl http://127.0.0.1:8080/queues/default
    ```
* Resposta esperada
    ```
    {"id":"default","name":"Default Queue","waiting_jobs":0,"worker_pools":1,"pools_size":5}
    ```
