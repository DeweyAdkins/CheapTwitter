// Check if user is logged in
if (!localStorage.getItem('loggedIn') && window.location.pathname !== '/indexlog.html') {
    window.location.href = 'indexlog.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postIdInput = document.getElementById('postId');
    const contentInput = document.getElementById('content');
    const imageUpload = document.getElementById('imageUpload');
    const imageButton = document.getElementById('imageButton');
    const imagePreview = document.getElementById('imagePreview');
    const postsContainer = document.getElementById('posts');
    const charCount = document.getElementById('charCount');
    const searchInput = document.querySelector('.search-bar input');
    let uploadedImage = '';
    let imageRemoved = false;

    document.getElementById('switchUser').addEventListener('click', switchUser);

    function switchUser() {
        localStorage.removeItem('loggedIn');
        window.location.href = 'indexlog.html';
    }

    contentInput.addEventListener('input', () => {
        charCount.textContent = `${contentInput.value.length}/280`;
    });

    imageButton.addEventListener('click', () => {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImage = e.target.result;
                imagePreview.innerHTML = `<img src="${uploadedImage}" alt="Image Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });

    postForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const postId = postIdInput.value;
        const content = contentInput.value.trim();

        if (content.length > 280) {
            alert('Tweet cannot exceed 280 characters.');
            return;
        }

        if (!content && !uploadedImage) {
            return; // Prevent posting empty tweets
        }

        if (postId) {
            updatePost(postId, content, uploadedImage, imageRemoved);
        } else {
            createPost(content, uploadedImage);
        }

        postForm.reset();
        postIdInput.value = '';
        imagePreview.innerHTML = '';
        uploadedImage = '';
        charCount.textContent = '0/280';
        displayPosts();
    });

    function createPost(content, image) {
        const posts = getPosts();
        const now = new Date();
        const newPost = {
            id: Date.now().toString(),
            username: 'Web Ghost',
            handle: '@Web_Ghost',
            timestamp: now.toISOString(),
            content,
            image,
            profileImage: 'https://via.placeholder.com/50',
            likes: 0, // Initialize likes to 0
            comments: [] // Initialize comments array
        };
        posts.push(newPost);
        savePosts(posts);
    }

    function updatePost(id, content, image, imageRemoved) {
        const posts = getPosts();
        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            posts[postIndex].content = content;
            if (imageRemoved) {
                posts[postIndex].image = '';
            } else {
                posts[postIndex].image = image;
            }
            savePosts(posts);
        }
    }

    function deletePost(id) {
        const posts = getPosts();
        const updatedPosts = posts.filter(post => post.id !== id);
        savePosts(updatedPosts);
        displayPosts();
    }

    function getPosts() {
        return JSON.parse(localStorage.getItem('posts')) || [];
    }

    function savePosts(posts) {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function displayPosts(filteredPosts = null) {
        const posts = filteredPosts || getPosts();
        postsContainer.innerHTML = posts.reverse().map(post => `
            <div class="post" id="post-${post.id}">
                <img src="${post.profileImage}" alt="Profile Image">
                <div class="post-content">
                    <div class="post-header">
                        <div>
                            <span class="username">${post.username}</span>
                            <span class="handle">${post.handle}</span>
                            <span class="timestamp">${formatTimestamp(post.timestamp)}</span>
                        </div>
                        <div class="actions">
                            <button class="edit btn btn-info btn-sm" onclick="editPost('${post.id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deletePost('${post.id}')">Delete</button>
                        </div>
                    </div>
                    <div class="post-body">
                        <p id="content-${post.id}">${post.content}</p>
                        ${post.image ? `<img src="${post.image}" alt="Tweet Image" class="img-fluid" id="image-${post.id}">` : ''}
                        <textarea class="form-control edit-textarea" id="edit-content-${post.id}" rows="3" style="display:none;">${post.content}</textarea>
                        ${post.image ? `<button class="btn btn-warning mt-2" id="remove-image-${post.id}" style="display:none;" onclick="markImageForRemoval('${post.id}')">Remove Photo</button>` : ''}
                        <button class="btn btn-primary mt-2" id="save-${post.id}" style="display:none;" onclick="saveEdit('${post.id}')">Save</button>
                        <button class="btn btn-secondary mt-2" id="cancel-${post.id}" style="display:none;" onclick="cancelEdit('${post.id}')">Cancel</button>
                    </div>
                    <div class="post-footer">
                    <i onclick="commentPosts('${post.id}')" class="far fa-comment"></i>
                    <i onclick="likePosts('${post.id}')" class="far fa-heart" id="like-icon-${post.id}"></i>
                    <span id="like-count-${post.id}">${post.likes || 0}</span> <!-- Default to 0 if undefined -->
                </div>
                <div class="comment-box" id="comment-box-${post.id}" style="display: none;">
                    <textarea class="form-control" rows="2" placeholder="Write a comment..."></textarea>
                    <button class="btn btn-primary mt-2" onclick="addComment('${post.id}')">Comment</button>
                </div>
            </div>
        </div>
        `).join('');
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
    }

    window.editPost = function(id) {
        const contentElement = document.getElementById(`content-${id}`);
        const editElement = document.getElementById(`edit-content-${id}`);
        const saveButton = document.getElementById(`save-${id}`);
        const cancelButton = document.getElementById(`cancel-${id}`);
        const removeImageButton = document.getElementById(`remove-image-${id}`);
        const imageElement = document.getElementById(`image-${id}`);

        contentElement.style.display = 'none';
        editElement.style.display = 'block';
        saveButton.style.display = 'block';
        cancelButton.style.display = 'block';
        if (imageElement) {
            removeImageButton.style.display = 'block';
        }
    };

    window.saveEdit = function(id) {
        const contentElement = document.getElementById(`content-${id}`);
        const editElement = document.getElementById(`edit-content-${id}`);
        const saveButton = document.getElementById(`save-${id}`);
        const cancelButton = document.getElementById(`cancel-${id}`);
        const removeImageButton = document.getElementById(`remove-image-${id}`);
        const newContent = editElement.value;

        let imageUrl = '';
        const imageElement = document.getElementById(`image-${id}`);
        if (imageElement && !imageRemoved) {
            imageUrl = imageElement.src;
        }

        updatePost(id, newContent, imageUrl, imageRemoved);

        contentElement.innerText = newContent;
        contentElement.style.display = 'block';
        editElement.style.display = 'none';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        if (imageElement) {
            if (imageRemoved) {
                imageElement.style.display = 'none';
            } else {
                imageElement.style.display = 'block';
            }
            removeImageButton.style.display = 'none';
        }
        imageRemoved = false; // Reset the imageRemoved flag
    };

    window.cancelEdit = function(id) {
        const contentElement = document.getElementById(`content-${id}`);
        const editElement = document.getElementById(`edit-content-${id}`);
        const saveButton = document.getElementById(`save-${id}`);
        const cancelButton = document.getElementById(`cancel-${id}`);
        const removeImageButton = document.getElementById(`remove-image-${id}`);
        const imageElement = document.getElementById(`image-${id}`);

        contentElement.style.display = 'block';
        editElement.style.display = 'none';
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
        if (imageElement) {
            imageElement.style.display = 'block';
            removeImageButton.style.display = 'none';
        }
        imageRemoved = false; // Reset the imageRemoved flag
    };

    window.markImageForRemoval = function(id) {
        imageRemoved = true;
        const imageElement = document.getElementById(`image-${id}`);
        if (imageElement) {
            imageElement.style.display = 'none'; // Hide the image but don't remove it
        }
        const removeImageButton = document.getElementById(`remove-image-${id}`);
        removeImageButton.style.display = 'none';
    };

    window.deletePost = deletePost;


    // window.likePosts = function(id) {
    //     const posts = getPosts();
    //     const postIndex = posts.findIndex(post => post.id === id);
    //     if (postIndex !== -1) {
    //         posts[postIndex].likes += 1;
    //         savePosts(posts);
    //         const likeCountElement = document.getElementById(`like-count-${id}`);
    //         likeCountElement.textContent = posts[postIndex].likes;
    //         const likeIconElement = document.getElementById(`like-icon-${id}`);
    //         likeIconElement.classList.add('liked'); // Add a class to change the color
    //     }
    // };
     
    window.likePosts = function(id) {
        const posts = getPosts();
        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            // Ensure likes is a number
            if (typeof posts[postIndex].likes !== 'number') {
                posts[postIndex].likes = 0;
            }
    
            posts[postIndex].likes += 1;
            savePosts(posts);
    
            const likeCountElement = document.getElementById(`like-count-${id}`);
            if (likeCountElement) {
                likeCountElement.textContent = posts[postIndex].likes;
            }
    
            const likeIconElement = document.getElementById(`like-icon-${id}`);
            if (likeIconElement) {
                likeIconElement.classList.add('liked'); // Add a class to change the color
            }
        }
    };
    

    // Show comment box
    window.commentPosts = function(id) {
        const commentBox = document.getElementById(`comment-box-${id}`);
        if (commentBox.style.display === 'none') {
            commentBox.style.display = 'block';
        } else {
            commentBox.style.display = 'none';
        }
    };

    // Add comment functionality
    window.addComment = function(id) {
        const posts = getPosts();
        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            const commentBox = document.getElementById(`comment-box-${id}`);
            const commentText = commentBox.querySelector('textarea').value.trim();
            if (commentText) {
                posts[postIndex].comments.push(commentText);
                savePosts(posts);
                displayPosts();
            }
        }
    };
 
    displayPosts();

    // Show the popup when the hashtag button is clicked
    hashtagButton.addEventListener('click', () => {
        tagsPopup.style.display = 'block';
    });

    // Hide the popup and clear the input when the add tags button is clicked
    addTagsButton.addEventListener('click', () => {
        const tags = tagsInput.value.split(',').map(tag => tag.trim());
        if (tags.length > 0) {
            contentInput.value += ' ' + tags.map(tag => `#${tag}`).join(' ');
            charCount.textContent = `${contentInput.value.length}/280`;
        }
        tagsPopup.style.display = 'none';
        tagsInput.value = '';
    });

    // Close the popup when the close button is clicked
    closeTagsPopup.addEventListener('click', () => {
        tagsPopup.style.display = 'none';
    });

    // Close the popup when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === tagsPopup) {
            tagsPopup.style.display = 'none';
        }
    });

    // Filter posts based on search input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const posts = getPosts();
        const filteredPosts = posts.filter(post => 
            post.content.toLowerCase().includes(query) || 
            post.username.toLowerCase().includes(query) || 
            post.handle.toLowerCase().includes(query)
        );
        displayPosts(filteredPosts);
    });
});

//Delete Retweet & Share Icons 
document.addEventListener('DOMContentLoaded', () => {
    // Select and remove elements with class 'fas fa-retweet'
    document.querySelectorAll('.fas.fa-retweet').forEach(element => element.remove());

    // Select and remove elements with class 'fas fa-share'
    document.querySelectorAll('.fas.fa-share').forEach(element => element.remove());
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchSuggestions = document.getElementById('searchSuggestions');

    // Filter posts based on search input
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        updateSearchSuggestions(query);
    });

    function updateSearchSuggestions(query) {
        if (query.length > 0) {
            const suggestions = [`#${query}`, `#${query}News`, `#${query}Trend`]; // Example suggestions
            searchSuggestions.innerHTML = suggestions.map(suggestion => 
                `<a class="dropdown-item" href="#">${suggestion}</a>`
            ).join('');
            searchSuggestions.style.display = 'block';
        } else {
            searchSuggestions.style.display = 'none';
        }
    }

    // Hide the suggestions when clicking outside
    window.addEventListener('click', (event) => {
        if (!event.target.closest('.search-bar')) {
            searchSuggestions.style.display = 'none';
        }
    });

    // Add selected suggestion to search input
    searchSuggestions.addEventListener('click', (event) => {
        if (event.target.classList.contains('dropdown-item')) {
            searchInput.value = event.target.textContent;
            searchSuggestions.style.display = 'none';
            // Trigger search again with the selected suggestion
            searchInput.dispatchEvent(new Event('input'));
        }
    });
});

window.likePosts = function(id) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex !== 0) {
        posts[postIndex].likes += 1;
        localStorage.setItem('posts', JSON.stringify(posts));
        document.getElementById(`like-count-${id}`).textContent = posts[postIndex].likes;
        document.getElementById(`like-icon-${id}`).style.color = 'red'; // Change color to red when liked
    }
};



window.addComment = function(id) {
    const posts = getPosts();
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex !== -1) {
        const commentBox = document.getElementById(`comment-box-${id}`);
        const commentText = commentBox.querySelector('textarea').value.trim();
        if (commentText) {
            posts[postIndex].comments.push(commentText);
            savePosts(posts);
            displayPosts();
        }
    }
};

window.displayComments = function(id) {
    const posts = getPosts();
    const postIndex = posts.findIndex(post => post.id === id);
    if (postIndex!== -1) {
        const commentList = document.getElementById(`comment-list-${id}`);
        commentList.innerHTML = '';
        posts[postIndex].comments.forEach(comment => {
            commentList.insertAdjacentHTML('beforeend', `
                <li class="list-group-item">${comment}</li>
            `);
        });
    }
}