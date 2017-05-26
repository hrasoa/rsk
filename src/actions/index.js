import axios from 'axios';

export const REQUEST_POSTS = 'REQUEST_POSTS';
function requestPosts(listingName) {
  return {
    type: REQUEST_POSTS,
    listingName
  };
}

export const RECEIVE_POSTS = 'RECEIVE_POSTS';
function receivePosts({ listingName, items }) {
  return {
    type: RECEIVE_POSTS,
    items,
    listingName,
    receivedAt: Date.now()
  };
}

export function fetchPosts({ serverUrl = '', listingName }) {
  return (dispatch) => {
    dispatch(requestPosts(listingName));
    return axios.get(`${serverUrl}/api/posts`)
      .then(response => dispatch(receivePosts({
        items: response.data,
        listingName
      })));
  };
}

export const REQUEST_SINGLE_POST = 'REQUEST_SINGLE_POST';
function requestSinglePost(postId) {
  return {
    type: REQUEST_SINGLE_POST,
    postId
  };
}

export const RECEIVE_SINGLE_POST = 'RECEIVE_SINGLE_POST';
function receiveSinglePost(post) {
  return {
    type: RECEIVE_SINGLE_POST,
    post,
    receivedAt: Date.now()
  };
}

export function fetchSinglePost({ serverUrl = '', ...match }) {
  return (dispatch) => {
    dispatch(requestSinglePost(match.params.id));
    return axios.get(`${serverUrl}/api/posts/${match.params.id}`)
      .then(response => dispatch(receiveSinglePost(response.data)));
  };
}
