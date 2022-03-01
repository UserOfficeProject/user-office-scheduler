## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:4200](http://localhost:4200) to view the GraphQL playground in the browser.

You will need to manually reload if you make edits.<br>

> **_NOTE:_** Scheduler is not meant to be used as standalone and it depends on [user-office-backend](https://github.com/UserOfficeProject/user-office-backend). So to be able to run everything locally you need to have `user-office-backend` running then start the `user-office-scheduler-backend` and finally run [user-office-gateway](https://github.com/UserOfficeProject/user-office-gateway) as well which connects them both and exposes endpoint [http://localhost:4100](http://localhost:4100) where you can query data from both services.

### `npm run build`

Compiles typescript to javascript for production to the `build` folder.<br>

Your app is ready to be deployed!

### `npm run lint`

Lints typescript code and log if there are any errors.<br>
`npm run lint:fix` should be used if you want to fix all autofixable errors and warnings.

### `npm run generate:local`

Need to have `user-office-backend` running to run this command successfully.<br>
It generates typescript `sdk.ts` file containing types from the `user-office-backend` that are shared and used in the `user-office-scheduler-backend` code.

## Contribution and release versioning

Please reffer to the [Contribution guide](CONTRIBUTING.md) to get information about contributing and versioning.

Happy coding! 👨‍💻
