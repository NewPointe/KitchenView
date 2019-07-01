<div align="center">

Kitchen View 2.0
==========

**A simple kitchen display system for Square.**

[![Website][website-badge]][website-link]
[![Version][version-badge]][version-link]
[![License][license-badge]][license-link]

[![Dependencies][dependencies-badge]][dependencies-link]
[![Dev Dependencies][dev-dependencies-badge]][dev-dependencies-link]
[![Vulnerabilities][vulnerabilities-badge]][vulnerabilities-link]
[![Build][build-badge]][build-link]
[![Tests][tests-badge]][tests-link]

----------

</div>

## About

KitchenView is the kitchen display system we use in our cafes. We decided to write our own application for this since alternate solutions like Fresh KDS were either broken, unsupported, expensive, or would require purchasing new equipment. Kitchen View 2.0 is the newest version of this system, completely rewritten for the modern web.

Notable Improvements in v2:
- Uses Square's Oauth APIs to enable anyone to sign up and use it.
- Has an advanced filter editor to make it easy to decide what items to show on which screen.
- Uses modern technologies to ensure screens always stay up to date.

Pros:
- Anything with a modern web browser can be used as a display.
- 100% Free
- Unlimited Accounts/Locations/Screens
- Open Source, so anyone can contribute or run it on their own server.

Cons:
- Currently a work-in-progress, so not a lot of extra features are available.
- Both your Square device and the display device need a reliable internet connection
- Some orders can take up to a minute to show up - This is a limitation of Square's webhook API and there's nothing I can do about it.


## Square Permissions

In order to work, this app needs the following permissons from your Square account:
 - `MERCHANT_PROFILE_READ` - Allows the app to read basic profile information such as the name of your business, it's location, and your contact email.
 - `PAYMENTS_READ` - Allows the app to read payment information. This is needed so we can get notifications for new orders and look up what items were purchased. Note: we only store the extracted item information - payment details are not saved.
 - `ITEMS_READ` - Allows the app to look up the details for individual items.


## Development/Deployment

### Square Setup

1. Create a new app at https://connect.squareup.com/apps
2. Add a webhook for https://yourdomain.example.com/webhook

### App Setup

1. Clone the repo locally.
2. Install dependancies: `npm i --no-optional`
3. Choose and install a database provider:
   - MySQL: `npm i mysql2`
   - SQLite: `npm i sqlite3`
   - MariaDB: `npm i mariadb`
   - PostgreSQL: `npm i pg pg-hstore`
   - MSSQL: `npm i tedious`
4. Copy `config.template.json` to `config.json` and fill it out.
5. Start the app: `npm start`

For a production environment you'll want a proxy like NGINX in front of the app so you can set up SSL, which is required for square webhooks. I also recommend using a deamon/management solution like [PM2](http://pm2.keymetrics.io/).

## License

This project is licensed under MPL v2 - see the [LICENSE.md](LICENSE.md) file for details


<!-- Link References -->

[website-badge]: https://img.shields.io/website-up-down-green-red/https/kitchenview2.newpointe.org.svg
[website-link]: https://kitchenview2.newpointe.org

[version-badge]: https://img.shields.io/github/package-json/v/NewPointe/KitchenView.svg?label=version
[version-link]: https://github.com/Tschrock/PonyGames

[license-badge]: https://img.shields.io/badge/license-MPL--2.0-blue.svg
[license-link]: https://github.com/NewPointe/KitchenView/blob/master/LICENSE.md

[dependencies-badge]: https://david-dm.org/NewPointe/KitchenView/status.svg
[dependencies-link]: https://david-dm.org/NewPointe/KitchenView

[dev-dependencies-badge]: https://david-dm.org/NewPointe/KitchenView/dev-status.svg
[dev-dependencies-link]: https://david-dm.org/NewPointe/KitchenView?type=dev

[vulnerabilities-badge]: https://snyk.io/test/github/NewPointe/KitchenView/badge.svg
[vulnerabilities-link]: https://snyk.io/test/github/NewPointe/KitchenView

[build-badge]: https://img.shields.io/appveyor/ci/NewPointe/KitchenView.svg
[build-link]: https://ci.appveyor.com/project/NewPointe/KitchenView

[tests-badge]: https://img.shields.io/appveyor/tests/NewPointe/KitchenView.svg
[tests-link]: https://ci.appveyor.com/project/NewPointe/KitchenView

