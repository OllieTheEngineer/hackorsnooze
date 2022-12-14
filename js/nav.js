"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick");

  $allStoriesList.empty();

  // loop through all of our favorite stories and generate HTML for them
   for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick");

  $allStoriesList.empty();

  // loop through all of our favorite stories and generate HTML for them
   for (let story of currentUser.ownStories) {
    const $story = generateOwnStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$navFavorites.on("click", navFavoritesClick);
$navStories.on("click", navMyStoriesClick);