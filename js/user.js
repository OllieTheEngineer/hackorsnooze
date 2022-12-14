"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

async function submitFavorite(evt) {

  const storyId = evt.target.id;

  let methodType = ""

  const found = currentUser.favorites.find(favorite => favorite.storyId === storyId);

  if(found) {
    methodType = "delete"
  } else {
    methodType = "post"
  }

  /*

    if storyId doesn't exist in favorites array then we are trying to add it to favorites
      - We should do a POST
    else
    if storyId exist in favorites array then we are trying to delete it from favorites
      - We should do a DELETE

  */
  const favoriteResponse = await User.favoriteStory(currentUser, storyId, methodType);
  console.log(favoriteResponse);

  if(favoriteResponse.message === "Favorite Removed!") {
    // Update currentUser.favorites
    currentUser.favorites = currentUser.favorites.filter(favoriteStory => favoriteStory.storyId !== storyId);
    // Update DOM
    evt.target.src = unFavoriteStar;
  } else if(favoriteResponse.message === "Favorite Added!") {
    // Update currentUser.favorites
    currentUser.favorites = favoriteResponse.user.favorites.map(story => new Story(story));

    // Update DOM
    evt.target.src = favoriteStar;
  }

}

async function deleteStory(event) {

  const storyId = event.target.id;

  const found = currentUser.ownStories.find(story => story.storyId === storyId);

  if(found) {
    const storyResponse = await User.deleteUserStory(currentUser, storyId);
    const storyIdFromAPI = storyResponse.story.storyId;

    // Remove from current user
    currentUser.ownStories = currentUser.ownStories.filter(story => story.storyId !== storyIdFromAPI);
    currentUser.favorites = currentUser.favorites.filter(story => story.storyId !== storyIdFromAPI);

    // Story list which is all the stories we see in the dom
    storyList.stories = storyList.stories.filter(story => story.storyId !== storyIdFromAPI);
  }

  navMyStoriesClick();
}

$allStoriesList.on("click", ".fav-story", submitFavorite);

// We make own story link unique as user click on my-story class from DOM
$allStoriesList.on("click", ".my-story", deleteStory);