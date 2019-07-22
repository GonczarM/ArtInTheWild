# Art in the wild

https://wild-art-react.herokuapp.com/

Art in the Wild is a website that helps people in the Chicago Area and beyond connect with art. This app pulls data from the Chicago Data Portal API and logs the location of murals around the city. Users can read about and find murals around the city as well as document ones they find. Users can also take pictures of murals and upload them to the site.

## Technology and Installation

This is a MERN stack application so with the proper apps and NPM you should have no problem getting it to run

### Installing

Fork this side as well as the backend so both sides can make calls ato each other. Here is a link https://github.com/gumballg/ArtInTheWild-BackEnd . Once you have both repos up just connect them using MongoDB, Nodemon, and React

### Dependencies

```
react, 
react router,
bcrypt,
express,
superagent
```

## User Story

### MVP - API Chicago Data Portal Mural Registry

User is first directed to home page
User can login or register
login page asks for users username and password
reegister page asks for username and password
once user is logged in or registered, user is redirected to the home page
user can then have the option to logout instead
the home page will have an index of all the murals
User can use the search bar to navigate through photos
The search bar can be used to search for specific key properties of mural:
Artist, Affiliation, zipcode
which will reduce the index of the murals by that property
each mural in index displays a titlle, address, and small image
each title is a link to that murals show page
specific mural information is displayed to the user:
Location, Artist, Title, Description, affiliation, year installed, and image(credit for user who posted image)
Links To specific index based artist, affiliation, and zipcode on each mural
User would have option to upload a photo to be displayed of mural

### Nice to Haves

a map with markers showing locations for each<br/>
User can create a new mural and uplaod assoicated properties for it<br/>
Murals are organized by city, expanding who can post a mural<br/>


### Stretch
user page to display contributions from that user<br/>
Organize locations by neighborhoods that can be searched<br/>
upvote pictures to be the main photo

## Models

### Mural

  street address,
  artist,
  artwork title,
  art description,
  affiliation,
  year installed,
  latitude,
  longitude,
  zip,
  location description,
  image

### User

  Username,
  Passwrod,
  Mural(ref),
  muralImg(ref)
