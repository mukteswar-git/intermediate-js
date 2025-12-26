// HTTP Methods

// 1. GET Request (Read Data)

async function getData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// 2. POST Request (Create Data)

async function createPost() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'My New Post',
        body: 'This is the content of my post',
        userId: 1
      })
    });

    const data = await response.json();
    console.log('Created:', data);
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

// 3. PUT Request (Update Data-Full Replace)

async function updatePost(postId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: postId,
        title: 'Updated Post Title',
        body: 'This is the updated content',
        userId: 1
      })
    });

    const data = await response.json();
    console.log('Updated:', data);
  } catch (error) {
    console.error('Error updating post:', error);
  }
}

// 4. PATCH Request (Update Data-Partial Update)

async function patchPost(postId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.come/post/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Only Update Title'
      })
    });

    const data = await response.json();
    console.log('Patched:', data);
  } catch (error) {
    console.error('Error patching post:', error);
  }
}

// DELETE Requests (Remove Data)

async function deletePost(postId) {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/post/${postId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log('Post deleted successfully')
    }
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}