# Forbes Senior Developer Code Challenge
---
## 1. The Exercise

### Description
Using any image API of your choice, or API that returns content with images:
* Retrieve a list of at least 50 images and display them as thumbnails on a page
* Paginate thumbnails by 10 thumbnails per page
* When clicking on an image it should display in a modal.
* All images should be about a specific theme or based on a specific word

### Technical Constraints
* The Application should be built with html/js/css
* You may use pre-processors for css (but no frameworks, such as bootstrap)
* You may use whatever build tools you want
* The application should work and run when executing
* `npm i && npm start` from its root directory
* Please code in vanilla JS (no frameworks, or libraries)
* Take responsive design into consideration
* Your application only needs to work in Chrome
* If applicable: Include instructions for running your unit tests


## 2. Executing the project
For running the project in a development preview server execute.
```
npm i && npm start
```

> The project can be built statically using `npm run build` which produces smaller assets given the Webpack optimizations for Production environments.

## 3. Additional Comments
I'm using a technique for images lazy loading that uses an observer and to see if the image is in the current viewport. It provides  a lower res image initially to improve Start Render Time (that's why images are blurry at the beggining and they lazy loaded when they appear within the viewport).

Please contact me if you have any questions.

Sebastian Contreras js.contreras@outlook.com
