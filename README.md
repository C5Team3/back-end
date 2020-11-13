![musicAPP](https://repository-images.githubusercontent.com/303908641/bd058780-1c36-11eb-9623-1f64d214f5f5)
![status](https://img.shields.io/badge/STATUS-In%20Progress-yellow)

# Music APP BACKEND API! 

## Description

We know how important music tends to be in our lives, Rockker Music App, is a mobile frist platform, where you can listen to your favorite music, create playlists, group your favorite songs, search for your favorite artists and songs, among other features that you will be able to enjoy.


## Backend Scope
- **Login Basic Authentication with JWT**
- **Login Basic Authentication with JWT**
- **SignUp Email Active Account**
- **SignIn Email Recovery Password**
- **ApiKeyScopes for (PUBLIC) Users and (ADMIN) Users**
- **SignUp Basic**
- **SignUp with Other Providers [FACEBOOK]**
- **Tracks CRUD**
- **Albums CRUD**
- **Users Admin CRUD**
- **Artists CRUD**
- **Apikey CR Generator**
- **Integration Test with Mocha**
- **Swagger Docs for API Docs**


## Team - Rockker Music App
- **Fernando Cañas  /  Frontend**  - 
- **Alfredo   /  Frontend**  -
- **Mario Silva  /  Frontend**  -
- **Sergio Hortua  /  Frontend**  - 
- **Jose Meléndez  /  Data Science**  - 
- ** Michael Espinosa  /  Backend Dev**  - [@maes91](https://twitter.com/@maes91)
- ** Carlos Guzmán   /  Backend Dev**  - [@caalguzman](https://twitter.com/caalguzman)

## General Documentation
- [Notion Rcokker Music App](https://www.notion.so/Rokker-cc1801d5d871494caca6dc79bfe4594d/)

## Aplication Flow
- [See App Flow](https://coggle.it/diagram/X4mvMZbmeKXduDA1/t/music-app/5997a92adcffae328ac2019846cd2f7eee42adfba31c13fcb5fd2ab92668651d)
# Backend Architecture 
![Services](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/eacb7eac-4868-4744-aeee-13ec40b4c28e/Backend.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201101%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201101T185414Z&X-Amz-Expires=86400&X-Amz-Signature=588ab6b5bed6b970032aebc80df4972f2477175fea32a73afcd7b910b5a224f0&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Backend.png%22)

## Installing Backend

1. Download or clone the repository
2. install in your local machine
3. Config your .ENV File, use .ENV_EXAMPLE Example to Set Vars. You need a mongo db Instance, remote or local. 
4. Run First Setup for APP: This Script configure minimal Fixtures for App, all at the same time:
    - Seed Users: Create 50 Example Users + 1 Admin User. 
    - seed Spotify: Artists, Albums, Tracks: This Scripts, 
    - seedApiKeys: Create two Api Keys for SCOPES Control. [ADMIN] [PUBLIC]
    - 
5. Run App. 
```jsx
git clone
```
```jsx
npm install
```

## ▶️ Available Scripts

### Running Production Mode
```jsx
npm run start
```

### Running Setup App (seedUsers, seedSpotify, seedApiKeys)
```jsx
npm run setup
```

### Running Setup only seedUsers)
```jsx
npm run seedUsers
```

### Running Setup only seedApiKeys)
```jsx
npm run seedApiKeys
```
### Running Setup only seedSpotify)
```jsx
npm run seedSpotify
```

### Running App
```jsx
npm run start
```
### Running Dev Mode - Enabling Debug Module for Windows Systems
```jsx
npm run dev
```
### Running Dev Mode - Enabling Debug Module for Osx Systems
```jsx
npm run devOsx
```

### Testing Integration Layer With Mocha
```jsx
npm run test
```

## Technologies

### Backend
- Spotify API.
- Mongoose
- Helmet
- jws
- Express
- Mocha
- Mongodb
- Cache-control

## Backend End Points 
You can see Backend End Points [https://rokker-music-app-test.herokuapp.com/]().

## Insominia Json for Import and test API
-[Download Insomnia WorkSpace](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/005eae85-2b92-4e6e-a933-184c455395ef/Insomnia_2020-10-28.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201101%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201101T192020Z&X-Amz-Expires=86400&X-Amz-Signature=85eb0ad3fbe9181f30eb4ce1ca95de01668380974b578f91ea604a479be19b4a&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Insomnia_2020-10-28.json%22)


## Repositories

- [Backend Repository](https://github.com/C5Team3/back-end)
- [Frontend Repository](https://github.com/C5Team3/front-end)
- [DataSciense Repository](https://github.com/C5Team3/data-science)

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).