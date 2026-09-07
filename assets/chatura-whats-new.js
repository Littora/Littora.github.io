(function () {
  var stream = document.querySelector("[data-release-stream]");
  if (!stream) return;

  var sourceNodes = Array.prototype.slice.call(stream.children);
  var releaseHeadings = sourceNodes.filter(function (node) {
    return node.tagName === "H2";
  });

  if (!releaseHeadings.length) return;

  var latestLabel = stream.getAttribute("data-latest-label") || "Latest release";
  var archiveLabel = stream.getAttribute("data-archive-label") || "Earlier releases";
  var releases = releaseHeadings.map(function (heading, index) {
    var start = sourceNodes.indexOf(heading);
    var nextHeading = releaseHeadings[index + 1];
    var end = nextHeading ? sourceNodes.indexOf(nextHeading) : sourceNodes.length;
    return {
      heading: heading,
      nodes: sourceNodes.slice(start + 1, end)
    };
  });

  var idForHeading = function (heading, index) {
    var version = heading.textContent.match(/\d+(?:\.\d+)+/);
    return version ? "version-" + version[0].replace(/\./g, "-") : "release-" + (index + 1);
  };

  var splitHeading = function (heading) {
    var parts = heading.textContent.trim().split(/\s+[—–]\s+/);
    return {
      version: parts.shift() || heading.textContent.trim(),
      title: parts.join(" — ")
    };
  };

  var latestSection = document.createElement("section");
  latestSection.className = "release-latest";

  var latestArticle = document.createElement("article");
  latestArticle.className = "release-note release-note--latest";
  latestArticle.id = idForHeading(releases[0].heading, 0);

  var latestEyebrow = document.createElement("span");
  latestEyebrow.className = "release-note__eyebrow";
  latestEyebrow.textContent = latestLabel;

  releases[0].heading.id = latestArticle.id + "-title";
  latestSection.setAttribute("aria-labelledby", releases[0].heading.id);
  latestArticle.setAttribute("aria-labelledby", releases[0].heading.id);
  latestArticle.appendChild(latestEyebrow);
  latestArticle.appendChild(releases[0].heading);
  releases[0].nodes.forEach(function (node) {
    latestArticle.appendChild(node);
  });
  latestSection.appendChild(latestArticle);

  var archiveSection = document.createElement("section");
  archiveSection.className = "release-archive";
  archiveSection.setAttribute("aria-labelledby", "release-archive-title");

  var archiveHeading = document.createElement("h2");
  archiveHeading.id = "release-archive-title";
  archiveHeading.textContent = archiveLabel;

  var archiveList = document.createElement("div");
  archiveList.className = "release-archive__list";

  releases.slice(1).forEach(function (release, releaseIndex) {
    var absoluteIndex = releaseIndex + 1;
    var details = document.createElement("details");
    var releaseId = idForHeading(release.heading, absoluteIndex);
    var titleParts = splitHeading(release.heading);
    details.className = "release-note release-note--archive";
    details.id = releaseId;

    var summary = document.createElement("summary");
    var version = document.createElement("span");
    var title = document.createElement("strong");
    version.className = "release-note__version";
    title.className = "release-note__title";
    version.textContent = titleParts.version;
    title.textContent = titleParts.title || titleParts.version;
    summary.appendChild(version);
    summary.appendChild(title);

    var body = document.createElement("div");
    body.className = "release-note__body";
    release.heading.classList.add("visually-hidden");
    body.appendChild(release.heading);
    release.nodes.forEach(function (node) {
      body.appendChild(node);
    });

    details.appendChild(summary);
    details.appendChild(body);
    archiveList.appendChild(details);
  });

  archiveSection.appendChild(archiveHeading);
  archiveSection.appendChild(archiveList);
  stream.replaceChildren(latestSection, archiveSection);
  stream.classList.add("is-enhanced");

  var openHashTarget = function () {
    if (!window.location.hash) return;
    var target = document.querySelector(window.location.hash);
    if (target && target.tagName === "DETAILS") target.open = true;
  };

  openHashTarget();
  window.addEventListener("hashchange", openHashTarget);
})();
