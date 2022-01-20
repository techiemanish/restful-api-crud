@Author : https://github.com/techiemanish

This is RESTful API with CRUD operation:<br>

Techonology used: MonogoDB, Express.js, Node.js, AWS<br>
API Endpoint: /employees<br>

Project Live Link: https://replit.com/@techiemanish/restful-api-crud<br>

Application Source Code: https://github.com/techiemanish/restful-api-crud<br>

Docker image: https://hub.docker.com/r/techiemanish/restful-api-crud<br>
<b>Container Port: 3000</b>

<code>
<b>docker pull techiemanish/restful-api-crud</b><br></code>
<code>
<b>docker run -it -p 5000:3000 --name myapp techiemanish/restful-api-crud</b>
</code>
<br>

<b>Before sending any request to the api, first click on the above link and run the project on live envoirnment, then feel free to test this RESTful API.<b><hr>

1. For Get request to API: [Request type = GET]<br>
https://restful-api-crud.techiemanish.repl.co/employees<br>
OR<br>
To find the particular employee with id:<br>
https://restful-api-crud.techiemanish.repl.co/employees/id
<br>
2. For Post request to API: [Request type = POST]<br>
https://restful-api-crud.techiemanish.repl.co/employees<br>
<pre>{
    employee_id : "1100",
    employee_name : "Manish Tiwari",
    employee_salary : "750000",
    employee_age : "22"
}</pre>
OR<br>
Use the frontend and submit the Form<br>

3. For PUT request to API: [Request type = PUT]<br>
https://restful-api-crud.techiemanish.repl.co/employees/id<br>
Body for the request while sending the request: For example:<br>
<pre>{
    employee_id : "1100",
    employee_name : "Manish Tiwari",
    employee_salary : "750000",
    employee_age : "22"
}</pre>

4. For Delete request to API: [Request type = Delete]<br>
https://restful-api-crud.techiemanish.repl.co/employees/id<br>

