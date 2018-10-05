## Install Nginx

`sudo apt-get install nginx`

# Install python3

```
sudo apt-get update
sudo apt-get -y upgrade
```

## Intall pip3

```
sudo apt-get install -y python3-pip
sudo apt-get install python3.6-dev libmysqlclient-dev
```

## Install git

`sudo apt-get install git`

## Install docker
- Sau đó chạy lệnh sau để bật redis server
`docker run -p 6379:6379 -d redis:2.8`

## Clone repo and run requirements.txt file

```
git clone https://github.com/vuvandang1995/Smart-class.git
cd SmartClass
export LC_ALL="en_US.UTF-8"
export LC_CTYPE="en_US.UTF-8"
sudo pip3 install -r requirements.txt
```


*You need to VPN to Meditech network to use the system.*

## Tạo chứng chỉ ssl
- link: https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-16-04

## Tạo Gunicorn systemd Service File
`vim /etc/systemd/system/gunicorn.service`
- Điền nội dung bên dưới
```
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/home/SmartClass
ExecStart=/usr/local/bin/gunicorn -c gunicorn_conf.py --keyfile /etc/ssl/private/nginx-selfsigned.key --certfile /etc/ssl/certs/nginx-selfsigned.crt SmartClass.wsgi:application --reload

[Install]
WantedBy=multi-user.target
```
## Tao file Daphne
`vim /etc/systemd/system/daphne.service`
- Điền nội dung bên dưới:
```
[Unit]
Description=My Daphne Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/SmartClass
ExecStart=/usr/local/bin/daphne -e ssl:8443:privateKey=/etc/ssl/private/nginx-selfsigned.key:certKey=/etc/ssl/certs/nginx-selfsigned.crt SmartClass.asgi:application
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
## Chỉnh sửa file default cấu hình của nginx
`vim /etc/nginx/sites-available/default`
- Nội dung bên dưới:
```
server {
	# SSL configuration
	listen 443 ssl default_server;
	listen [::]:443 ssl default_server;
	ssl on;
	include snippets/self-signed.conf;
 	include snippets/ssl-params.conf;
    	location = /favicon.ico { access_log off; log_not_found off; }
    	location /static/ {
            root /home/SmartClass/teacher;
    	}
    	location /media/ {
            root /home/SmartClass;
   	 }


	location / {
                include proxy_params;
                proxy_pass https://0.0.0.0:8000;
        }
    	location /wss/ {
            proxy_pass https://0.0.0.0:8443;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
    	}
}

```
*Mỗi khi update code, cần restart lại 4 service: gunicorn, daphne, nginx, redis ()*
