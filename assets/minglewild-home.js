(() => {
  'use strict';

  // Both previews use the same accessible keyboard behavior for their tabs.
  function bindTabs(buttons, onSelect) {
    const tabs = Array.from(buttons);
    function select(tab) {
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      onSelect(tab);
    }
    tabs.forEach((tab, index) => {
      tab.disabled = false;
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        tabs[next].focus();
        select(tabs[next]);
      });
    });
    return select;
  }

  const feed = document.querySelector('[data-mw-feed]');
  if (feed) {
    const follows = Array.from(document.querySelectorAll('[data-mw-follow]'));
    const followed = new Set(follows.filter((button) => button.getAttribute('aria-pressed') === 'true').map((button) => button.dataset.mwFollow));
    const posts = Array.from(feed.querySelectorAll('[data-mw-post]'));
    const panel = feed.querySelector('[role="tabpanel"]');
    const status = document.querySelector('[data-mw-feed-status]');
    let mode = 'all';

    function renderFeed() {
      follows.forEach((button) => {
        const active = followed.has(button.dataset.mwFollow);
        button.setAttribute('aria-pressed', String(active));
        button.setAttribute('aria-label', `${active ? 'Unfollow' : 'Follow'} ${button.dataset.mwName} in this preview`);
        button.textContent = active ? 'Following' : 'Follow';
      });
      posts.forEach((post) => {
        post.hidden = mode === 'following' && !followed.has(post.dataset.mwPost);
      });
      feed.querySelector('.mw-feed__hint').textContent = mode === 'following'
        ? 'Just the voices you follow. Find more in For You.'
        : 'Try a follow. Then switch to Following.';
      const count = posts.filter((post) => !post.hidden).length;
      feed.querySelector('.mw-feed__empty').hidden = count !== 0;
      status.textContent = `${mode === 'following' ? 'Following' : 'For You'}: ${count} sample ${count === 1 ? 'post' : 'posts'}.`;
      const focusedPost = document.activeElement.closest('[data-mw-post]');
      if (focusedPost && focusedPost.hidden) feed.querySelector('[aria-selected="true"]').focus();
    }

    const selectFeed = bindTabs(feed.querySelectorAll('[data-mw-feed-tab]'), (tab) => {
      mode = tab.dataset.mwFeedTab;
      panel.setAttribute('aria-labelledby', tab.id);
      panel.scrollTop = 0;
      renderFeed();
    });
    follows.forEach((button) => {
      button.disabled = false;
      button.addEventListener('click', () => {
        const id = button.dataset.mwFollow;
        if (followed.has(id)) followed.delete(id);
        else followed.add(id);
        renderFeed();
        status.textContent = `${followed.has(id) ? 'Following' : 'Unfollowed'} ${button.dataset.mwName} in this preview.`;
      });
    });
    feed.querySelector('[data-mw-show-all]').addEventListener('click', () => {
      const tab = feed.querySelector('[data-mw-feed-tab="all"]');
      selectFeed(tab);
      tab.focus();
    });
    feed.querySelectorAll('[data-mw-like]').forEach((button) => {
      button.disabled = false;
      button.addEventListener('click', () => {
        const liked = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(liked));
        button.querySelector('span').textContent = liked ? 'Liked' : 'Like';
      });
    });
    feed.querySelectorAll('[data-mw-reply]').forEach((button) => {
      button.disabled = false;
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(expanded));
        document.getElementById(button.getAttribute('aria-controls')).hidden = !expanded;
        button.querySelector('span').textContent = expanded ? 'Hide reply' : 'Reply';
      });
    });
    renderFeed();
  }

  bindTabs(document.querySelectorAll('[data-mw-tour-tab]'), (tab) => {
    document.querySelectorAll('[data-mw-tour-panel]').forEach((panel) => {
      panel.hidden = panel.dataset.mwTourPanel !== tab.dataset.mwTourTab;
    });
  });

  const dialog = document.getElementById('minglewild-download-dialog');
  if (!dialog) return;
  let trigger;
  let previousOverflow;
  document.querySelectorAll('[data-minglewild-download]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (typeof dialog.showModal !== 'function') {
        window.alert(document.getElementById('mw-download-body').textContent);
        return;
      }
      if (dialog.open) return;
      trigger = link;
      previousOverflow = document.documentElement.style.overflow;
      dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    });
  });
  dialog.querySelectorAll('[data-minglewild-close]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow || '';
    if (trigger) trigger.focus({ preventScroll: true });
  });
})();
