# django-angular-comment-section
This is an example/mock project to learn more about mainly angular but also some features of django. I am more interested in the backend and API's (so the backend-frontend connection) than UI/UX so I'll try to make the UI very minimal and simple but reactive so it won't feel like something I can do with plain html/css/js.

## Database Design
Only one table that has text, an image and a timestamp.

I'm going to avoid having any users because that'll complicate things too much for no reason and won't have an effect on angular.

## Frontend Design
TODO

## Backend Design
This is a simple app so there's almost no backend except for sorting the comments so we get the latest comments first.

## API's
I use django rest framework to automatically make all 4 crud api endpoints. I should enable pagination for viewing as well.
