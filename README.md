# testnest

1. Склонировать проект
2. Создать в корне проекта .env с переменными:

   POSTGRES_USER=  
   POSTGRES_PASSWORD=  
   POSTGRES_DB=  
   DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db: 5432/${POSTGRES_DB}?schema-public"  
   SECRET_KEY=  
   ROOT_ADMIN_EMAIL=  
   ROOT_ADMIN_PASSWORD=  

4. docker compose up -d --build
5. Тестировать с Postman:   
  POST /auth/login — Body {mail: string, pass: string} Вернет { access_token: access_token, refresh_token: refresh_token } или message error   
  POST /auth/logout — Body { reftoken: string } Вернет message  
  POST /auth/refresh — Body { reftoken: string } Вернет { access_token: access_token, refresh_token: refresh_token } или message error    

  !!!Дальше везде использовать Authorization: Bearer token
  
  GET /admins  
  POST /admins — Body { name: string, mail: string, password: string } Вернет { id: manager.id, name: manager.name, mail: manager.email, role: manager.role } или message error  
  PATCH /admins/:id/password — Body { id: number, password: string } Вернет message  
  DELETE /admins/:id — Body { id:number } Вернет message  

  GET /shops-owners —список владельцев.  
  GET /shops-owners/:id — Body {id: number} Вернет карточку владельца.  
  POST /shops-owners — Body { name:string, mail: string, phone: string, address: string } Вернет message  
  PATCH /shops-owners/:id — Body { id: number, field: string, value: any } Вернет message  
  DELETE /shops-owners/:id — Body { id: number } Вернет message.  

  GET /shops—списокмагазинов.  
  GET /shops/:id — { id: number } Вернет карточку магазина.  
  POST /shops— { credentials: string, address: string, login: string, password: string, ownerId: number } Вернет message  
  PATCH /shops/:id/credentials { id: number, login: string, password: string } Вернет message  

  GET /terminals —список терминалов.  
  GET /terminals/:id — { id: number } Вернет карточку терминала.  
  PATCH /terminals/:id/status — { id: number, status: boolean } Вернет карточку терминала  
  POST /terminals/alive — { id: number } Вернет карточку терминала  

  GET /requests —список заявок.  
  PATCH /requests/:id/approve — { id: number, mac: string, storeid: number } Вернет message  
  PATCH /requests/:id/reject — { id: number } Вернет message  
  POST /requests/:id/comment — { id: number, comment: string } Вернет message  

  PATCH /profile/password — { password: string } Вернет message  
