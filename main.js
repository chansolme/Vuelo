(function () {
  "use strict";

  var WA = "56954177638";
  var cart = [];
  var customer = { name: "", commune: "", phone: "", notes: "" };

  /* --- Utils --- */
  function fmt(n) {
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }
  function $(id) { return document.getElementById(id); }

  function bagsOpts(selected) {
    var opts = "";
    for (var i = 1; i <= 10; i++) {
      opts += '<option value="' + i + '"' + (i === selected ? ' selected' : '') + '>' + i + (i === 1 ? ' bolsa' : ' bolsas') + '</option>';
    }
    return opts;
  }

  /* --- Storage --- */
  function load() {
    try {
      var c = localStorage.getItem("vuelo-cart");
      var cu = localStorage.getItem("vuelo-customer");
      if (c) {
        var parsed = JSON.parse(c);
        cart = parsed.filter(function(i) { return i.price250 && i.bags; });
      }
      if (cu) customer = Object.assign({ name: "", commune: "", phone: "", notes: "" }, JSON.parse(cu));
    } catch (e) {}
  }
  function save() {
    localStorage.setItem("vuelo-cart", JSON.stringify(cart));
    localStorage.setItem("vuelo-customer", JSON.stringify(customer));
  }

  /* --- Cart ops (immutable) --- */
  function addItem(item) { cart = cart.concat([item]); save(); render(); openCart(); }
  function removeItem(id) { cart = cart.filter(function(i) { return i.id !== id; }); save(); render(); }

  function updateFormat(id, grams) {
    cart = cart.map(function(i) {
      if (i.id !== id) return i;
      var price = grams === 250 ? i.price250 : i.price1000;
      return Object.assign({}, i, { grams: grams, price: price, subtotal: price * i.bags });
    });
    save(); render();
  }

  function updateBags(id, bags) {
    cart = cart.map(function(i) {
      if (i.id !== id) return i;
      return Object.assign({}, i, { bags: bags, subtotal: i.price * bags });
    });
    save(); render();
  }

  /* --- WhatsApp --- */
  function waUrl() {
    var total = cart.reduce(function(s, i) { return s + i.subtotal; }, 0);
    var lines = [
      "Hola, quiero hacer un pedido en Distribuidora Vuelo.",
      "",
      "Detalle del pedido:"
    ].concat(cart.map(function(item, idx) {
      var fmtLabel = item.grams === 250 ? '250 g' : '1 kg';
      var bolsas = item.bags === 1 ? '1 bolsa' : item.bags + ' bolsas';
      return (idx + 1) + ". " + item.name + " | " + fmtLabel + " × " + bolsas + " | " + item.grind + " | " + fmt(item.subtotal);
    })).concat([
      "",
      "Total: " + fmt(total),
      "",
      "Datos de contacto:",
      "Nombre: " + (customer.name || "No indicado"),
      "Comuna: " + (customer.commune || "No indicado"),
      "Teléfono: " + (customer.phone || "No indicado"),
      "Notas: " + (customer.notes || "Sin notas"),
      "",
      "Entiendo que el despacho es gratis en Valparaíso, Viña del Mar, Reñaca, Con Con, Quilpué y Villa Alemana.",
      "Quiero participar en el sorteo de la Oster PrimaLatte."
    ]);
    return "https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  /* --- Render cart --- */
  function render() {
    var list = $("cart-items-list");
    var totalEl = $("cart-total");
    var countEl = $("cart-count");
    var waBtn = $("whatsapp-btn");
    if (!list) return;

    var total = cart.reduce(function(s, i) { return s + i.subtotal; }, 0);

    if (countEl) {
      countEl.textContent = cart.length;
      countEl.style.display = cart.length > 0 ? "flex" : "none";
    }
    if (totalEl) totalEl.textContent = fmt(total);

    if (waBtn) {
      var textEl = waBtn.querySelector(".wa-btn-text");
      if (cart.length > 0) {
        waBtn.href = waUrl();
        waBtn.removeAttribute("data-disabled");
        if (textEl) textEl.textContent = "Enviar pedido por WhatsApp";
      } else {
        waBtn.href = "#productos";
        waBtn.setAttribute("data-disabled", "");
        if (textEl) textEl.textContent = "Agrega productos para continuar";
      }
    }

    if (cart.length === 0) {
      list.innerHTML = '<div class="cart-empty">' +
        '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
        '<p>Aún no agregaste café al carrito.</p></div>';
      return;
    }

    list.innerHTML = cart.map(function(item) {
      var formatOpts = [
        { g: 250, price: item.price250, label: '250 g' },
        { g: 1000, price: item.price1000, label: '1 kg' }
      ].map(function(opt) {
        return '<option value="' + opt.g + '"' + (item.grams === opt.g ? ' selected' : '') + '>' + opt.label + ' — ' + fmt(opt.price) + '</option>';
      }).join("");

      return '<div class="cart-item" data-id="' + item.id + '">' +
        '<div class="ci-top">' +
          '<div class="ci-info">' +
            '<strong>' + item.name + '</strong>' +
            '<span>' + item.grind + '</span>' +
          '</div>' +
          '<button class="ci-remove" data-id="' + item.id + '" aria-label="Quitar">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="ci-bottom">' +
          '<select class="ci-format" data-id="' + item.id + '">' + formatOpts + '</select>' +
          '<select class="ci-bags" data-id="' + item.id + '">' + bagsOpts(item.bags) + '</select>' +
          '<span class="ci-subtotal">' + fmt(item.subtotal) + '</span>' +
        '</div>' +
      '</div>';
    }).join("");

    list.querySelectorAll(".ci-remove").forEach(function(btn) {
      btn.addEventListener("click", function() { removeItem(btn.dataset.id); });
    });
    list.querySelectorAll(".ci-format").forEach(function(sel) {
      sel.addEventListener("change", function() { updateFormat(sel.dataset.id, parseInt(sel.value, 10)); });
    });
    list.querySelectorAll(".ci-bags").forEach(function(sel) {
      sel.addEventListener("change", function() { updateBags(sel.dataset.id, parseInt(sel.value, 10)); });
    });
  }

  /* --- Cart open/close --- */
  function openCart() {
    var d = $("cart-drawer"), o = $("cart-overlay");
    if (d) d.classList.add("is-open");
    if (o) o.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    var d = $("cart-drawer"), o = $("cart-overlay");
    if (d) d.classList.remove("is-open");
    if (o) o.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  /* --- Modal --- */
  function openModal() {
    var m = $("promo-modal");
    if (m) m.classList.add("is-open");
  }
  function closeModal() {
    var m = $("promo-modal");
    if (m) m.classList.remove("is-open");
  }

  /* --- Inits --- */
  function initModal() {
    var m = $("promo-modal");
    if (!m) return;
    setTimeout(openModal, 700);
    var closeBtn = $("modal-close-btn");
    var ctaBtn = $("modal-cta-btn");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (ctaBtn) ctaBtn.addEventListener("click", closeModal);
    m.addEventListener("click", function(e) { if (e.target === m) closeModal(); });
  }

  function initCart() {
    var cartBtn = $("cart-btn");
    var closeBtn = $("cart-close-btn");
    var overlay = $("cart-overlay");
    var promoStrip = $("show-promo-btn");

    if (cartBtn) cartBtn.addEventListener("click", openCart);
    if (closeBtn) closeBtn.addEventListener("click", closeCart);
    if (overlay) overlay.addEventListener("click", closeCart);
    if (promoStrip) {
      promoStrip.addEventListener("click", function() { closeCart(); openModal(); });
      promoStrip.addEventListener("keydown", function(e) { if (e.key === "Enter" || e.key === " ") { closeCart(); openModal(); } });
    }

    ["name", "commune", "phone", "notes"].forEach(function(field) {
      var el = $("customer-" + field);
      if (!el) return;
      el.value = customer[field] || "";
      el.addEventListener("input", function() {
        customer[field] = el.value;
        save();
        var waBtn = $("whatsapp-btn");
        if (waBtn && cart.length > 0) waBtn.href = waUrl();
      });
    });
  }

  function initCards() {
    document.querySelectorAll(".product-card").forEach(function(card) {
      var price250 = parseInt(card.dataset.price250, 10);
      var price1000 = parseInt(card.dataset.price1000, 10);
      var qtySelect = card.querySelector(".qty-select");
      var bagsSelect = card.querySelector(".bags-select");
      var subtotalEl = card.querySelector(".subtotal-value");
      var addBtn = card.querySelector(".add-btn");
      if (!qtySelect || !subtotalEl || !addBtn) return;

      function currentPrice() {
        return parseInt(qtySelect.value, 10) === 250 ? price250 : price1000;
      }
      function currentBags() {
        return bagsSelect ? parseInt(bagsSelect.value, 10) : 1;
      }
      function updateSub() {
        subtotalEl.textContent = fmt(currentPrice() * currentBags());
      }
      qtySelect.addEventListener("change", updateSub);
      if (bagsSelect) bagsSelect.addEventListener("change", updateSub);
      updateSub();

      addBtn.addEventListener("click", function() {
        var grind = card.querySelector(".grind-select").value;
        var grams = parseInt(qtySelect.value, 10);
        var bags = currentBags();
        var price = currentPrice();
        addItem({
          id: uid(),
          productId: card.dataset.productId,
          name: card.dataset.name,
          price250: price250,
          price1000: price1000,
          price: price,
          grind: grind,
          grams: grams,
          bags: bags,
          subtotal: price * bags
        });
      });
    });
  }

  function initActions() {
    document.querySelectorAll("[data-action]").forEach(function(el) {
      el.addEventListener("click", function() {
        if (el.dataset.action === "open-promo") openModal();
        if (el.dataset.action === "open-cart") openCart();
      });
    });
  }

  function initNav() {
    var nav = $("main-nav");
    if (!nav) return;
    function tick() { nav.classList.toggle("is-scrolled", window.scrollY > 60); }
    window.addEventListener("scroll", tick, { passive: true });
    tick();
  }

  function initReveals() {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        var delay = parseInt(e.target.dataset.delay || "0", 10);
        var el = e.target;
        setTimeout(function() { el.classList.add("is-visible"); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -2% 0px" });

    document.querySelectorAll(".reveal").forEach(function(el) { io.observe(el); });

    setTimeout(function() {
      document.querySelectorAll(".reveal:not(.is-visible)").forEach(function(el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-visible");
      });
    }, 6000);
  }

  function initParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".hero-bg-img", {
      yPercent: 22, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  function initScroll() {
    document.addEventListener("click", function(e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeModal();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    });
  }

  /* --- Boot --- */
  function boot() {
    load();
    safe(initModal, "initModal");
    safe(initCart, "initCart");
    safe(initCards, "initCards");
    safe(initActions, "initActions");
    safe(initNav, "initNav");
    safe(initReveals, "initReveals");
    safe(initParallax, "initParallax");
    safe(initScroll, "initScroll");
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
