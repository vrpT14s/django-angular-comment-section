# django-angular-comment-section
This is an example/mock project to learn more about mainly angular but also some features of django. I am more interested in the backend and API's (so the backend-frontend connection) than UI/UX so I'll try to make the UI very minimal and simple but reactive so it won't feel like something I can do with plain html/css/js.

# Demo (click to watch video)

![Demo](
[![Demo Video](./demo-image.jpg)](https://private-user-images.githubusercontent.com/142024691/449152465-94d30058-fd3b-43db-9803-8dc438bdf98d.mp4?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDg1OTI3MDcsIm5iZiI6MTc0ODU5MjQwNywicGF0aCI6Ii8xNDIwMjQ2OTEvNDQ5MTUyNDY1LTk0ZDMwMDU4LWZkM2ItNDNkYi05ODAzLThkYzQzOGJkZjk4ZC5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwNTMwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDUzMFQwODA2NDdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zZTViZDE4ZmI4YTAwMmU4Mzc1Nzk1NWU0YjJlZjMzZjc0MWJkMzAxZWQ1NGQ1MzNiZmI2ZTE2NGIzZjdiMDA2JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.wvEAnkzlFKw5520bVhjm-Cx4FzizlM1SodSN5waLh0U)

## Database Design
Only one table that has text, an image and a timestamp.

I'm going to avoid having any users because that'll complicate things too much for no reason and won't have an effect on angular.

## Frontend Design
There are 2 components other than the root app component: comment and comment-form. Comment-form is for new comments and comment is for the editable ones you see everywhere else. I used angular material, mat-cards specifically, for the UI elements.

After updating a comment to remove an image, there's a bit of lag where the previous image flashes. Not sure how to fix that. In general the timing was hard to get used to.

I know new angular recommends signals instead of @Input but I only found that out after I wrote everything with @Input.

## Backend Design
This is a simple app so there's almost no backend except for sorting the comments so we get the latest comments first.

## API's
I use django rest framework to automatically make all 4 crud api endpoints. I should enable pagination for viewing as well.
