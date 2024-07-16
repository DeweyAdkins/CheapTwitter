document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const postIdInput = document.getElementById('postId');
    const contentInput = document.getElementById('content');
    const postsContainer = document.getElementById('posts');

    postForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const postId = postIdInput.value;
        const content = contentInput.value;

        if (postId) {
            updatePost(postId, content);
        } else {
            createPost(content);
        }

        postForm.reset();
        postIdInput.value = '';
        displayPosts();
    });

    function createPost(content) {
        const posts = getPosts();
        const newPost = {
            id: Date.now().toString(),
            username: 'Brie',
            handle: '@Skitch_ComedyFan',
            timestamp: '3m',
            content,
            profileImage: 'https://via.placeholder.com/50'
        };
        posts.push(newPost);
        savePosts(posts);
    }

    function updatePost(id, content) {
        const posts = getPosts();
        const postIndex = posts.findIndex(post => post.id === id);
        if (postIndex !== -1) {
            posts[postIndex].content = content;
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
            <div class="post">
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
                        <p>${post.content}</p>
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
        const posts = getPosts();
        const post = posts.find(post => post.id === id);
        if (post) {
            postIdInput.value = post.id;
            contentInput.value = post.content;
        }
    };

    window.deletePost = deletePost;

    displayPosts();
});



