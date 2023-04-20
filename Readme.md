## Linkedin Authentication Challenge

When using Linkedin API for the first time in a production server, you may get Challenge Exceptions. 
That's because you never logged in with the given account in that server before. The only way to deal with this problem is logging in manually before calling API. However, in a non-UI and non-browsers environment, you'll need a script to do that.

you can make a UI over the top of this module. but its for server implementation only not for browser.

This is the node module of the python implementation of the following repo
so special thanks to <https://github.com/everping/Linkedin-Authentication-Challenge>

## python version
 [Check python version] (https://github.com/everping/Linkedin-Authentication-Challenge)



# Node version guidelines

## How to use this

Require the module
```JS
    const LinkedinAuthChallenge = require("../LinkedinAuthChallenge");
```
this make an instance

```JS
const liAuth = new LinkedinAuthChallenge();
```

Finally call it, email & passwords are variable which you need to pass 

```JS
    const res = await liAuth.doLogin(email, password);
```

Once *pin* received on email use this function to verify

```JS
    const res = await liAuth.verifyPin(pin);
```



#### Errors

Both the function returns the error object, in following format, when something bad happens

```
{ "status": "error", "message": "Please provide a valid username/password" }
```

1. "Unexpected error" at login, Either login credentials are wrong or everything is fine & your browser/computer is already registered in linkedin security.
2. "Please provide a valid username/password" Any of the Username or password field is empty or missing.
3. "Something bad happened" when there is some problem in communication.
4. "You forget to login!, please login first", when you call verify pin without performing dologin.

#### Success 
```
return { "status": "success", "message": "you are successfully registered!" }
```

1. "you are successfully registered!", when every thing goes as expected
2. "Please check email", when user logged in & a PIN message shotted.


## This package is not affiliated to linkedin in any manner, this package comes with no warranty