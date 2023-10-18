'use strict';

///////////////////////////////////////
// Modal window
/////Selectors
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const secttion1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//For each btn of modal, apply the function
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////Page navigation

///Smooth scrolling with event delegation
///Nav bar buttons

//1.Add event listener to common parent element
//2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);
  e.preventDefault(); //Preventing the href html jump
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); //Getting the href html id
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///Learn more button
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = secttion1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  // //Old school way of doing it
  // window.scrollTo({
  //   left: s1coords.left + window.pageYOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //Modern way of doing it
  secttion1.scrollIntoView({ behavior: 'smooth' });
});

//////////

/////Tabbed component

//bad practice, for each tab will be a copy, we need to use event delegation
//tabs.forEach(t => t.addEventListener('click', () => console.log('tab')));

//Using event delegation, attaching the addeventlistener to the individual element, instad all the the elements
//Because there are more than 1 elements in the tab, we need to a way to get the whole tab selected when we click on the area, and not individual elements like span
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  //Guard clause, ignore any clicks when there are clicks in the area and result is null
  if (!clicked) return; //if the click is inside the desidered target, continue

  //Activate tab slide up
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Activate content area
  //Removing the active content classses on all tabcontent
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Adding class active
  //Getting the tab number clicked and then apply to that tab de active class
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//Passing an "argument" into a handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////Sticky navigation

//Using intersection of server API for sticky navigation
const header = document.querySelector('.header');
//Calculating the heigh of the nav for the margin
const navHeight = nav.getBoundingClientRect().height;

//The callback function will get called every time the observed element is intersecting the root element at the threshold defined at the options
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  //Adding classes
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //entire viweport
  threshold: 0, //When 0% of the header is visible
  rootMargin: `-${navHeight}px`, //Margin for the header to appear before the section, so it doesnt cover up the section content
});
headerObserver.observe(header);

//Reveal sections

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  //Guard, if is not intersecting do not remove, because it will be removing too early
  if (!entry.isIntersecting) return;

  //Targetting the entry so only the current secction gets hidden removed
  entry.target.classList.remove('section--hidden');
  //Unobserve when finished the animation, so the event doesn't keep triggering, better performance
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

//Observe and Add hidden class to all sections
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///Lazy loading images

//Selecting all the images that have data-src
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', //Loading just before the showing
});
//Observe each img selected
imgTargets.forEach(img => imgObserver.observe(img));

/////Slider

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let curSlide = 0;
  const maxSlide = slides.length;

  const dotContainer = document.querySelector('.dots');

  ///Dots

  const createDots = function () {
    //For each of the slides create a dot
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    //Select all of the dots and deactivate active class
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    //Add active only to the desired slide
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //Putting all the slides side by side
  //setting a style for each of the slides
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  //Refactoring of go to slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  ///Next and Previous slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      //Return to the beginning when last slide is slide
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0); //So by default the first dot is active
    activateDot(curSlide);
  };

  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); //Same, using short circuiting
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(curSlide);
    }
  });
};

slider();
