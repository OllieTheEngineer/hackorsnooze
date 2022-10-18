"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const favoriteStar = "https://toppng.com/uploads/preview/free-png-grey-star-png-images-transparent-grey-star-icon-11562980999ctbeqsdgmf.png";

const unFavoriteStar = "https://as2.ftcdn.net/v2/jpg/02/19/11/75/1000_F_219117505_BapGXXD1yqEnfTQz9mhoi4TEohZrijej.jpg";

const deleteBtn = "https://cdn2.vectorstock.com/i/1000x1000/01/71/trash-can-icon-vector-13490171.jpg";

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login");
const $navFavorites = $("#nav-favorites");
const $navStories = $("#nav-stories");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
