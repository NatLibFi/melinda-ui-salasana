# Melinda UI application: Salasana

| Branch | Workflow status                                                                                                                                          |
|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| main   | ![Workflow status badge for branch main](https://github.com/NatLibFi/melinda-ui-salasana/actions/workflows/melinda-node-tests.yml/badge.svg?branch=main) |
| test   | ![Workflow status badge for branch test](https://github.com/NatLibFi/melinda-ui-salasana/actions/workflows/melinda-node-tests.yml/badge.svg?branch=test) |
| dev    | ![Workflow status badge for branch dev](https://github.com/NatLibFi/melinda-ui-salasana/actions/workflows/melinda-node-tests.yml/badge.svg?branch=dev)   |

Ui for aleph password changing

## Start the application in production
* Set envs
* Run `npm install --prod` to install dependencies
* Run `node dist/index.js` to start application

## Start the application in development
* Set envs
* Run `npm install` to install dependencies
* Run `npm run dev` to start application

## Troubleshoot
In local dev VPN must be on or login does not work `HTTP GET /rest/auth/login - 401`

## License and copyright

Copyright (C) 2024 University Of Helsinki (The National Library Of Finland)

This project's source code is licensed under the terms of **MIT** or any later version.
