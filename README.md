# Express authentication using EasyAuth Passport

1. Sign in to [easyauth.io](https://easyauth.io) and create a new 'Registered Client' with redirect URI set to `http://127.0.0.1:3000/auth/easyauth/callback`

2. Clone the example app from [https://github.com/easyauth-io/easyauth-passport-example](https://github.com/easyauth-io/easyauth-passport-example)

    `git clone https://github.com/easyauth-io/easyauth-passport-example`

3. Edit `.env` and set the parameters from your 'Registered Client' that you created in Step 1

5. Run `npm install` followed by `npm run start`

6. Visit [http://127.0.0.1:3000/auth/easyauth/login](http://127.0.0.1:3000/auth/easyauth/login)
