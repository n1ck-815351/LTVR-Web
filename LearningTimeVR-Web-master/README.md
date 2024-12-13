# LearningTimeVR

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Tagging a release

When you get to a point where you want to deploy, you should tag a version on master. Eventually, we will want a new tag each time we merge into master, but this is the simple version of managing versions. We will use normal semver of Major, Minor and Patch versions. During alpha, we should stay at 0.0, and only iterate on patch. When we hit a release, we may want to iterate Minor. When we hit a full API change, we will want to iterate Major. For now, probably only patch:
1. `npm version patch`: This will return a new tag for the current repo state, something like `v0.0.1`.
2. `git push origin v0.0.1`: This pushes the tag to the repo. You may also need to `git push`, because you probably have an additional commit to package.json holding that change. In the future, we don't do this step like cavepeople, we'll automate it.

Now, you can refer to the Version as the short name for the release, and we can easily back up to a different point.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
