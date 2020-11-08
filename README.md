# Better JWT Auth
This respository is an example of how to implement JWT with node.js as a backend server with the use of a **access_token** and **refresh_token**

## Request flow
1. POST /login => **access_token** and **refresh_token** in cookie. Stores refresh in db
2. GET /private => returns content protected behind jwt
3. GET /private (after token expires) => returns 403
4. POST /refresh => generates a new **access_token**
5. POST /logout => removes **access_token** and **refresh_token** cookies and removes refresh token in db

