"use strict"
import { postFromModal, getData, likeUnlikePosts, card, modelHandler} from './function.js';
// Selecting DOM elements
const spinner = document.querySelector('#spinner');
const loadBtn = document.querySelector('#load-btn');
let array = [];
let cardElment = [];
let models = []

// Event listener for the "Load More" button
let numOfPost = 3;


window.addEventListener("DOMContentLoaded", function () {
console.log('DOM is loaded');
loadBtn.addEventListener('click', () => {
        spinner.classList.remove('d-none');
        numOfPost += 3;
        getData(numOfPost);
        likeUnlikePosts(array);
        modelHandler(models,true);
        // card(cardElment);
    });
getData(numOfPost);
likeUnlikePosts(array);
postFromModal();
})
window.addEventListener("load", function () {
card(cardElment);
modelHandler(models,true);
})







