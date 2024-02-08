# Aqueduct Web Application

This repository contains the source code of Frontend for Aqueduct.

It's a better practice to open the project in the _Dev Container_.
This project is written in web technologies using [`React`](https://reactjs.org) library with [`TypeScript`](https://www.typescriptlang.org/).

> **Note**
> We're only using `yarn` as package/dependency manager, so please don't use npm directly.

</details>

## 🛠️ Available Scripts

In the project directory, you can run:

#### `yarn`

Installs all necessary packages.

#### `yarn start`

<details>
<summary>Runs the app in the development mode.</summary>
Open <a href="http://localhost:3000">http://localhost:3000</a> to view it in the browser.
<br>
The page will reload if you make edits.
<br>
You will also see any lint errors in the console.
<br>
<br>
</details>

#### `yarn test`

<details>
<summary>Launches the test runner in the interactive watch mode.</summary>
See the section about <a href="https://facebook.github.io/create-react-app/docs/running-tests">running tests</a> for more information.
</details>

#### `yarn build`

<details>
<summary>Builds the app for production to the <code>build</code> folder.</summary>
It correctly bundles React in production mode and optimizes the build for the best performance.
<br>
The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
<br>
See the section about <a href="https://facebook.github.io/create-react-app/docs/deployment">deployment</a> for more information.
</details>

#### `codegen`

<details>
<summary>Generates graphql types.</summary>
They will be replaced in this directory: <code>src/types/graphql/__GENERATED__</code>.
<br>
This command should be run every time graphql APIs are changed
</details>