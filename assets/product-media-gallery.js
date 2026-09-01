if (!window.isQuickAddModal) {

  function pauseGalleryMedia() {
    var mediaElements = document.querySelectorAll('.product-video-not-autoplay video');
      mediaElements.forEach(function(media) {
        media.pause();
    });
    document.querySelectorAll('.product-media-external-media').forEach((videoContainer) => {
      const iframe = videoContainer.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        const message = JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: ""
        });
        iframe.contentWindow.postMessage(message, '*');
      }
    });
    document.querySelectorAll('.external-media-iframe-container').forEach((videoContainer) => {
      const iframe = videoContainer.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        const message = JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: ""
        });
        iframe.contentWindow.postMessage(message, '*');
      }
    });
    document.querySelectorAll('.external-media-vimeo-iframe-container').forEach((videoContainer) => {
      const iframe = videoContainer.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"method":"pause"}', '*');
      }
    });
  }
  
  function changeSlide(thumbnail, index) {
    const thumbnails = document.querySelectorAll('.gallery-slider--thumbnail');
    const slidesContainer = document.getElementById('SlidesCon');
    const slides = document.getElementsByClassName('product-media-image');
    
    if (slidesContainer) {
      // Adjusting the index to handle slide boundaries
      if (index > slides.length) {
        index = 1;
      }
      if (index < 1) {
        index = slides.length;
      }
    
      thumbnails.forEach(item => {
        item.classList.remove('active');
      });
      
      thumbnail.classList.add('active');
      pauseGalleryMedia();
      
      const slideWidth = slidesContainer.offsetWidth;
      slidesContainer.scrollLeft = (index - 1) * slideWidth;
      //slidesContainer.scrollTo({
      //  left:  (index - 1) * slideWidth,
      //  behavior: 'smooth'
      //});    
    }
  }
  
  function handleScroll() {
    const slidesContainer = document.getElementById('SlidesCon');
    const slideWidth = slidesContainer.offsetWidth;
    const scrollPosition = slidesContainer.scrollLeft;
    const thumbnails = document.getElementsByClassName("gallery-slider--thumbnail");
  
    if (slidesContainer) {
      // Calculate the index based on the scroll position
      const index = Math.floor(scrollPosition / slideWidth) + 1;
  
      pauseGalleryMedia();
    
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].classList.remove("active");
    
        // Check if the thumbnail's data-slide-index matches the provided slideIndex
        if (thumbnails[i].getAttribute('data-slide-index') == index) {
            thumbnails[i].classList.add("active");
        }
      }    
    }  
  }
  
  // Add scroll event listener to slidesContainer
  const slidesContainer = document.getElementById('SlidesCon');
  if (slidesContainer) {
    slidesContainer.addEventListener('scroll', function() {
      handleScroll(); // Call handleScroll function
    });
  }
  
  // Initially trigger handleScroll to set the active state based on the initial scroll position
  handleScroll();
  
  
  // Slider Arrows
  function sliderArrows() {
    const leftArrow = document.querySelector('.gallery-slider-arrows .slider-arrow-left');
    const rightArrow = document.querySelector('.gallery-slider-arrows .slider-arrow-right');
    
    if (leftArrow) {
    leftArrow.addEventListener('click', () => {
      slidesContainer.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
      pauseGalleryMedia();
    });
    }
    if (rightArrow) {
    rightArrow.addEventListener('click', () => {
      slidesContainer.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
      pauseGalleryMedia();
    });
    }
  }
  
  document.addEventListener('DOMContentLoaded', sliderArrows);
  
  
  // Modal Opening and Closing
  function openModal() {
    document.getElementById("galModal").classList.add("open");
    document.body.classList.add('body-lock-scroll');
  }
  
  function closeModal() {
    document.getElementById("galModal").classList.remove("open");
    document.body.classList.remove('body-lock-scroll');
  }
  
  function currentSlide(n) {
      showSlides(slideIndex = n);
      setActiveThumbnail(n);
  }
  
  function showSlides(n) {
      var i;
      var slides = document.getElementsByClassName("galSlides");
  
      if (n > slides.length) {
          slideIndex = 1;
      }
      if (n < 1) {
          slideIndex = slides.length;
      }
  
      for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
      }
  
      slides[slideIndex - 1].style.display = "block";
  }
  
  
  function setActiveThumbnail(slideIndex) {
      var thumbnails = document.getElementsByClassName("lightbox-thumbnail");
  
      for (var i = 0; i < thumbnails.length; i++) {
          thumbnails[i].classList.remove("lightbox-thumbnail-active");
  
          // Check if the thumbnail's data-slide-index matches the provided slideIndex
          if (thumbnails[i].getAttribute('data-slide-index') == slideIndex) {
              thumbnails[i].classList.add("lightbox-thumbnail-active");
          }
      }
  }
  
  function changeModalSlide(thumb, index) {
      const thumbs = document.querySelectorAll('.lightbox-thumbnail');
      const slidesContainer = document.getElementById('modalSlidesContainer');
      const slides = document.getElementsByClassName('galSlides');
  
      // Adjusting the index to handle slide boundaries
      if (index > slides.length) {
          index = 1;
      }
      if (index < 1) {
          index = slides.length;
      }
  
      thumbs.forEach(item => {
          item.classList.remove('lightbox-thumbnail-active');
      });
  
      thumb.classList.add('lightbox-thumbnail-active');
      
      pauseGalleryMedia();
  
      // Set all slides to display: none
      for (let i = 0; i < slides.length; i++) {
          slides[i].style.display = 'none';
      }
  
      // Set the current slide to display: block
      slides[index - 1].style.display = 'block';
  }
  
}