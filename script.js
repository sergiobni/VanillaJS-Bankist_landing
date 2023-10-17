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

/////Events listeners

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

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

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
