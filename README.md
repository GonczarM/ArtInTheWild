#User Story

##MVP

User is first directed to home page<br/>
User can login or register<br/>
login page asks for users username and password<br/>
reegister page asks for username and password<br/>
once user is logged in or registered, user is redirected to the home page<br/>
user can then have the option to logout instead<br/>
the home page will have an index of all the murals<br/>
User can use the search bar to navigate through photos<br/>
The search bar can be used to search for specific key properties of mural:
Artist, Affiliation, zipcode<br/>
which will reduce the index of the murals by that property<br/>
each mural in index displays a titlle, address, and small image<br/>
each title is a link to that murals show page<br/>
specific mural information is displayed to the user:
Location, Artist, Title, Description, affiliation, year installed, and image(credit for user who posted image)<br/>
Links To specific index based artist, affiliation, and zipcode on each mural<br/>

user would have option to upload a photo to be displayed of mural<br/>

##Nice to Haves

a map with markers showing locations for each<br/>
User can create a new mural and uplaod assoicated properties for it<br/>
Murals are organized by city, expanding who can post a mural<br/>


##Stretch
user page to display contributions from that user<br/>
Organize locations by neighborhoods that can be searched<br/>
upvote pictures to be the main photo

##Models

###Mural<br/>
{
  street address,<br/>
  artist,<br/>
  artwork title,<br/>
  art description,<br/>
  affiliation,<br/>
  year installed,<br/>
  latitude,<br/>
  longitude,<br/>
  zip,<br/>
  location description,<br/>
  image<br/>
}

###User<br/>
{
  Username,<br/>
  Passwrod,<br/>
  Mural ref,<br/>
  mural image ref<br/>
}

##Routes

###User

<br/>
GET (/user/logout) -- logs user out, kills session<br/>
GET (/user/:id) -- show page for user displays murals a/o images uploaded by user<br/>
POST (/user/register) -- creates user, starts session<br/>
POST (/user/login) -- login user, start sesssion<br/>
DELETE (/user/:id) -- delete specific user and associated posts<br/>

###Mural

GET (/mural) -- list all the murals<br/>
GET (/mural/:id) -- show page for spacific mural<br/>
POST (/mural) -- Adds a mural to the list<br/>
PUT (/mural/:id) -- Update Mural you have created or info youve added to mural<br/>
DELETE (/mural/:id) -- Delete Mural you have created<br/>
