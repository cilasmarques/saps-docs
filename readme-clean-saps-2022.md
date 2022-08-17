## Componentes para fazer deploy
* Verifique de estar usando Ubuntu 16.04 ou 18.04
0. [Common](##common)
1. [Catalog](##catalog)
2. [Archiver](##archiver)
3. [Dispatcher](##dispatcher)
4. [Scheduler](##scheduler)
5. [Dashboard](##dashboard)
6. [Arrebol (Workers)](##arrebol)
7. Atachando volume ao nfs
8. Testes NOP


-------------------------------------------------------------------
## 〰 Common
* Esse arquivo é necessário para 
    1. [Catalog](##catalog)
    2. [Archiver](##archiver)
    3. [Dispatcher](##dispatcher)
    4. [Scheduler](##scheduler)

### Passos:
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
#### Variaveis a serem definidas:
* $catalog_user         (default = catalog_user)
* $catalog_passwd       (default = catalog_passwd)
* $catalog_db_name      (default = catalog_db_name)
* $installed_version

#### Passos:
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
#### Variaveis a serem definidas:
* $nfs_server_folder_path   (default= /nfs)

#### Passos:
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

## TODO: adicionar um exemplo de arquivo de configuração

-------------------------------------------------------------------
## 〰 Dispatcher
#### Passos:
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

#### Configurar .config
#### Adiciona scripts

-------------------------------------------------------------------
## 〰 Scheduler
#### Passos
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
#### Configurar .config
#### Adiciona scripts


-------------------------------------------------------------------
## 〰 Dashboard
#### Passos
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
#### Configurar .config
#### Adiciona scripts


-------------------------------------------------------------------
## 〰 Arrebol
#### Variaveis a serem definidas:
* $arrebol_db_passwd    (default = @rrebol)
* $arrebol_db_name      (default = arrebol)

#### Passos
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
    git clone https://github.com/ufcg-lsd/arrebol ~/arrebol
    cd ~/arrebol
    sudo mvn install
    ```
4. Configurar o BD do arrebol
    ``` 
    sudo su postgres 
    psql -c "ALTER USER postgres PASSWORD '$arrebol_db_passwd';"
    psql -c "CREATE DATABASE $arrebol_db_name OWNER postgres;"
    ```
5. Execução
    * Executando arrebol
        ```
        bash bin/start-service.sh
        ```

    * Parando arrebol
        ```
        bash bin/stop-service.sh
        ```

#### Configurar .config

-------------------------------------------------------------------
## 〰 Worker (Arrebol)
1. Instalar ansible
    ```
    sudo apt update
    sudo apt install software-properties-common
    sudo apt-add-repository --yes --update ppa:ansible/ansible
    sudo apt install -y ansible
    ```
2. Configurar hosts.conf
*    TODO

3. Fazer deploy do worker
    ```
    sudo bash install.sh
    ```
