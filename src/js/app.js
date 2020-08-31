import "../scss/main.scss";
(function () {
  /**
   * Interception Observer
   */
  var observer = null;
  /**
   * Page Indicator
   */
  const loader = document.getElementById("loader");

  /**
   * Data
   */
  var data = [];

  /**
   * Current page
   */
  var page = 1;

  function processImageLoad(imgElement) {
    if (!!imgElement.getAttribute("data-big-image")) {
      const buffer = new Image();
      buffer.src = imgElement.getAttribute("data-big-image");
      buffer.onload = () => {
        imgElement.src = imgElement.getAttribute("data-big-image");
        imgElement.classList.add("ready");
      };
    } else {
      setTimeout(()=>{
        processImageLoad(imgElement);
      }, 4000);
    }
  }
  /**
   * Loads the big header image and starts the intersection observer
   */
  function lazyLoadHeader() {
    const myImgs = document.querySelectorAll(".load-image");
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          const target = entry.target;
          if (!target.classList.contains("ready")) {
            setTimeout(function () {
              processImageLoad(target);
            }, 1000);
          }
        }
      });
    });
    myImgs.forEach((image) => {
      observer.observe(image);
    });
  }

  /**
   * Initializes the gallery and retrieves the JSON data
   */
  function initLoad() {
    const endpoint =
      "https://pixabay.com/api/?key=18074595-9625ff4f1e3c857d32c960b8a&q=wild+animal&image_type=photo&per_page=50";
    const galleryContainer = document.querySelector(".gallery__container");
    var innerHtml = "";
    for (let i = 0; i < 10; i++) {
      innerHtml += `
        <div class="gallery__item-container">
          <img class="gallery__image gallery__image--non-loaded"
            src="https://cdn.pixabay.com/photo/2015/03/26/09/41/mountain-690104_150.jpg"
          />
        </div>
      `;
    }
    galleryContainer.innerHTML = innerHtml;
    // register observers
    const galleryImages = document.querySelectorAll(".gallery__image");
    galleryImages.forEach((image) => {
      // Add Bounds Observer for lazy loading
      observer.observe(image);
      // Add overlay listener
      image.addEventListener('click', (e) => {
        const overlay = document.querySelector('.image-overlay');
        e.target.classList.toggle('active');
        overlay.classList.toggle('active');
      })
    });

    // Add overlay events
    const overlay = document.querySelector('.image-overlay');
    overlay.addEventListener('click', ()=> {
      overlay.classList.toggle('active');
      const selectedImage = document.querySelector('.gallery__image.active');
      selectedImage.classList.toggle('active');
    })

    // perform the AJAX callback
    fetch(endpoint)
      .then(function (response) {
        // The API call was successful!
        return response.json();
      })
      .then(function (jsonData) {
        // This is the JSON from our response
        data = jsonData.hits;
        loadGallery(page);
        initPaginator();
      })
      .catch(function (err) {
        // There was an error
        console.warn("Something went wrong.", err);
      });
  }

  /**
   * Renders the data into the gallery
   * @param {*} hits
   * @param int page: the page to laod from the data.
   */
  function loadGallery(selectedPage) {
    const galleryImages = document.querySelectorAll(".gallery__image");
    // Get the current page items ten items
    for (var i = 0; i < 10; i++) {
      // Get the item relative to the page
      const item = data[(selectedPage - 1) * 10 + i];
      const previewUrl = item.previewURL;
      const longUrl = item.webformatURL;
      const imageElement = galleryImages[i];
      // Addimages
      imageElement.src = previewUrl;
      imageElement.setAttribute("data-big-image", longUrl);
      // Change preview filtering
      imageElement.classList.add("gallery__image--blur");
      imageElement.classList.remove("gallery__image--non-loaded");
      // stop loader
      loader.classList.remove("loading");
      // Remove ready flag
      imageElement.classList.remove("ready");
      // Resubscribe
      observer.unobserve(imageElement);
      observer.observe(imageElement);
    }
    page = selectedPage;
  }

  /**
   * Initializes pagination controllers
   */
  function initPaginator() {
    const links = document.querySelectorAll(".pagination__page-link");
    // Numeric links events
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetPage = parseInt(e.target.innerHTML);
        if (page !== targetPage) {
          loadGallery(targetPage);
        }
        paginatorInvariant();
      });
    });

    // Previous controller event
    const prevController = document.querySelector(".pagination__previous_link");
    prevController.addEventListener("click", (e) => {
      e.preventDefault();
      if (!e.target.classList.contains("disabled")) {
        loadGallery(page - 1);
        paginatorInvariant();
      }
    });
    // Next controller event
    const nextController = document.querySelector(".pagination__next_link");
    nextController.addEventListener("click", (e) => {
      e.preventDefault();
      if (!e.target.classList.contains("disabled")) {
        loadGallery(page + 1);
        paginatorInvariant();
      }
    });

    // Cancel mobile interaction
    const mobileIndicator = document.querySelector('.pagination__mobile-link"');
    mobileIndicator.addEventListener('click', (e) => {
      e.preventDefault();
    })
  }

  /**
   * Invariant verification to grant congruence
   */
  function paginatorInvariant() {
    const prevButton = document.querySelector(".pagination__previous_link");
    const nextButton = document.querySelector(".pagination__next_link");
    const mobileCounter = document.querySelector(".pagination__mobile-counter");

    // If page is zero
    if (page == 1) {
      prevButton.classList.add("disabled");
    } else if (page == 5) {
      nextButton.classList.add("disabled");
    } else {
      prevButton.classList.remove("disabled");
      nextButton.classList.remove("disabled");
    }
    mobileCounter.innerHTML = page;
    //Uncheck active page
    const selectedPage = document.querySelector(
      ".pagination__page-link.active"
    );
    if (!!selectedPage) {
      selectedPage.classList.remove("active");
    }
    // Activate current page
    const currentPageLink = document.querySelectorAll(".pagination__page-link")[
      page - 1
    ];
    currentPageLink.classList.add("active");
  }

  /**
   * Main initialization function
   */
  function init() {
    lazyLoadHeader();
    initLoad();
  }

  // Initialize the app
  init();
})();
