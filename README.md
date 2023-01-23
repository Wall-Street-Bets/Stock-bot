<!-- Improved compatibility of back to top link: See: ttps://github.com/Wall-Street-Bets/discord-bot.git/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url] -->



<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">The Wall Street Bets Discord bot</h3>

  <p align="center">
    An awesome investing simulator that tracks real market data!
    <br />
    <a href="https://discord.com/api/oauth2/authorize?client_id=1029048069066600521&permissions=8&scope=bot"><strong>Invite the bot to get started »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Wall-Street-Bets/Stock-bot.git/issues">Report Bug</a>
    ·
    <a href="https://github.com/Wall-Street-Bets/Stock-bot.git/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

There are many amazing discord bots out there that everyone loves - Dank memer, Mee6, CarlBot etc. I wanted to make a bot that is fun for everyone, so I decided that making a financial stock game bot will be the best one -- maybe the last stock bot you will need on discord.

More features will be added in the feature, you may also suggest changes by forking this repo and creating a pull request or opening an issue. Thanks to everyone who contributed to this bot!

Use the `README.md` to get started.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* Discord.js
* Node.js
* Prisma

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [https://polygon.io](https://polygon.io)
2. Clone the repo
  ```sh
  git clone https://github.com/Wall-Street-Bets/Stock-bot.git
  ```
3. Install NPM packages and prisma
  ```sh
  npm install
  npx prisma generate
  ```
4. Enter your Bot Key and API Key in `.env`
  ```env
  TOKEN="ENTER YOUR TOKEN KEY"
  API_KEY="ENTER YOUR API KEY"
  DATABASE_URL="ENTER YOUR MONGODB URL"
  CLIENT_ID="ENTER THE ID OF THE BOT"
  # GUILD_ID="ENTER THE GUILD ID OF THE BOT IF YOU ONLY NEED IT TO RUN IN ONE GUILD"
  ```
5. Push to the DB!
  ```sh
  npx prisma db push
  ```
6. Run the bot!
  ```sh
  npm run start
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>




## Roadmap

- [ ] Add Changelog
- [x] Add back to top links
- [ ] Add a crypto feature as well
- [ ] Add Additional Templates w/ Examples
- [ ] Add "components" document to easily copy & paste sections of the readme
- [ ] Multi-language Support
    - [ ] Chinese
    - [ ] Spanish

See the [open issues](https://github.com/Wall-Street-Bets/Stock-bot.git/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Elbert_Ainstein - [@ainstein_elbert](https://twitter.com/ainstein_elbert) - elbert4instein@gmail.com

pennacap        - [@PennaCap](https://twitter.com/PennaCap)

Project Link: [https://github.com/Wall-Street-Bets/Stock-bot.git](https://github.com/Wall-Street-Bets/Stock-bot.git)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Discord.js](https://discord.js.org)
* [Node.js](https://nodejs.org)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
<!--[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/Wall-Street-Bets/discord-bot.git/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/Wall-Street-Bets/discord-bot.git/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/Wall-Street-Bets/discord-bot.git/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/Wall-Street-Bets/discord-bot.git/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/Wall-Street-Bets/discord-bot.git/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/Discord.js-0769AD&style=for-the-badge
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com -->
