// Check if user is logged in
if (!localStorage.getItem('loggedIn') &&  window.location.href !== 'indexlog.html') {
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
    let uploadedImage = '';
    let imageRemoved = false;

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
            username: 'Brie',
            handle: '@Skitch_ComedyFan',
            timestamp: now.toISOString(),
            content,
            image,
            profileImage: 'https://via.placeholder.com/50'
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

    function displayPosts() {
        const posts = getPosts();
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
                        <i class="far fa-comment"></i>
                        <i class="fas fa-retweet"></i>
                        <i class="far fa-heart"></i>
                        <i class="fas fa-share"></i>
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

    displayPosts();
});
