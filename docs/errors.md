PS C:\Users\user\Desktop\solutionenergylimited> cd backend
PS C:\Users\user\Desktop\solutionenergylimited\backend> node server.js
info: Backend server listening on port 3000 {"service":"seesl-backend","timestamp":"2025-10-08 00:50:19"}
warn: CORS: Origin http://127.0.0.1:5500 not allowed. {"service":"seesl-backend","timestamp":"2025-10-08 00:52:35"}
Error: Not allowed by CORS
    at origin (C:\Users\user\Desktop\solutionenergylimited\backend\server.js:66:22)
    at C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\cors\lib\index.js:219:13
    at optionsCallback (C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\cors\lib\index.js:199:9)
    at corsMiddleware (C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\cors\lib\index.js:204:7)
    at Layer.handle [as handle_request] (C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\express\lib\router\layer.js:95:5)
    at trim_prefix (C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\express\lib\router\index.js:328:13)
    at C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\express\lib\router\index.js:286:9
    at Function.process_params (C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\express\lib\router\index.js:346:12) 
    at next (C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\express\lib\router\index.js:280:10)
    at urlencodedParser (C:\Users\user\Desktop\solutionenergylimited\backend\node_modules\body-parser\lib\types\urlencoded.js:94:7)  
