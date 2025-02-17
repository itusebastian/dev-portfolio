(function ($) {
  "use strict";

  function portfolio_init() {
    var portfolio_grid = $(".portfolio-grid"),
      portfolio_filter = $(".portfolio-filters");
    if (portfolio_grid) {
      portfolio_grid.shuffle({
        speed: 450,
        itemSelector: "figure",
      });
      portfolio_filter.on("click", ".filter", function (e) {
        portfolio_grid.shuffle("update");
        e.preventDefault();
        $(".portfolio-filters .filter").parent().removeClass("active");
        $(this).parent().addClass("active");
        portfolio_grid.shuffle("shuffle", $(this).attr("data-group"));
      });
    }
  }

  function mobileMenuHide() {
    var windowWidth = $(window).width(),
      siteHeader = $("#site_header");
    if (windowWidth < 1025) {
      siteHeader.addClass("mobile-menu-hide");
      $(".menu-toggle").removeClass("open");
      setTimeout(function () {
        siteHeader.addClass("animate");
      }, 500);
    } else {
      siteHeader.removeClass("animate");
    }
  }

  function customScroll() {
    var windowWidth = $(window).width();
    if (windowWidth > 1024) {
      $(".animated-section, .single-page-content").each(function () {
        $(this).perfectScrollbar();
      });
    } else {
      $(".animated-section, .single-page-content").each(function () {
        $(this).perfectScrollbar("destroy");
      });
    }
  }
  $(function () {
    $("#contact_form").validator();
    $("#contact_form").on("submit", function (e) {
      if (!e.isDefaultPrevented()) {
        var url = "contact_form/contact_form.php";
        $.ajax({
          type: "POST",
          url: url,
          data: $(this).serialize(),
          success: function (data) {
            var messageAlert = "alert-" + data.type;
            var messageText = data.message;
            var alertBox =
              '<div class="alert ' +
              messageAlert +
              ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' +
              messageText +
              "</div>";
            if (messageAlert && messageText) {
              $("#contact_form").find(".messages").html(alertBox);
              $("#contact_form")[0].reset();
            }
          },
        });
        return false;
      }
    });
  });
  $(window)
    .on("load", function () {
      $(".preloader").fadeOut(800, "linear");
      var ptPage = $(".animated-sections");
      if (ptPage[0]) {
        PageTransitions.init({
          menu: "ul.main-menu",
        });
      }
    })
    .on("resize", function () {
      mobileMenuHide();
      $(".animated-section").each(function () {
        $(this).perfectScrollbar("update");
      });
      customScroll();
    });
  $(document).on("ready", function () {
    var movementStrength = 23;
    var height = movementStrength / $(document).height();
    var width = movementStrength / $(document).width();
    $("body").on("mousemove", function (e) {
      var pageX = e.pageX - $(document).width() / 2,
        pageY = e.pageY - $(document).height() / 2,
        newvalueX = width * pageX * -1,
        newvalueY = height * pageY * -1,
        elements = $(".lm-animated-bg");
      elements.addClass("transition");
      elements.css({
        "background-position":
          "calc( 50% + " + newvalueX + "px ) calc( 50% + " + newvalueY + "px )",
      });
      setTimeout(function () {
        elements.removeClass("transition");
      }, 300);
    });
    $(".menu-toggle").on("click", function () {
      $("#site_header").addClass("animate");
      $("#site_header").toggleClass("mobile-menu-hide");
      $(".menu-toggle").toggleClass("open");
    });
    $(".main-menu").on("click", "a", function (e) {
      mobileMenuHide();
    });
    $(".sidebar-toggle").on("click", function () {
      $("#blog-sidebar").toggleClass("open");
    });
    var $portfolio_container = $(".portfolio-grid");
    $portfolio_container.imagesLoaded(function () {
      portfolio_init(this);
    });
    var $container = $(".blog-masonry");
    $container.imagesLoaded(function () {
      $container.masonry();
    });
    customScroll();
    $(".text-rotation").owlCarousel({
      loop: true,
      dots: false,
      nav: false,
      margin: 0,
      items: 1,
      autoplay: true,
      autoplayHoverPause: false,
      autoplayTimeout: 3800,
      animateOut: "animated-section-scaleDown",
      animateIn: "animated-section-scaleUp",
    });
    $(".testimonials.owl-carousel").imagesLoaded(function () {
      $(".testimonials.owl-carousel").owlCarousel({
        nav: true,
        items: 3,
        loop: false,
        navText: false,
        autoHeight: true,
        margin: 25,
        responsive: {
          0: {
            items: 1,
          },
          480: {
            items: 1,
          },
          768: {
            items: 2,
          },
          1200: {
            items: 2,
          },
        },
      });
    });
    $(".clients.owl-carousel")
      .imagesLoaded()
      .owlCarousel({
        nav: true,
        items: 2,
        loop: false,
        navText: false,
        margin: 10,
        autoHeight: true,
        responsive: {
          0: {
            items: 2,
          },
          768: {
            items: 4,
          },
          1200: {
            items: 5,
          },
        },
      });
    $(".form-control")
      .val("")
      .on("focusin", function () {
        $(this).parent(".form-group").addClass("form-group-focus");
      })
      .on("focusout", function () {
        if ($(this).val().length === 0) {
          $(this).parent(".form-group").removeClass("form-group-focus");
        }
      });
    $("body").magnificPopup({
      delegate: "a.lightbox",
      type: "image",
      removalDelay: 300,
      mainClass: "mfp-fade",
      image: {
        titleSrc: "title",
        gallery: {
          enabled: true,
        },
      },
      iframe: {
        markup:
          '<div class="mfp-iframe-scaler">' +
          '<div class="mfp-close"></div>' +
          '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
          '<div class="mfp-title mfp-bottom-iframe-title"></div>' +
          "</div>",
        patterns: {
          youtube: {
            index: "youtube.com/",
            id: null,
            src: "%id%?autoplay=1",
          },
          vimeo: {
            index: "vimeo.com/",
            id: "/",
            src: "//player.vimeo.com/video/%id%?autoplay=1",
          },
          gmaps: {
            index: "//maps.google.",
            src: "%id%&output=embed",
          },
        },
        srcAction: "iframe_src",
      },
      callbacks: {
        markupParse: function (template, values, item) {
          values.title = item.el.attr("title");
        },
      },
    });
  });
})(jQuery);

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const katakana =
  "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴン";
const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const nums = "0123456789";

const alphabet = katakana + latin + nums;

const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = alphabet[Math.floor(Math.random() * alphabet.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(draw, 33);

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

document.addEventListener("DOMContentLoaded", function () {
  const typedText = document.getElementById("typed-text");
  const textArray = ["Desarrollador", "Autor"];
  const typingSpeed = 100;
  const erasingSpeed = 50;
  const delayBetweenTexts = 2000;

  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedText.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, delayBetweenTexts);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedText.textContent = textArray[textArrayIndex].substring(
        0,
        charIndex - 1
      );
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, typingSpeed);
    }
  }

  setTimeout(type, delayBetweenTexts);
});

function togglePageContent() {
  var elementsToToggle = [
    '.header-content',
    '.social-links',
    '.header-buttons',
    '.copyrights',
    '.content-area',
    '.lmpixels-arrows-nav'
  ];

  elementsToToggle.forEach(function(selector) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function(element) {
      // Verificar si el elemento está visible o no
      if (element.style.opacity === '0') {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
      } else {
        element.style.opacity = '0';
        element.style.visibility = 'hidden';
      }
    });
  });

  var pageContent = document.querySelector('.page-content');
  if (pageContent) {
    if (pageContent.style.backgroundColor) {
      pageContent.style.backgroundColor = '';
    } else {
      pageContent.style.backgroundColor = 'transparent';
    }
  }

  var mainMenu = document.querySelector('.main-menu');
  if (mainMenu) {
    if (mainMenu.dataset.state === 'default') {
      mainMenu.innerHTML = `
        <li>
          <a href="https://dev.itusebastian.com/" class="nav-anim">
            <span class="menu-icon lnr lnr-power-switch"></span>
            <span class="link-text">Apagar</span>
          </a>
        </li>
        <li>
          <a href="#feature1" class="nav-anim">
            <span class="menu-icon lnr lnr-star"></span>
            <span class="link-text">Demo 1</span>
          </a>
        </li>
        <li>
          <a href="#feature2" class="nav-anim">
            <span class="menu-icon lnr lnr-cog"></span>
            <span class="link-text">Demo 2</span>
          </a>
        </li>
        <li>
          <a href="#feature3" class="nav-anim">
            <span class="menu-icon lnr lnr-bulb"></span>
            <span class="link-text">Demo 3</span>
          </a>
        </li>
      `;
      mainMenu.dataset.state = 'alt';
    } else {
      mainMenu.innerHTML = `
        <li class="active">
          <a href="#home" class="nav-anim active">
            <span class="menu-icon lnr lnr-home"></span>
            <span class="link-text">Inicio</span>
          </a>
        </li>
        <li>
          <a href="#about-me" class="nav-anim">
            <span class="menu-icon lnr lnr-rocket"></span>
            <span class="link-text">Viaje</span>
          </a>
        </li>
        <li>
          <a href="#resume" class="nav-anim">
            <span class="menu-icon lnr lnr-user"></span>
            <span class="link-text">Perfil</span>
          </a>
        </li>
        <li>
          <a href="#blog" class="nav-anim">
            <span class="menu-icon lnr lnr-sync"></span>
            <span class="link-text">Proceso</span>
          </a>
        </li>
        <li>
          <a href="#contact" class="nav-anim">
            <span class="menu-icon lnr lnr-envelope"></span>
            <span class="link-text">Contacto</span>
          </a>
        </li>
        <li>
          <a href="javascript:void(0);" class="nav-anim" onclick="togglePageContent()">
            <span class="menu-icon lnr lnr-power-switch"></span>
            <span class="link-text">Encender</span>
          </a>
        </li>
      `;
      mainMenu.dataset.state = 'default';
    }
  }
}

// Agregar las transiciones a los elementos
document.querySelectorAll('.header-content, .social-links, .header-buttons, .copyrights, .content-area').forEach(function(element) {
  element.style.transition = 'opacity 0.5s ease, visibility 0s 0.5s'; // Transición suave
});
