Prism API
===========================================================

### Install
Make sure you have Node {v.0.10.25} & NPM installed. 

	git clone `prism_api` repo
	cd prism_api
	npm install

### Run Tests
	
	make test

### Start Prism API Server

  make start

### Deploy process
via github hooks
-- adding local remote origin of prismDev & post-update hook shell script in /home/$USER/app.git/hooks/post-update. it will force stop all currently running `forever` processes & restart via deploy.

Authorization
==========================================================
The authorization endpoint will handle all requests for authorization codes

Authorization Code Request
----------------------------------------------------------
### GET /oauth2/auth ###

### Parameters ###
**response_type**       the value available value here is currenty "code"  
**client_id**           client identifier provided to the application accessor  
**redirect_uri**        uri to redirect the response to - must be the same URI that
                        the application accessor used during registration  

Token
===========================================================
The token request is responsable for issueing access tokens. Clients issued
credentials must be authenticated for all requests to the token endpoint. The
authorization request may be formed as the following:

    Authorization: Basic base_64([*client_id*]:[*client_secret*])
    example:
    Authorization: Basic dlkajf89dsfaijt3afdasiuf93fh4khr9q834fh=

Access Token Request
----------------------------------------------------------
### POST /oauth2/token ###

### Parameters ###
**grant_type**          valid values: *authorization_code*, *client_credentials*, and *refresh_token*  
**code**                `REQUIRED` if *authorization_code* grant_type  
**redirect_uri**        `REQUIRED` if *authorization_code* grant_type  
**refresh_token**       `REQUIRED` if *refresh_token* grant_type  

