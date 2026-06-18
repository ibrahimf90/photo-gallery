(function () {
  "use strict";

  const FLOW_IMAGES = [
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Mountains%20in%20Skaftafell%20National%20Park%2C%20Hornafj%C3%B6r%C3%B0ur%20municipality%2C%20Iceland%2C%2020240719%201756%202806.jpg?width=1200",
      alt: "Mountains in Skaftafell National Park, Iceland",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Mountains%20of%20Tr%C3%B6llaskagi%20in%20Northern%20Iceland%2C%20from%20the%20Stephan%20G.%20Stephansson%20monument%2C%2020240715%201359%200872.jpg?width=1200",
      alt: "Mountains of Trollaskagi, Northern Iceland",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Nogueira%20valley%20view%20from%20Balc%C3%B5es%2C%20S%C3%A3o%20Roque%20do%20Faial%2C%20Santana%2C%20Madeira%2C%202023%20May.jpg?width=1200",
      alt: "Nogueira valley, Madeira",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/N%C3%A1mafjall%20Mountain%2C%20Iceland%2C%2020240716%201055%201254.jpg?width=1200",
      alt: "Namafjall Mountain, Iceland",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Nor%C3%B0ur%C3%A1%20river%2C%20Iceland%2C%2020240715%200806%200735.jpg?width=1200",
      alt: "Nordura river, Iceland",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Akka%20massif%20seen%20along%20the%20Padjelantaleden%20in%20Stora%20Sj%C3%B6fallet%20National%20Park%20%28DSCF0983%29.jpg?width=1200",
      alt: "Akka massif, Stora Sjofallet National Park, Sweden",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Abudelauri%20valley%20under%20clouds%2C%20early%20summer%2C%20Georgia.jpg?width=1200",
      alt: "Abudelauri valley, Georgia",
    },
  ];

  const LEBANON_PLACES = [
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Baalbek_Lebanon.JPG?width=1000",
      location: "Baalbek - Temple of Jupiter",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/The_harbor_in_the_old_city_of_Byblos%2C_Lebanon.jpg?width=1000",
      location: "Byblos - The Harbor",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Byblos_Castle_2009.jpg?width=1000",
      location: "Byblos - Crusader Castle",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Beirut_Corniche%2C_Beirut%2C_Lebanon.jpg?width=1000",
      location: "Beirut - The Corniche",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Outside_Jeita.jpg?width=1000",
      location: "Jeita Grotto",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bisharri%2C_cedros_%282001%29_01.jpg?width=1000",
      location: "The Cedars of God",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Our_Lady_of_Lebanon_-_Harissa.JPG?width=1000",
      location: "Harissa",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Tripoli%2C_Lebanon_photos%2C_Aug_2012.jpg?width=1000",
      location: "Tripoli - Old City",
    },
  ];

  const LANDMARKS = [
    ...LEBANON_PLACES.map((place) => ({
      src: place.src.replace("width=1000", "width=900"),
      name: place.location.replace(" - The ", " ").replace(" - ", " "),
    })),
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lebanon-TyreSour-RuinsAtHarbour_RomanDeckert23122019.jpg?width=900",
      name: "Ancient Tyre",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Qadisha_Valley%2C_Aerial_View_From_Qannoubine_Monastery.jpg?width=900",
      name: "Qadisha Valley",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lebanon_banner_Beiteddine_Palace.jpg?width=900",
      name: "Beiteddine Palace",
    },
    {
      src: "https://commons.wikimedia.org/wiki/Special:FilePath/Jounieh_Wikivoyage_banner.jpg?width=900",
      name: "Jounieh Bay",
    },
  ];

  initFlowGallery();
  initTiltedCarousel();
  initCircularGallery();

  function initFlowGallery() {
    const root = document.querySelector('[data-gallery="flow"]');
    const track = root.querySelector("[data-flow-track]");
    const thumbs = document.querySelector("[data-flow-thumbs]");
    const prev = root.querySelector(".flow-prev");
    const next = root.querySelector(".flow-next");
    const maxVisibleOffset = 3;
    let activeIndex = 0;
    let autoplayTimer = null;

    const slides = FLOW_IMAGES.map((image, index) => {
      const slide = document.createElement("div");
      slide.className = "flow-slide";
      slide.innerHTML = `<img src="${image.src}" alt="${image.alt}" loading="${index === 0 ? "eager" : "lazy"}" draggable="false">`;
      slide.addEventListener("click", () => goTo(index));
      track.appendChild(slide);
      return slide;
    });

    const thumbButtons = FLOW_IMAGES.map((image, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "flow-thumb";
      button.setAttribute("aria-label", `Image ${index + 1}`);
      button.innerHTML = `<img src="${image.src}" alt="" loading="lazy" draggable="false">`;
      button.addEventListener("click", () => goTo(index));
      thumbs.appendChild(button);
      return button;
    });

    function circularOffset(index, active, total) {
      let raw = index - active;
      if (raw > total / 2) raw -= total;
      if (raw < -total / 2) raw += total;
      return raw;
    }

    function render() {
      const total = FLOW_IMAGES.length;
      slides.forEach((slide, index) => {
        const offset = circularOffset(index, activeIndex, total);
        const abs = Math.abs(offset);
        slide.style.setProperty("--offset", offset);
        slide.style.setProperty("--abs", Math.min(abs, maxVisibleOffset));
        slide.dataset.active = index === activeIndex ? "true" : "false";
        slide.dataset.hidden = abs > maxVisibleOffset ? "true" : "false";
      });

      thumbButtons.forEach((button, index) => {
        button.dataset.active = index === activeIndex ? "true" : "false";
      });
    }

    function goTo(index) {
      activeIndex = wrap(index, FLOW_IMAGES.length);
      render();
      restartAutoplay();
    }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(activeIndex + 1), 4200);
    }

    prev.addEventListener("click", () => goTo(activeIndex - 1));
    next.addEventListener("click", () => goTo(activeIndex + 1));
    addSwipe(track, () => goTo(activeIndex + 1), () => goTo(activeIndex - 1));
    root.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
    root.addEventListener("mouseleave", restartAutoplay);

    render();
    restartAutoplay();
  }

  function initTiltedCarousel() {
    const root = document.querySelector('[data-gallery="tilted"]');
    const row = root.querySelector("[data-tilted-row]");
    const dots = root.querySelector("[data-tilted-dots]");
    const caption = root.querySelector("[data-tilted-caption]");
    const prev = root.querySelector(".tilted-prev");
    const next = root.querySelector(".tilted-next");
    const maxVisibleOffset = 3;
    let activeIndex = 0;

    const cards = LEBANON_PLACES.map((place, index) => {
      const card = document.createElement("div");
      card.className = "tilted-card";
      card.innerHTML = `<img src="${place.src}" alt="${place.location}" loading="${index === 0 ? "eager" : "lazy"}" draggable="false">`;
      card.addEventListener("click", () => goTo(index));
      row.appendChild(card);
      return card;
    });

    const dotButtons = LEBANON_PLACES.map((place, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "tilted-dot";
      dot.setAttribute("aria-label", place.location);
      dot.addEventListener("click", () => goTo(index));
      dots.appendChild(dot);
      return dot;
    });

    function render() {
      cards.forEach((card, index) => {
        const offset = index - activeIndex;
        const abs = Math.abs(offset);
        card.style.setProperty("--offset", offset);
        card.style.setProperty("--abs", Math.min(abs, maxVisibleOffset));
        card.dataset.active = index === activeIndex ? "true" : "false";
        card.dataset.hidden = abs > maxVisibleOffset ? "true" : "false";
      });

      dotButtons.forEach((dot, index) => {
        dot.dataset.active = index === activeIndex ? "true" : "false";
      });

      caption.textContent = LEBANON_PLACES[activeIndex].location;
      prev.disabled = activeIndex === 0;
      next.disabled = activeIndex === LEBANON_PLACES.length - 1;
    }

    function goTo(index) {
      activeIndex = clamp(index, 0, LEBANON_PLACES.length - 1);
      render();
    }

    prev.addEventListener("click", () => goTo(activeIndex - 1));
    next.addEventListener("click", () => goTo(activeIndex + 1));
    addSwipe(row, () => goTo(activeIndex + 1), () => goTo(activeIndex - 1));
    render();
  }

  function initCircularGallery() {
    const root = document.querySelector('[data-gallery="circular"]');
    const ring = root.querySelector("[data-ring]");
    const lensA = root.querySelector("[data-lens-a]");
    const lensB = root.querySelector("[data-lens-b]");
    const tag = root.querySelector("[data-wheel-tag]");
    const prev = root.querySelector(".wheel-prev");
    const next = root.querySelector(".wheel-next");
    const total = LANDMARKS.length;
    let activeIndex = 0;
    let spinDeg = 0;
    let autoTimer = null;
    let lensSlot = 0;
    const lensImages = [lensA, lensB];

    const petals = LANDMARKS.map((landmark, index) => {
      const petal = document.createElement("div");
      petal.className = "petal";
      petal.tabIndex = 0;
      petal.setAttribute("role", "button");
      petal.setAttribute("aria-label", landmark.name);
      petal.style.setProperty("--i", index);
      petal.style.setProperty("--count", total);

      const face = document.createElement("div");
      face.className = "petal__face";

      const image = document.createElement("img");
      image.src = landmark.src;
      image.alt = landmark.name;
      image.loading = index === 0 ? "eager" : "lazy";
      image.draggable = false;

      face.appendChild(image);
      petal.appendChild(face);
      ring.appendChild(petal);

      petal.addEventListener("click", () => goTo(index));
      petal.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goTo(index);
        }
      });

      return petal;
    });

    function updateLens(index) {
      const nextSlot = 1 - lensSlot;
      const incoming = lensImages[nextSlot];
      const outgoing = lensImages[lensSlot];

      incoming.src = LANDMARKS[index].src;
      incoming.alt = LANDMARKS[index].name;

      requestAnimationFrame(() => {
        incoming.dataset.shown = "true";
        outgoing.dataset.shown = "false";
        lensSlot = nextSlot;
      });
    }

    function circularDelta(from, to, length) {
      let raw = to - from;
      if (raw > length / 2) raw -= length;
      if (raw < -length / 2) raw += length;
      return raw;
    }

    function render(newIndex) {
      const delta = circularDelta(activeIndex, newIndex, total);
      activeIndex = wrap(newIndex, total);
      spinDeg -= delta * (360 / total);
      ring.style.setProperty("--spin", `${spinDeg}deg`);

      petals.forEach((petal, index) => {
        petal.dataset.active = index === activeIndex ? "true" : "false";
      });

      tag.textContent = LANDMARKS[activeIndex].name;
      updateLens(activeIndex);
    }

    function goTo(index) {
      render(index);
      restartAutoplay();
    }

    function restartAutoplay() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(activeIndex + 1), 3800);
    }

    prev.addEventListener("click", () => goTo(activeIndex - 1));
    next.addEventListener("click", () => goTo(activeIndex + 1));
    addSwipe(ring, () => goTo(activeIndex + 1), () => goTo(activeIndex - 1));
    root.addEventListener("mouseenter", () => clearInterval(autoTimer));
    root.addEventListener("mouseleave", restartAutoplay);

    lensA.src = LANDMARKS[0].src;
    lensA.alt = LANDMARKS[0].name;
    lensA.dataset.shown = "true";
    lensB.dataset.shown = "false";
    tag.textContent = LANDMARKS[0].name;
    petals[0].dataset.active = "true";
    restartAutoplay();
  }

  function addSwipe(element, onLeft, onRight) {
    let touchStartX = null;

    element.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.touches[0].clientX;
      },
      { passive: true },
    );

    element.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) onLeft();
        else onRight();
      }
      touchStartX = null;
    });
  }

  function wrap(index, length) {
    return ((index % length) + length) % length;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
})();
