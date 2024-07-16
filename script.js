document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postIdInput = document.getElementById('postId');
    const contentInput = document.getElementById('content');
    const imageUpload = document.getElementById('imageUpload');
    const imageButton = document.getElementById('imageButton');
    const imagePreview = document.getElementById('imagePreview');
    const postsContainer = document.getElementById('posts');
    let uploadedImage = '';

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

        if (!content && !uploadedImage) {
            return; // Prevent posting empty tweets
        }

        if (postId) {
            updatePost(postId, content, uploadedImage);
        } else {
            createPost(content, uploadedImage);
        }

        postForm.reset();
        postIdInput.value = '';
        imagePreview.innerHTML = '';
        uploadedImage = '';
        displayPosts();
    });

    function createPost(content, image) {
        const posts = getPosts();
        const newPost = {
            id: Date.now().toString(),
            username: 'Brie',
            handle: '@Skitch_ComedyFan',
            timestamp: 'Just now',
            content,
            image,
            profileImage: 'https://via.placeholder.com/50'
        };
        posts.push(newPost);
        savePosts(posts);
    }

    function updatePost(id, content, image) {
        const posts = getPosts();
        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            posts[postIndex].content = content;
            posts[postIndex].image = image;
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
        postsContainer.innerHTML = posts.map(post => `
            <div class="post" id="post-${post.id}">
                <img src="${post.profileImage}" alt="Profile Image">
                <div class="post-content">
                    <div class="post-header">
                        <div>
                            <span class="username">${post.username}</span>
                            <span class="handle">${post.handle}</span>
                            <span class="timestamp">${post.timestamp}</span>
                        </div>
                        <div class="actions">
                            <button class="edit btn btn-info btn-sm" onclick="editPost('${post.id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deletePost('${post.id}')">Delete</button>
                        </div>
                    </div>
                    <div class="post-body">
                        <p id="content-${post.id}">${post.content}</p>
                        ${post.image ? `<img src="${post.image}" alt="Tweet Image" class="img-fluid">` : ''}
                        <textarea class="form-control edit-textarea" id="edit-content-${post.id}" rows="3" style="display:none;">${post.content}</textarea>
                        <button class="btn btn-primary mt-2" id="save-${post.id}" style="display:none;" onclick="saveEdit('${post.id}')">Save</button>
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

    window.editPost = function(id) {
        const contentElement = document.getElementById(`content-${id}`);
        const editElement = document.getElementById(`edit-content-${id}`);
        const saveButton = document.getElementById(`save-${id}`);
        
        contentElement.style.display = 'none';
        editElement.style.display = 'block';
        saveButton.style.display = 'block';
    };

    window.saveEdit = function(id) {
        const contentElement = document.getElementById(`content-${id}`);
        const editElement = document.getElementById(`edit-content-${id}`);
        const saveButton = document.getElementById(`save-${id}`);
        const newContent = editElement.value;

        updatePost(id, newContent);

        contentElement.innerText = newContent;
        contentElement.style.display = 'block';
        editElement.style.display = 'none';
        saveButton.style.display = 'none';
    };

    window.deletePost = deletePost;

    displayPosts();
});




