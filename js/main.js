(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.classList.toggle("is-active", isOpen);
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Highlight active nav link based on current page */
  var currentPage = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a[data-page]").forEach(function (link) {
    if (link.getAttribute("data-page") === currentPage) {
      link.classList.add("active");
    }
  });

  /* Scroll reveal animations (progressive enhancement: only opt in once JS is running) */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    document.documentElement.classList.add("js-ready");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Back to top button */
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var question = item.querySelector(".faq-question");
    if (!question) return;
    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(function (openItem) {
        if (openItem !== item) openItem.classList.remove("open");
      });
      item.classList.toggle("open", !isOpen);
    });
  });

  /* Contact form validation (client-side only, no backend configured) */
  var form = document.getElementById("contact-form");
  if (form) {
    var successPanel = document.getElementById("form-success");

    var validators = {
      name: function (v) {
        return v.trim().length >= 2 ? "" : "Please enter your full name.";
      },
      email: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
          ? ""
          : "Please enter a valid email address.";
      },
      organization: function () {
        return "";
      },
      message: function (v) {
        return v.trim().length >= 10 ? "" : "Tell us a bit more (10+ characters).";
      }
    };

    function setFieldState(field, errorMessage) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      var errorEl = wrapper.querySelector(".error");
      if (errorMessage) {
        wrapper.classList.add("invalid");
        if (errorEl) errorEl.textContent = errorMessage;
      } else {
        wrapper.classList.remove("invalid");
      }
    }

    form.querySelectorAll("[data-validate]").forEach(function (field) {
      field.addEventListener("blur", function () {
        var key = field.getAttribute("data-validate");
        var validate = validators[key];
        if (validate) setFieldState(field, validate(field.value));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll("[data-validate]").forEach(function (field) {
        var key = field.getAttribute("data-validate");
        var validate = validators[key];
        if (validate) {
          var error = validate(field.value);
          setFieldState(field, error);
          if (error) valid = false;
        }
      });

      if (!valid) {
        var firstInvalid = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      form.style.display = "none";
      if (successPanel) successPanel.classList.add("show");
    });
  }

  /* Set current year in footer */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
