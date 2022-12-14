"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const found = currentUser.favorites.find(favorite => favorite.storyId === story.storyId);

  if(found) { // if favorite story exist
  return $(`
      <li>
        <img id="${story.storyId}" class="fav-story" width="15" height="15" src="${favoriteStar}" >
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else {
    return $(`
    <li>
      <img id="${story.storyId}" class="fav-story" width="15" height="15" src="${unFavoriteStar}" >
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
  }
}

function generateOwnStoryMarkup(story) {

  const hostName = story.getHostName();
 
  return $(`
  <li>
    <img id="${story.storyId}" class="my-story" width="15" height="15" src="${deleteBtn}" >
    <a href="${story.url}" target="a_blank" class="story-link">
      ${story.title}
    </a>
    <small class="story-hostname">(${hostName})</small>
    <small class="story-author">by ${story.author}</small>
    <small class="story-user">posted by ${story.username}</small>
  </li>
`);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();

}

// http://curric.rithmschool.com/springboard/exercises/hack-or-snooze-ajax-api/
// https://hackorsnoozev3.docs.apiary.io/#introduction/authentication
async function createStory(event) {

  event.preventDefault();

  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const URLInput = document.getElementById('story-link');

  console.log(titleInput.value);
  console.log(authorInput.value);
  console.log(URLInput.value);

  const userInputStory = {
    "author": authorInput.value,
    "title": titleInput.value,
    "url": URLInput.value
  };

  let response = await storyList.addStory(currentUser, userInputStory);

  // Update story list
  storyList.stories.unshift(new Story(response.story))

  // Update the DOM
  putStoriesOnPage();

  // Update current ownStories
  currentUser.ownStories.push(new Story(response.story))
}


const createStoryForm = document.getElementById('createStoryForm');
createStoryForm.addEventListener('submit', createStory);