"use strict";

const slide = (id) => {
    const myCarouselElement = document.getElementById(`myCarousel-${id}`)
    const carousel = new bootstrap.Carousel(myCarouselElement);
    const btnPrev = document.getElementById(`carousel-control-prev-${id}`);
    const btnNext = document.getElementById(`carousel-control-next-${id}`);
    console.log(btnPrev);
    console.log(btnNext);
    btnPrev.addEventListener('click', ()=>{
        console.log('clicked');
        carousel.prev();
    });
    btnNext.addEventListener('click', ()=>{
        console.log('clicked')
        carousel.next();
    });
}

function createCarousel(imageSources, id) {
    if (imageSources.length === 0) {
        return;
    }

    let carouselIndicators = '';
    let carouselItems = '';

    for (let i = 0; i < imageSources.length; i++) {
        imageSources.length > 1 ? carouselIndicators += `<button style="height: 8px; width: 8px" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}"  class="${i === 0 ? 'active' :''} rounded-circle" ${i === 0 ? ' aria-current="true"' : ''} aria-label="Slide ${i+1}"></button>` : '';
        carouselItems += `<div class="carousel-item ${i === 0 ? 'active' : ''}">
            <img src="${imageSources[i]}" class="d-block w-100 card-img-bottom rounded-1" alt="Slide ${i+1}">
        </div>`;
    }

    let controls = '';
    if (imageSources.length > 1) {
        controls = `<button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" id="carousel-control-prev-${id}">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" id="carousel-control-next-${id}">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>`;
    }

    return `<div id="myCarousel-${id}" class="carousel slide">
        <div class="carousel-indicators">
            ${carouselIndicators}
        </div>
        <div class="carousel-inner">
            ${carouselItems}
        </div>
        ${controls}
    </div>`;
}


const fillModalUpdate = (id, home_page_post=true) =>{
    if (home_page_post) {
        const modalTitle = document.getElementById(`modal-update-title-input-${id}`);
        const modalDescription = document.getElementById(`modal-update-descrition-${id}`);
        const cardTitle = document.getElementById(`title-${id}`);
        const cardDescription = document.getElementById(`card-element-descrition-${id}`);
        modalTitle.value = cardTitle.textContent;
        modalDescription.value = cardDescription.textContent;
    }else {
        const modalTitle = document.getElementById(`detailed-content-modal-update-title-value-${id}`);
        const modalDescription = document.getElementById(`detailed-content-modal-update-descrition-${id}`);
        const detailedContentTitle = document.getElementById(`post-content-title-${id}`);
        const detailedContentDescription = document.getElementById(`detailed-content-descrition-${id}`);
        modalTitle.value = detailedContentTitle.textContent;
        modalDescription.value = detailedContentDescription.textContent;
    }
}



const updatePost = (id, home_page_post=true) => {
   if(home_page_post) {
        const modalTitle = document.getElementById(`modal-update-title-input-${id}`);
        const modalDescription = document.getElementById(`modal-update-descrition-${id}`);
       const body_data = {'title': modalTitle.value, 'description': modalDescription.value}
       fetchBody(`/posts-pro/update-post/${id}/`, body_data).then(response => {
            if (response.status === 200) {
                const cardTitle = document.getElementById(`title-${id}`);
                const cardDescription = document.getElementById(`card-element-descrition-${id}`);
                const btnClose = document.getElementById(`btn-close-update-${id}`);
                        const btnDropdownItem = document.getElementById(`btn-dropdown-${id}`);
                cardTitle.textContent = modalTitle.value
                cardDescription.textContent = modalDescription.value
                btnClose.click();
                updateHomePost(id, true);
                // alert({'success': "Post Updated Successfully"});
            }
        })
            .catch(error => {
                console.log('Error:', error)
            });
    }else{
        const modalTitle = document.getElementById(`detailed-content-modal-update-title-value-${id}`);
        const modalDescription = document.getElementById(`detailed-content-modal-update-descrition-${id}`);
        const btnDropdownItem = document.getElementById(`btn-detailed-content-dropdown-${id}`);
       const body_data = {'title': modalTitle.value, 'description': modalDescription.value}
       fetchBody(`/posts-pro/update-post/${id}/`, body_data).then(response => {
            if (response.status === 200) {
                const cardTitle = document.getElementById(`post-content-title-${id}`);
                const cardDescription = document.getElementById(`detailed-content-descrition-${id}`);
                const btnClose = document.getElementById(`btn-close-detailed-content-update-${id}`);
                cardTitle.textContent = modalTitle.value
                cardDescription.textContent = modalDescription.value
                btnClose.click();

                // btnDropdownItem.click();
                // alert({'success': "Post Updated Successfully"});
            }
        })
            .catch(error => {
                console.log('Error:', error)
            });
    }
                    }

const deletePost = (id, home_page_post=true) => {
    if(home_page_post) {
        return fetchData(`/posts-pro/delete-post/${id}/`, true, "DELETE").then(
            response => {
                if(response.status === 204){
                  const card = document.getElementById(`post-card-${id}`);
                  const closed = document.getElementById(`close-btn-delete-${id}`);
                  closed.click();
                  setTimeout(() => {
                      card.remove();
                  }, 1)
//                 alert({'success': "Post Deleted Successfully"});
                }
            }).catch(error => {
            console.error(error);
        })
    } else {
        const closed = document.getElementById(`close-btn-detailed-content-delete-${id}`);
        closed.click();
        const detailedContentCard = document.getElementById(`detailed-content-post-${id}`);
        detailedContentCard.remove();
        switchPage(false);
        history.replaceState(null, "", "/posts-pro/",)
        const card = document.getElementById(`post-card-${id}`);
        card.remove();
        fetchData(`/posts-pro/delete-post/${id}/`, true, "DELETE").then(
            response => {
                if(response.status === 204 ){
    //                 alert({'success': "Post Deleted Successfully"});
                }
            }).catch(error => {
            console.error(error);
        })
    }
}
const fetchBody = (url, body_data) => {
    return fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken,
        },
        body: new URLSearchParams(body_data),
    })
}
function fetchData(url, with_csrftoken = true, method = "POST") {

    if (with_csrftoken) {
        return fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrftoken
        },
        method: method,
    })
    }else
    return fetch(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
        },
        method: method,
    })
}

export function modelHandler(array, home_page = true) {
    setTimeout(() => {
        if (home_page) {
            const forms = allForms().filter((element) => !array.includes(element));
            forms.forEach(element => {
                array.push(element);
                const id = element.getAttribute('data-formID');
                const btnDeletePost = document.getElementById(`btn-delete-${id}`);
                const btnUpdatePost = document.getElementById(`btn-update-${id}`);
                const btnUpdateDropdownItem = document.getElementById(`dropdown-item-btn-update-${id}`);
                element.addEventListener('submit', (e) => {
                    e.preventDefault();
                });
                btnUpdateDropdownItem.addEventListener('click', () => {
                    fillModalUpdate(id, true);
                });
                btnDeletePost.addEventListener('click', () => {
                    deletePost(id, true);
                });
                btnUpdatePost.addEventListener('click', () => {
                    updatePost(id, true);
                    (function () {
                        const btnDropdownItem = document.getElementById(`btn-dropdown-${id}`);
                        console.log(btnDropdownItem);
                        btnDropdownItem.click();
                    })();
                });
            });
        } else {
            try {
                let arr = Array.from(new Set(array));
                const id = arr[0].getAttribute('data-formID');
        if (id === null) {
            throw new Error("Form id equal to null");
        }else {
            arr.forEach( element => {
                element.addEventListener('submit', (e) => {
                    e.preventDefault();
                });
            })
            document.getElementById(`btn-detailed-content-delete-${id}`).addEventListener('click', () => {
                console.log('g');
                deletePost(id, false);
                });


            const detailedContentBtnUpdatePost = document.getElementById(`btn-detailed-content-update-${id}`);
            const detailedContentBtnUpdateDropdownItem = document.getElementById(`dropdown-item-btn-detailed-content-update-${id}`);
            detailedContentBtnUpdateDropdownItem.addEventListener('click', () => {
            fillModalUpdate(id, false);});
            detailedContentBtnUpdatePost.addEventListener('click', () => {
                updatePost(id, false);
                   window.addEventListener('popstate', function (event) {
                    event.preventDefault();
                    console.log('upd event triggered');
                    updateHomePost(id, true);
                })
            });
        }
} catch (e) {
    console.error(e.message);
}

            //
        }
    }, 400);
}



////////////////////////////////////////////////////////////////////////////// Home Page Functions ////////////////////////////////////////////////////////////////////////////

// function that dislay an alert each time specific action is done
 const alert = (response = true, error, success = "Post Added Successfully") =>{
    const alert = document.getElementById("alert").classList;
    const alertText = document.getElementById("alert-text");
    const alertBlock = document.getElementById("alert-block").classList;
    const alertClose = document.getElementById("alert-close-button");
     if (response){
         if (alert.contains("alert-danger")){
             alert.remove("alert-danger");
             alert.add("alert-success");
             alertBlock.remove("d-none");
             alertText.textContent = success;
             return   setTimeout(() => {
                 alertClose.click();
             }, 7000);
         }else{
              alertBlock.remove("d-none");
              return   setTimeout(() => {
                 alertClose.click();
             }, 5000);

         }
     }else {
         if (alert.contains("alert-success")){
             alert.remove("alert-success");
             alert.add("alert-danger");
             alertText.textContent = error;
             alertBlock.remove("d-none");
             // alertClose.click();
         }else {
             alertBlock.remove("d-none");
         }
     }
}


// fuunction that retrieve csrf token

const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Retrieving the CSRF token

const csrftoken = getCookie('csrftoken');

// function that deal with like and unlike button

const likedUnlikedNull = (liked = false, unliked = false, id) => {
    const biHandThumbsUp = document.getElementById(`bi-hand-thumbs-up-${id}`);
    const biHandThumbsUpFill = document.getElementById(`bi-hand-thumbs-up-fill-${id}`);
    const biHandThumbsDown = document.getElementById(`bi-hand-thumbs-down-${id}`);
    const biHandThumbsDownFill = document.getElementById(`bi-hand-thumbs-down-fill-${id}`);
    const displayNone = "d-none";

    const btnLike = () => {
        biHandThumbsUpFill.classList.remove(displayNone);
        biHandThumbsUp.classList.add(displayNone);
        biHandThumbsDownFill.classList.add(displayNone);
        biHandThumbsDown.classList.remove(displayNone);
    };

    const btnUnlike = () => {
        biHandThumbsUpFill.classList.add(displayNone);
        biHandThumbsDownFill.classList.remove(displayNone);
        biHandThumbsUp.classList.remove(displayNone);
        biHandThumbsDown.classList.add(displayNone);
    };

    const btnNull = () => {
        biHandThumbsUp.classList.remove(displayNone);
        biHandThumbsUpFill.classList.add(displayNone);
        biHandThumbsDown.classList.remove(displayNone);
        biHandThumbsDownFill.classList.add(displayNone);
    };

    if (liked) {
        btnLike();
    } else if (unliked) {
        btnUnlike();
    } else {
        btnNull();
    }
};


// function that deal with the count of each buttons'cards
 const count = (up, down, id) =>{
        let countDown = document.getElementById(`count-down-${id}`);
        let countUp = document.getElementById(`count-up-${id}`);
        countDown.textContent = down;
        countUp.textContent = up;
}

//function that deal with the like, comment and unlike buttons
export const likeUnlikePosts = (arr) => {
return setTimeout(() => {
    const displayNone = "d-none";
    console.log(Array.from(new Set(document.getElementsByClassName('like-unlike-forms'))))
    const forms = Array.from(new Set(document.getElementsByClassName('like-unlike-forms'))).filter((element)=> !(arr.includes(element)));
    // console.log(forms);
    forms.forEach(form => {
        arr.push(form);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
        // console.log(form);
        const postId = form.getAttribute('data-form-id');
        const biHandThumbsUp = document.getElementById(`bi-hand-thumbs-up-${postId}`);
        const biHandThumbsDownFill = document.getElementById(`bi-hand-thumbs-down-fill-${postId}`);
        const btnLikeClicked = document.getElementById(`like-${postId}`);
        const btnUnlikeClicked = document.getElementById(`unlike-${postId}`);
        // const commentCount = document.getElementById(`comment-count-${postId}`);
        btnLikeClicked.addEventListener('click', (e) => {
            if (!(biHandThumbsUp.classList.contains(displayNone))) {
                // Handle "Like" button click
                fetchData(`/posts-pro/like-post/${postId}/`, true, 'POST')
                    .then(response => response.json())
                    .then(data => {
                        count(data["like_counts"], data["unlike_counts"], data.id);
                        likedUnlikedNull(true, false, data.id);
                        console.log(`this is like count ${data["like_counts"] } and this is the unlike count ${data["unlike_counts"]}`);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                // Handle "Unlike" button click
                fetchData(`/posts-pro/null-post/${postId}/`, true, 'POST')
                    .then(response => response.json())
                    .then(data => {
                        count(data["like_counts"], data["unlike_counts"], data.id);
                        likedUnlikedNull(false, false, data.id);

                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        });
        btnUnlikeClicked.addEventListener('click', (e) => {
            if (biHandThumbsDownFill.classList.contains(displayNone)) {
                // Handle "Unlike" button click
                fetchData(`/posts-pro/unlike-post/${postId}/`, true, 'POST')
                    .then(response => response.json())
                    .then(data => {
                        count(data["like_counts"], data["unlike_counts"], data.id);
                        likedUnlikedNull(false, true, data.id);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                // Handle "Like" button click
                fetchData(`/posts-pro/null-post/${postId}/`, true, 'POST')
                    .then(response => response.json())
                    .then(data => {
                        count(data["like_counts"], data["unlike_counts"], data.id);
                        likedUnlikedNull(false, false, data.id);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        })
    })
}, 1000)

}


// function that switch between pages (home and post detail content)
const switchPage = (bool = true, title_page= 'Home') => {
     const homePage = document.getElementById("home-page");
     const postDetailPage = document.getElementById("post-page-detail-content");
    if (bool){
        document.title = title_page;
        homePage.classList.add("d-none");
        postDetailPage.classList.remove("d-none");
    }else {
        document.title = title_page;
        homePage.classList.remove("d-none");
        postDetailPage.classList.add("d-none");
    }
}


// function that display each post related to an user
 function cardElement(title, content, author, count_up, count_down, count_comment, post_id, array_photo) {
     return  `
        <div class="col-12 col-md-5 col-sm-12 col-xs-12 w-100 h-100 row post-card" id="post-card-${post_id}" data-post-id="${post_id}">
                <div class="card p-3 p-md-4 position-relative">
                        <div class="dropdown position-absolute top-0 end-0 mt-3">
                              <a class="btn btn-default" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="btn-dropdown-${post_id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                </svg>
                              </a>
                              <ul class="dropdown-menu append-btn-update-delete">
                                    <li >
                                        <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#delete-${post_id}">
                                          <i class="bi bi-trash"></i>  <span class="btn-text-post-three-dot"> Delete </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="dropdown-item" id="dropdown-item-btn-update-${post_id}" data-bs-toggle="modal" data-bs-target="#update-${post_id}">
                                          <i class="bi bi-pencil"></i>  <span class="btn-text-post-three-dot"> Update </span>
                                        </button>
                                    </li>
                              </ul>
                        </div>
                        <div class="card-header d-flex flex-row justify-content-between">
                                <h2 class="bold mb-3 card-title"> <span class="card-title-content" id="title-${post_id}" data-title="${title}">${title}</span></h2>
                                <div class="author-profile"
                                    <h3 class="bold mb-2 author"><span class="author" id="author-${post_id}" data-author="${author}">${author}</span></h3>
                                </div>
                        </div>
                        <div class="card-body">
                               <p class="card-text"><span class="card-text-content" id="card-element-descrition-${post_id}">${content}</span></p>
                               ${createCarousel(array_photo, post_id)}
<!--                                 <img src="..." class="card-img-bottom " alt="...">-->
                        </div>
                        <div class="card-footer">
                            <form class="like-unlike-forms" data-form-id="${post_id}" method="post" >
                                <div class="d-flex flex-row justify-content-around flex-shrink-1">
                                    <div class="w-75 d-flex flex-row justify-content-evenly">
                                        <div class="d-flex flex-row justify-content-around">
                                            <button class="btn btn-like" id="like-${post_id}" type="submit" title="like">
                                                    <!-- Your like button SVG code -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-hand-thumbs-up" id="bi-hand-thumbs-up-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-hand-thumbs-up-fill d-none" id="bi-hand-thumbs-up-fill-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                                    </svg>
                                            </button>
                                            <div class="fs-3 fw-light" id="count-up-${post_id}">${count_up}</div>
                                        </div>
                                        <div class="d-flex flex-row justify-content-around">
                                            <button class="btn btn-unlike" id="unlike-${post_id}" type="submit" title="unlike">
                                                    <!-- Your unlike button SVG code -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-hand-thumbs-down" id="bi-hand-thumbs-down-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-hand-thumbs-down-fill d-none" id="bi-hand-thumbs-down-fill-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
                                                    </svg>
                                            </button>
                                            <div class="fs-3" id="count-down-${post_id}">${count_down}</div>
                                        </div>
                                        <div class="d-flex flex-row justify-content-around">
                                            <button class="btn btn-comment" id="comment-${post_id}" type="submit" title="comment" data-bs-toggle="modal" data-bs-target="#commentModal">
                                                    <!-- Your comment button SVG code -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-dots" id="bi-chat-dots-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                                      <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                                                    </svg>
                                            </button>
                                            <div class="count fs-3 btn-info" id="comment-count-${post_id}">
                                                ${count_comment}
                                            </div>
                                        </div>
                                        <div>
                                            <button class="btn" id="" type="submit" title="info">
                                                    <!-- Your info button SVG code -->
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                </div>
                <!-- Comment Modal -->
<div class="modal fade" id="commentModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
        <form action="" id="modal-comment-id-${post_id}" data-formID = "${post_id}">
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Comment</button>
            </div>
        </form>
    </div>
  </div>
</div>

<!-- Modal Update -->
<div class="modal fade" id="update-${post_id}" tabindex="-1" aria-labelledby="update" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="modal-update-title-header-${post_id}">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body mb-3">
         <div class="form-floating mb-3">
              <input type="text" class="form-control" id="modal-update-title-input-${post_id}" required>
              <label for="card-content-title">Title</label>
          </div>
        <div class="form-floating">
          <textarea class="form-control"  id="modal-update-descrition-${post_id}" required></textarea>
          <label for="card-content-descrition">Description</label>
        </div>
      </div>
        <form action="" class="modal-update" data-formID = "${post_id}">
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btn-close-update-${post_id}">Close</button>
                <button type="submit" class="btn btn-primary" id="btn-update-${post_id}">Update</button>
            </div>
        </form>
    </div>
  </div>
</div>


    <!-- Delete Modal -->
<div class="modal fade" id="delete-${post_id}" tabindex="-1" aria-labelledby="update" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="delete-post-text text-align-center">
                    Are you sure you want to delete this post?
                </p>
            </div>
            <form action="" class="modal-delete" data-formID = "${post_id}">
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="close-btn-delete-${post_id}">Close</button>
                    <button type="submit" class="btn btn-danger" id="btn-delete-${post_id}">Delete</button>
                </div>
            </form>
        </div>
    </div>
</div>
        </div>`;
}

// function that handles to post a post from the modal add new post

export const postFromModal = (arr) => {
    const postEl = document.querySelector('#post-el');
    const postForm = document.getElementById('post-form');
    const title = document.getElementById('id_title');
    const description = document.getElementById('id_description');
    const closed = document.getElementById('closed');
    const csrf = document.getElementsByName("csrfmiddlewaretoken");
    const dropzoneEl = document.getElementById("dropzone-container");
    let imgUrl;
        var myDropzone = new Dropzone("#dropzone-container", {
    url: "/posts-pro/upload/",
            type: "POST", // This will be replaced with the correct URL in the AJAX success callback
    headers: {
        "X-CSRFToken": csrftoken
    },
    paramName: "file",
    maxFilesize: 5,
    acceptedFiles: "image/*",
    autoProcessQueue: false,
    addRemoveLinks: true,
});

myDropzone.on("addedfile", function(file) {
    var reader = new FileReader();

    reader.onloadend = function() {
        var img = document.createElement('img');
        img.src = reader.result;
        img.className = "dropzone-img";
        document.getElementById("preview").appendChild(img);
    }

    reader.onerror = function() {
        console.error("There was an error reading the file!");
    }

    if (file) {
        reader.readAsDataURL(file);
    }
});

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let formData = new FormData(postForm);
        formData.append("csrfmiddlewaretoken", csrf[0].value);
        formData.append("title", title.value);
        formData.append("description", description.value);

        $.ajax({
            url: '/posts-pro/',
            type: 'POST',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                let id_post = response.id;
                myDropzone.options.url = `/posts-pro/upload/${id_post}/`;
                myDropzone.processQueue();

                // Add the queuecomplete event listener
                myDropzone.on("queuecomplete", function() {
                    fetchData(`/posts-pro/img_url/${id_post}/`, false, "GET").then(
                        response => response.json()
                    ).then(
                        response => console.log(response)
                    );
                    postEl.insertAdjacentHTML('afterbegin', cardElement(response.title, response.description, response.author, 0, 0, 0, id_post, imgUrl));
                    likeUnlikePosts(arr);
                    closed.click();
                    postForm.reset();
                    alert(true);
                });
            },
            error: function (error) {
                alert(false, error);
                console.log('Error:', error);
            }
        });
    });
}





// function that retrieve the post data

export const getData = (numOfPost) => {
     const postEl = document.querySelector('#post-el');
    const endBox = document.querySelector('#end-box');
    const spinner = document.querySelector('#spinner');
    const loadBtn = document.querySelector('#load-btn');
    let carousel = [];
    fetch(`/posts-pro/posts/${numOfPost}/`, {
            headers: {'X-Requested-With': 'XMLHttpRequest'},

    })
    .then(response => response.json())
    .then(response => {
        console.log(response);
        document.title = "Home";
        window.history.pushState(null, ``, `${window.location.href}`);
        const posts = response.post;
        setTimeout(() => {
            spinner.classList.add('d-none');
            posts.forEach(element => {
                postEl.innerHTML += cardElement(element.title, element.description, element.author, element.liked_count, element.unliked_count, element.comments_count, element.id, element.photos);
                likedUnlikedNull(element.liked, element.unliked, element.id);
                console.log(element.photos)
                if(element.photos.length > 1){
                    carousel.push(element.id);
                }
                    })
            endBox.classList.remove("d-none");
            carousel.forEach(element => slide(element));
        }, 25);
        if (response.size === 0) {
            endBox.textContent = 'No Post(s) Added Yet...';
        } else if (response.size < numOfPost) {
            loadBtn.classList.add("d-none");
            endBox.textContent = 'No More Post(s) Available...';
        }
    })
    .catch(error => {
        console.error(error);
    });
}


// function which update a post


/////////////////////////////////////////////////////////////////////////// Post Detail Content Functions ////////////////////////////////////////////////////////////////////////////////

// function that handles to get the detail of a specific post
function getPostDetail(id) {
        fetchData(`http://127.0.0.1:8000/posts-pro/get-card-data/${id}/`, true, 'GET').then(response => response.json())
            .then(data => {
                window.history.pushState(null, "", `${window.location.href}${id}`);
                // document.title = `${data.author} - ${data.title}`;
                const posts = document.getElementById("post-card-detail");
                posts.innerHTML = "";
                console.log(data);
                const allForm1 = allForms();
                console.log(allForm1.length)
                posts.innerHTML += postContent(data.title, data.description, data.author, data.like_counts, data.unlike_counts, data.comment_counts, data.id);
                likedUnlikedNullCardDetailContent(data.liked, data.unliked, data.id);
                // postFromModal();
                postDetail();
                switchPage(true, `${data.author} - ${data.title}`);
                const allForm2 = allForms().filter( element => !allForm1.includes(element));
                console.log(allForm2)
                modelHandler(allForm2, false);
                let submited = false;
                document.getElementById(`detailed-content-form-${id}`).addEventListener('submit', (e) => {
                        submited = true;
                    })
                // updatePost();
                window.addEventListener('popstate', function (event) {
                    event.preventDefault()
                    updateHomePost(data.id, submited)

                    // Handle the state change here
                });
            }).catch(error => {
                console.log('Error:', error);
                console.error(error);
            });
}

// function that handles the post buttons detail
const postDetail = () => {
    const displayNone = "d-none";
    const forms = Array.from(new Set(document.getElementsByClassName('detail-post-content-forms')));
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
        // console.log(form);
        const postId = form.getAttribute('data-FormID');
        const biHandThumbsUp = document.getElementById(`bi-hand-thumbs-up-cards-content-like-${postId}`);
        const biHandThumbsDownFill = document.getElementById(`bi-hand-thumbs-down-fill-cards-content-unlike-${postId}`);
        const btnLikeClicked = document.getElementById(`like-cards-content-${postId}`);
        const btnUnlikeClicked = document.getElementById(`unlike-cards-content-${postId}`);
        // const commentCount = document.getElementById(`comment-count-${postId}`);
        btnLikeClicked.addEventListener('click', (e) => {
            console.log('like');
            if (!(biHandThumbsUp.classList.contains(displayNone))) {
                // Handle "Like" button click
                fetchData(`/posts-pro/like-post/${postId}/`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        countDetailCard(data["like_counts"], data["unlike_counts"], data.id);
                        likedUnlikedNullCardDetailContent(true, false, data.id);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                            console.log('like');
                // Handle "Unlike" button click
                fetchData(`/posts-pro/null-post/${postId}/`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        countDetailCard(data["like_counts"], data["unlike_counts"], data.id);
                        likedUnlikedNullCardDetailContent(false, false, data.id);

                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        });
        btnUnlikeClicked.addEventListener('click', (e) => {
            if (biHandThumbsDownFill.classList.contains(displayNone)) {
                fetchData(`/posts-pro/unlike-post/${postId}/`)
                    .then(response => response.json())
                    .then(data => {
                        countDetailCard(data["like_counts"], data["unlike_counts"], data.id);
                        likedUnlikedNullCardDetailContent(false, true, data.id);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } else {
                fetchData(`/posts-pro/null-post/${postId}/`)
                    .then(response => response.json())
                    .then(data => {
                        countDetailCard(data["like_counts"], data["unlike_counts"], data.id);
                        likedUnlikedNullCardDetailContent(false, false, data.id);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        })
    })

}

// function that display the post content
function postContent(title, content, author, count_up, count_down, count_comment, post_id) {
     return  `
        <div class="col-12 col-md-5 col-sm-12 col-xs-12 w-100 h-100 row" data-postCardID="${post_id}" id="detailed-content-post-${post_id}">
                <div class="card p-3 p-md-4 position-relative">
                        <div class="dropdown position-absolute top-0 end-0 mt-3">
                              <a class="btn btn-default" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="btn-detailed-content-dropdown-${post_id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                  <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                </svg>
                              </a>
                              <ul class="dropdown-menu append-btn-update-delete">
                                    <li >
                                        <button type="button" class="dropdown-item" data-bs-toggle="modal" data-bs-target="#detailed-content-delete-${post_id}">
                                          <i class="bi bi-trash"></i>  <span class="btn-text-post-three-dot"> Delete </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button type="button" class="dropdown-item" id="dropdown-item-btn-detailed-content-update-${post_id}" data-bs-toggle="modal" data-bs-target="#detailed-content-update-${post_id}">
                                          <i class="bi bi-pencil"></i>  <span class="btn-text-post-three-dot"> Update </span>
                                        </button>
                                    </li>
                              </ul>
                        </div>
                        <div class="card-header d-flex flex-row justify-content-between">
                                <h2 class="bold mb-3 card-title"> <span id="post-content-title-${post_id}">${title}</span></h2>
                                <div class="author-profile"
                                    <h3 class="bold mb-2 author"><span id="post-content-author-${post_id}">${author}</span></h3>
                                </div>
                        </div>
                        <div class="card-body">
                               <p class="card-text"><span class="card-text-content" id="detailed-content-descrition-${post_id}">${content}</span></p>
                        </div>
                        <div class="card-footer">
                            <form class="detail-post-content-forms" data-FormID="${post_id}" method="post" id="detailed-content-form-${post_id}">
                                <div class="d-flex flex-row justify-content-around flex-shrink-1">
                                    <div class="w-75 d-flex flex-row justify-content-evenly">
                                        <div class="d-flex flex-row justify-content-around">
                                            <button class="btn btn-like" id="like-cards-content-${post_id}" type="submit" title="like">
                                                    <!-- Your like button SVG code -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class=" bi-hand-thumbs-up" id="bi-hand-thumbs-up-cards-content-like-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class=" bi-hand-thumbs-up-fill d-none" id="bi-hand-thumbs-up-fill-cards-content-like-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
                                                    </svg>
                                            </button>
                                            <div class="fs-3 fw-light" id="count-up-cards-content-${post_id}">${count_up}</div>
                                        </div>
                                        <div class="d-flex flex-row justify-content-around">
                                            <button class="btn btn-unlike" id="unlike-cards-content-${post_id}" type="submit" title="unlike">
                                                    <!-- Your unlike button SVG code -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class=" bi-hand-thumbs-down" id="bi-hand-thumbs-down-cards-content-unlike-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class=" bi-hand-thumbs-down-fill d-none" id="bi-hand-thumbs-down-fill-cards-content-unlike-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"/>
                                                    </svg>
                                            </button>
                                            <div class="fs-3" id="count-down-cards-content-${post_id}">${count_down}</div>
                                        </div>
                                        <div class="d-flex flex-row justify-content-around">
                                            <button class="btn btn-comment" id="comment-cards-content-${post_id}" type="submit" title="comment" data-bs-toggle="modal" data-bs-target="#commentModal">
                                                    <!-- Your comment button SVG code -->
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class=" bi-chat-dots" id="bi-chat-dots-cards-content-comment-${post_id}" viewBox="0 0 16 16">
                                                      <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                                                      <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                                                    </svg>
                                            </button>
                                            <div class="count fs-3 btn-info" id="comment-count-cards-content-${post_id}">
                                                ${count_comment}
                                            </div>
                                        </div>
                                        <div>
                                            <button class="btn" id="" type="submit" title="info">
                                                    <!-- Your info button SVG code -->
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi-info-circle" viewBox="0 0 16 16">
                                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                </div>
        </div>
        
                                        <!--        modal for commenting a post     -->
        <div class="modal fade" id="comment-cards-content-${post_id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                ...
              </div>
                <form action="" id="modal-comment-cards-content-id-${post_id}" data-formID = "${post_id}">
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Comment</button>
                    </div>
                </form>
            </div>
          </div>
        </div>

                                        <!--        modal for update a post     -->

        <div class="modal fade" id="detailed-content-update-${post_id}" tabindex="-1" aria-labelledby="update" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="detailed-content-modal-update-title-header-${post_id}">Modal title</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body mb-3">
                 <div class="form-floating mb-3">
                      <input type="text" class="form-control" id="detailed-content-modal-update-title-value-${post_id}" required>
                      <label for="card-content-title">Title</label>
                  </div>
                <div class="form-floating">
                  <textarea class="form-control"  id="detailed-content-modal-update-descrition-${post_id}" required></textarea>
                  <label for="card-content-descrition">Description</label>
                </div>
              </div>
                <form action="" class="modal-update" data-formID = "${post_id}">
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="btn-close-detailed-content-update-${post_id}">Close</button>
                        <button type="submit" class="btn btn-primary" id="btn-detailed-content-update-${post_id}">Update</button>
                    </div>
                </form>
            </div>
          </div>
        </div>


                                            <!-- Modal For Deleting A Delete -->
    <div class="modal fade" id="detailed-content-delete-${post_id}" tabindex="-1" aria-labelledby="update" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="delete-post-text text-align-center">
                        Are you sure you want to delete this post?
                    </p>
                </div>
                <form action="" class="modal-delete" data-formID = "${post_id}">
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="close-btn-detailed-content-delete-${post_id}">Close</button>
                        <button type="submit" class="btn btn-danger" id="btn-detailed-content-delete-${post_id}">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
        </div>`;
}

// Liked and unliked handlin
const likedUnlikedNullCardDetailContent = (liked = false, unliked = false, id) => {
    const biHandThumbsUp = document.getElementById(`bi-hand-thumbs-up-cards-content-like-${id}`);
    const biHandThumbsUpFill = document.getElementById(`bi-hand-thumbs-up-fill-cards-content-like-${id}`);
    const biHandThumbsDown = document.getElementById(`bi-hand-thumbs-down-cards-content-unlike-${id}`);
    const biHandThumbsDownFill = document.getElementById(`bi-hand-thumbs-down-fill-cards-content-unlike-${id}`);
    const displayNone = "d-none";
const btnLike = () => {
        biHandThumbsUpFill.classList.remove(displayNone);
        biHandThumbsUp.classList.add(displayNone);
        biHandThumbsDownFill.classList.add(displayNone);
        biHandThumbsDown.classList.remove(displayNone);
    };

    const btnUnlike = () => {
        biHandThumbsUpFill.classList.add(displayNone);
        biHandThumbsDownFill.classList.remove(displayNone);
        biHandThumbsUp.classList.remove(displayNone);
        biHandThumbsDown.classList.add(displayNone);
    };

    const btnNull = () => {
        biHandThumbsUp.classList.remove(displayNone);
        biHandThumbsUpFill.classList.add(displayNone);
        biHandThumbsDown.classList.remove(displayNone);
        biHandThumbsDownFill.classList.add(displayNone);
    };

    if (liked) {
        btnLike();
    } else if (unliked) {
        btnUnlike();
    } else {
        btnNull();
    }
}


// Counting like and unlike and comment
 const countDetailCard = (up, down, id) =>{
        let countDown = document.getElementById(`count-down-cards-content-${id}`);
        let countUp = document.getElementById(`count-up-cards-content-${id}`);
        // let comment = document.getElementById(`comment-count-cards-content-${id}`);
        countDown.textContent = down;
        countUp.textContent = up;
}

function updateHomePost(postId, submited = true) {

     if (submited) {// Fetch data for the specified postId
         return fetchData(`/posts-pro/get-card-data/${postId}/`, true, "GET")
             .then(response => response.json())
             .then(data => {
                 console.log(data);
                 const posts = document.getElementById("post-card-detail");
                 switchPage(false);
                 // document.title = 'Home';
                 const cardTitle     = document.getElementById(`title-${postId}`);
                const cardDescription = document.getElementById(`card-element-descrition-${postId}`);
                if (cardTitle.textContent !== data.title) {
                    cardTitle.textContent = data.title;
                }
                if (cardDescription.textContent !== data.description) {
                    cardDescription.textContent = data.description;
                }
                 likedUnlikedNull(data.liked, data.unliked, data.id);
                 count(data.like_counts, data.unlike_counts, data.id);
                 history.pushState('null', 'Home', '/posts-pro/');
                 // You can now use the fetched data as needed
             }).catch(error => {
             console.log('Error fetching data:', error);
         });
     }else {
         return switchPage(false);
     }
}
const allForms = () =>{
         const deleteModel = Array.from(new Set(document.getElementsByClassName('modal-delete')));
        const updateModel = Array.from(new Set(document.getElementsByClassName('modal-update')));
        return deleteModel.concat(updateModel);
}
export const card = (arr) => {
    setTimeout(() => {
        const cards = Array.from(new Set(document.querySelectorAll(".post-card"))).filter((element)=> !(arr.includes(element)));
        const buttons = document.getElementsByTagName("button");
        const imgs = document.getElementsByTagName("img");
        const links = document.getElementsByTagName("a");
    console.log(cards);
        cards.forEach(card => {
            arr.push(card);
            const id = card.getAttribute('data-post-id');
            card.addEventListener('click', function (event) {
                const elementsTargeted = event.target.matches('.card-text-content, .card-title-content, .author, svg, .btn-comment, .btn-delete,.btn-update, .btn-text-post-three-dot, .bi, .dropdown-item, .modal-dialog, img, .carousel-control-prev, .carousel-control-next, .visually-hidden, .carousel-control-next-icon, .carousel-control-prev-icon');
                const buttonElementsTargeted = Array.from(buttons).some(button => event.target === button);
                const imgElementsTargeted = Array.from(imgs).some(img => event.target === img);
                const aElementsTargeted = Array.from(links).some(link => event.target === link);
                const modal = Array.from(new Set(document.getElementsByClassName(".modal") ));
if (elementsTargeted || buttonElementsTargeted) {
    console.log('clicked');
                    event.stopPropagation();
                }else {
                                getPostDetail(id);
                }
            });
        });

    }, 600);
}