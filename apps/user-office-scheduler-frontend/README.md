## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3100](http://localhost:3100) to view it in the browser.

> **_NOTE:_** Scheduler is not meant to be used as standalone. It depends on [user-office-backend](https://github.com/UserOfficeProject/user-office-backend) and [user-office-scheduler-backend](https://github.com/UserOfficeProject/user-office-scheduler-backend). So to be able to run everything locally you need to have `user-office-backend` running then start the `user-office-scheduler-backend` and finally run [user-office-gateway](https://github.com/UserOfficeProject/user-office-gateway) as well which connects them both and exposes endpoint [http://localhost:4100](http://localhost:4100) where you can query data from both services.

### `npm run lint`

Lints typescript code and log if there are any errors.<br>
`npm run lint:fix` should be used if you want to fix all auto-fixable errors and warnings.

### `npm run generate:local`

Need to have `user-office-backend`, `user-office-scheduler-backend` and `user-office-gateway` running to run this command successfully.<br>
It generates typescript `sdk.ts` file containing types from both `user-office-backend` and `user-office-scheduler-backend` that are shared and used in the `user-office-scheduler-frontend` code.

## Contribution and release versioning

Please refer to the [Contribution guide](CONTRIBUTING.md) to get information about contributing and versioning.
