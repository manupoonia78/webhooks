# Webhooks

Requirements 
1. mongodb
2. nodejs
3. npm


Dependencies : "dotenv": "^10.0.0",
               "express": "^4.17.1",
               "moleculer": "^0.14.15",
               "mongo": "^0.1.0",
              "mongodb": "^4.0.0",
              "request": "^2.88.2"

Create a database named webhooks

Step 1:  Run the mongodb server , using 
```
$ mongod
```

Step 2: Install node dependencies
```
$ npm install
```
  
Step 3: Run the app.js
```
$ npm start
```



## To register a Webhook 

Make a POST Request to the localhost:3000/register route
with json body
e.g - { "taregtURL": "https://google.com" }

## To Update a targetURL

Make a  PUT Request to the localhost:3000/update route
with json body
e.g - { "id": "60f2c2ec4c248f0849f0d017",
          "newTargetUrl" : "https://facebook.com"}
          
          
 ## To List all the Registered Webhooks
 
 Make a GET Request to the localhost:3000/list route
 
 
 ## To Delete a Registered Webhook
 Make a DELETE Request to the localhost:3000/delete route 
 with the body containing id of the webhook you want to delete
 
 e.g - { "id" : "60f2c2ec4c248f0849f0d017" } 
 
 
 ## To Trigger all the Registered Webhooks
 Make a GET Request to the localhost:3000/ip route 
 with the header containing the ip address
 
 e.g - Key: x-forwarded-for
       Value: 192.168.20.10
       
       
   Bonus Completed:
   If a request to any target URL fails in the “webhooks.trigger” action (i.e. the response has a non 200 status code), 
   the microservice will keep retrying the request until it succeeds (maximum of 5 retries).
        
