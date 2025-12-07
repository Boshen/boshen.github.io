class BlogApp {
  constructor() {
    this.posts = [];
    this.currentView = 'list';
    this.init();
  }

  async init() {
    await this.loadPosts();
    this.setupRouting();
    this.renderInitialView();
  }

  async loadPosts() {
    try {
      const response = await fetch('posts.json');
      const data = await response.json();
      this.posts = data.posts;
    } catch (error) {
      console.error('Error loading posts:', error);
      this.posts = [];
    }
  }

  setupRouting() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      if (hash.startsWith('#post/')) {
        const slug = hash.slice(6);
        this.showPost(slug);
      } else {
        this.showPostList();
      }
    });
  }

  renderInitialView() {
    const hash = window.location.hash;
    if (hash.startsWith('#post/')) {
      const slug = hash.slice(6);
      this.showPost(slug);
    } else {
      this.showPostList();
    }
  }

  showPostList() {
    const container = document.getElementById('app');
    container.innerHTML = `
      <h1>Blog</h1>
      <p align="center">
        <a href="https://github.com/sponsors/Boshen">
          <img src="https://cdn.jsdelivr.net/gh/boshen/sponsors/sponsors.svg" alt="My sponsors" />
        </a>
      </p>
      <div id="post-list"></div>
    `;

    const listContainer = document.getElementById('post-list');

    if (this.posts.length === 0) {
      listContainer.innerHTML = '<p>No posts available yet.</p>';
      return;
    }

    listContainer.innerHTML = this.posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(post => `
        <div class="post-item" onclick="app.navigateToPost('${post.slug}')">
          <h2>${post.title}</h2>
          <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
          <p>${post.description}</p>
        </div>
      `)
      .join('');

    this.currentView = 'list';
  }

  navigateToPost(slug) {
    window.location.hash = `#post/${slug}`;
  }

  async showPost(slug) {
    const post = this.posts.find(p => p.slug === slug);
    if (!post) {
      this.showPostList();
      return;
    }

    const container = document.getElementById('app');
    container.innerHTML = `
      <div class="back-button" onclick="app.goBack()">← Back to Posts</div>
      <h1>${post.title}</h1>
      <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
      <div id="post-content" class="post-content">Loading...</div>
      <p align="center">
        <a href="https://github.com/sponsors/Boshen">
          <img src="https://cdn.jsdelivr.net/gh/boshen/sponsors/sponsors.svg" alt="My sponsors" />
        </a>
      </p>
    `;

    try {
      const response = await fetch(post.file);
      const markdown = await response.text();
      const html = marked.parse(markdown);
      document.getElementById('post-content').innerHTML = html;
    } catch (error) {
      console.error('Error loading post:', error);
      document.getElementById('post-content').innerHTML =
        '<p>Error loading post content.</p>';
    }

    this.currentView = 'detail';
  }

  goBack() {
    window.location.hash = '';
  }
}

const app = new BlogApp();
