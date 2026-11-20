/* ================================================================
   CẤU HÌNH NHANH — CHỈ SỬA TRONG KHỐI NÀY, KHÔNG CẦN ĐỌC CODE BÊN DƯỚI
   (Khách / thầy muốn đổi banner, hotline, email, địa chỉ thì sửa đúng
   các dòng dưới đây rồi lưu file, mở lại web là thấy đổi.)
   - BANNER_HIEN: true = hiện banner, false = ẩn banner hẳn.
   - BANNER_ANH: ảnh banner mới. Để "" (2 dấu nháy rỗng) = giữ ảnh gốc.
     Muốn đổi ảnh thì ghi tên file, VD "banner-moi.jpg" (để file ảnh
     CÙNG THƯ MỤC với file HTML này). LƯU Ý: chữ "Giảm đến 30%" nằm
     TRONG ẢNH, đổi số % thì phải làm lại ảnh banner, sửa ở đây không đổi được chữ trong ảnh.
   - BANNER_TRANG: trang mở ra khi bấm banner: "shop" (Sản phẩm),
     "about" (Giới thiệu), "blog" (Bài viết), "contact" (Liên hệ).
   - HOTLINE / EMAIL / DIA_CHI: sửa ở đây thì dòng thông báo trên cùng
     + footer tự đổi theo. Giữ nguyên dấu nháy kép " " quanh giá trị.
   - ZALO_SDT: số Zalo nhận tư vấn (nút Zalo nổi góc phải dưới).
     Đổi số ở đây thì link chat đổi theo. Số hiện tại 0337320206 là
     Zalo cá nhân, khác hotline shop 0301 234 567 — giữ nguyên nếu đúng ý khách.
   Những thứ KHÔNG có trong khối này (tên shop, slogan, tên/giá sản phẩm,
   màu nền) vẫn sửa bằng comment [SỬA ...] trong file như trước.
   ================================================================ */
var CAU_HINH = {
  BANNER_HIEN: true,
  BANNER_ANH: "",
  BANNER_TRANG: "shop",
  HOTLINE: "0301 234 567",
  EMAIL: "ngocvancac@gmail.com",
  DIA_CHI: "366 Nguyễn Trãi, Thanh Xuân, Hà Nội",
  ZALO_SDT: "0337320206"
};

// [SỬA SẢN PHẨM] Tất cả 16 sản phẩm nằm trong mảng này, MỖI SẢN PHẨM 1 DÒNG.
//   Mỗi dòng có: id (mã, VD "NTV-001") | name (tên) | price (giá gốc) | sale (giá bán) | material (chất liệu)
//   | stock (tồn kho) | menh (mệnh hợp, VD ["Kim","Thủy"]; để [] nghĩa là chưa ghi mệnh -> web hiện "Tư vấn mệnh")
//   | img: (ẢNH sản phẩm — đoạn base64 rất dài; thay bằng src file thì đổi thành img:"ten-anh.jpg")
//   | line (phothong/trungcap/caocap) | col (thanhvan/daminh/none) | desc (mô tả).
//   Đổi giá/tên/mệnh thì sửa đúng dòng đó. Thêm sản phẩm mới thì copy 1 dòng, đổi id + tên + giá + ảnh.

// [SỬA BÀI VIẾT] Cả 2 bài viết nằm trong mảng này, mỗi bài 1 khối: date (ngày) | cat (chuyên mục)
//   | title (tiêu đề) | img: (ẢNH bìa bài viết — base64 rất dài; bài số 2 trùng ảnh với banner BST Dạ Minh)
//   | body (nội dung, viết bằng HTML: <p> đoạn văn, <h3> tiêu đề nhỏ). Sửa chữ trong body là nội dung bài đổi theo.

var LINES = {
  phothong: "Phổ thông",
  trungcap: "Trung cấp",
  caocap: "Cao cấp"
};
var COLS = {
  thanhvan: "BST Ngọc Thanh Vân",
  daminh: "BST Ngọc Dạ Minh"
};
var state = {
  cart: [],
  favs: [],
  detail: null,
  stone: "10mm",
  wrist: "16cm",
  qty: 1,
  query: "",
  orders: loadOrders()
};
var lastOrderCode = null;

function fmt(n) {
  return n.toLocaleString("vi-VN") + "₫"
}

function $(id) {
  return document.getElementById(id)
}

function toast(msg) {
  var t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(function() {
    t.classList.remove("show")
  }, 2600)
}
var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollBehavior() {
  return RM ? "auto" : "smooth"
}
/* Ảnh sản phẩm bay về icon giỏ hàng */
function flyToCart(imgEl) {
  if (RM) return;
  var cb = $("cartBtn");
  if (cb) cb.animate([{
    transform: "scale(1)"
  }, {
    transform: "scale(1.18)"
  }, {
    transform: "scale(1)"
  }], {
    duration: 320,
    easing: "ease-out"
  });
  if (!imgEl) return;
  /* Hiệu ứng mới: ảnh nảy nhẹ tại chỗ + chip +1 bay lên rồi mờ — không quăng ảnh bay xuyên trang lên đầu trang nữa, không cần kéo lên xem */
  imgEl.animate([{
    transform: "scale(1)"
  }, {
    transform: "scale(.94)",
    offset: .35
  }, {
    transform: "scale(1.03)",
    offset: .7
  }, {
    transform: "scale(1)"
  }], {
    duration: 480,
    easing: "ease-out"
  });
  var r = imgEl.getBoundingClientRect();
  var chip = document.createElement("span");
  chip.className = "add-chip";
  chip.textContent = "+1";
  chip.style.left = (r.left + r.width / 2 - 15) + "px";
  chip.style.top = (r.top + 12) + "px";
  document.body.appendChild(chip);
  var a = chip.animate([{
    transform: "translateY(0) scale(.8)",
    opacity: 0
  }, {
    transform: "translateY(-14px) scale(1)",
    opacity: 1,
    offset: .25
  }, {
    transform: "translateY(-48px) scale(1)",
    opacity: 0
  }], {
    duration: 650,
    easing: "ease-out"
  });
  (function(n, an) {
    function rm() {
      if (n.parentNode) n.parentNode.removeChild(n)
    }
    if (an) an.onfinish = rm;
    else setTimeout(rm, 700)
  })(chip, a);
}
/* Tia nhỏ bùng quanh tim khi thêm yêu thích */
function burstAt(x, y) {
  if (RM) return;
  var colors = ["#b3402e", "#b08d4f", "#c9a86a", "#e2705f"];
  for (var i = 0; i < 9; i++) {
    var s = document.createElement("span");
    s.className = "burst-p";
    s.style.background = colors[i % colors.length];
    s.style.left = (x - 3.5) + "px";
    s.style.top = (y - 3.5) + "px";
    document.body.appendChild(s);
    var ang = (Math.PI * 2 / 9) * i + Math.random() * .5,
      dist = 26 + Math.random() * 22;
    var a = s.animate([{
      transform: "translate(0,0) scale(1)",
      opacity: 1
    }, {
      transform: "translate(" + (Math.cos(ang) * dist) + "px," + (Math.sin(ang) * dist) + "px) scale(.15)",
      opacity: 0
    }], {
      duration: 480 + Math.random() * 140,
      easing: "cubic-bezier(.17,.67,.35,1)"
    });
    (function(node, an) {
      function rm() {
        if (node.parentNode) node.parentNode.removeChild(node)
      }
      if (an) an.onfinish = rm;
      else setTimeout(rm, 600)
    })(s, a);
  }
}

function showView(name) {
  document.querySelectorAll(".view").forEach(function(v) {
    v.classList.remove("active")
  });
  $("view-" + name).classList.add("active");
  document.querySelectorAll("nav.main button").forEach(function(b) {
    b.classList.toggle("active", b.dataset.nav === name)
  });
  $("mainNav").classList.remove("open");
  window.scrollTo({
    top: 0,
    behavior: scrollBehavior()
  });
}
document.addEventListener("click", function(e) {
  var nav = e.target.closest("[data-nav]");
  if (nav) {
    e.preventDefault();
    showView(nav.dataset.nav);
  }
  var cg = e.target.closest("[data-catgo]");
  if (cg) {
    $("fCat").value = cg.dataset.catgo;
    showView("shop");
    renderShopFx();
  }
});
$("menuBtn").onclick = function() {
  $("mainNav").classList.toggle("open")
};

function disc(p) {
  return Math.round((1 - p.sale / p.price) * 100)
}

function cardHTML(p) {
  var fav = state.favs.indexOf(p.id) >= 0;
  var menh = p.allMenh ? "Tất cả mệnh" : (p.menh.length ? p.menh.join(" · ") : "Tư vấn mệnh");
  return '<article class="card rv"><div class="thumb" data-detail="' + p.id + '"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy" onload="this.classList.add(\'ld\')" onerror="this.classList.add(\'ld\')"><span class="tag' + (p.col !== "none" ? " bst" : "") + '">-' + disc(p) + '%</span><button class="favbtn' + (fav ? " on" : "") + '" data-fav="' + p.id + '" aria-label="Yêu thích ' + p.name + '">' + (fav ? "♥" : "♡") + '</button></div><div class="body"><span class="meta">' + p.id + ' · ' + p.material + '</span><h3 data-detail="' + p.id + '">' + p.name + '</h3><div class="chips"><span class="chip">' + LINES[p.line] + '</span>' + (p.col !== "none" ? '<span class="chip gold">' + COLS[p.col] + '</span>' : "") + '<span class="chip">Mệnh ' + menh + '</span></div><div class="price"><b>' + fmt(p.sale) + '</b><s>' + fmt(p.price) + '</s></div><span class="stock">Còn ' + p.stock + ' sản phẩm</span><div class="row"><button class="btn btn-ghost btn-sm" data-detail="' + p.id + '">Chi tiết</button><button class="btn btn-jade btn-sm" data-quickadd="' + p.id + '">Thêm giỏ</button></div></div></article>';
}

function skelCards(n) {
  var s = "";
  for (var i = 0; i < n; i++) s += '<div class="skel" aria-hidden="true"><div class="sk-img shimmer"></div><div class="sk-body"><div class="sk-line shimmer" style="width:52%"></div><div class="sk-line tall shimmer" style="width:88%"></div><div class="sk-line shimmer" style="width:64%"></div><div class="sk-line shimmer" style="width:42%"></div><div class="sk-btn shimmer"></div></div></div>';
  return s
}

function bindCards(scope) {
  scope.querySelectorAll("[data-detail]").forEach(function(el) {
    el.onclick = function(ev) {
      if (ev.target.closest("[data-fav]")) return;
      openDetail(el.dataset.detail)
    }
  });
  scope.querySelectorAll("[data-fav]").forEach(function(el) {
    el.onclick = function(ev) {
      ev.stopPropagation();
      toggleFav(el.dataset.fav, el)
    }
  });
  scope.querySelectorAll("[data-quickadd]").forEach(function(el) {
    el.onclick = function() {
      var card = el.closest(".card");
      var img = card ? card.querySelector(".thumb img") : null;
      flyToCart(img);
      addToCart(el.dataset.quickadd, "10mm", "16cm", 1, false);
      var old = el.textContent;
      el.textContent = "✓ Đã thêm";
      el.classList.add("added");
      el.disabled = true;
      setTimeout(function() {
        el.textContent = old;
        el.classList.remove("added");
        el.disabled = false
      }, 1200);
      toast("Đã thêm vào giỏ: " + prod(el.dataset.quickadd).name)
    }
  });
}

function prod(id) {
  return PRODUCTS.filter(function(p) {
    return p.id === id
  })[0]
}

function renderHome() {
  $("homeThanhvan").innerHTML = PRODUCTS.filter(function(p) {
    return p.col === "thanhvan"
  }).map(cardHTML).join("");
  $("homeDaminh").innerHTML = PRODUCTS.filter(function(p) {
    return p.col === "daminh"
  }).map(cardHTML).join("");
  $("homeFeatured").innerHTML = PRODUCTS.filter(function(p) {
    return p.cat === "phongthuy"
  }).slice(0, 4).map(cardHTML).join("");
  var ah = ARTICLES.map(function(a) {
    return '<article class="article-card" data-article="' + a.id + '"><img src="' + a.img + '" alt="' + a.title + '" loading="lazy" onload="this.classList.add(\'ld\')" onerror="this.classList.add(\'ld\')"><div class="body"><span class="meta">' + a.date + ' · ' + a.cat + '</span><h3>' + a.title + '</h3><span style="color:var(--jade);font-weight:600">Đọc bài viết →</span></div></article>'
  }).join("");
  $("homeArticles").innerHTML = ah;
  $("blogList").innerHTML = ah;
  bindCards($("view-home"));
  bindCards($("view-blog"));
  initRv(document);
  document.querySelectorAll("[data-article]").forEach(function(el) {
    el.onclick = function() {
      openArticle(+el.dataset.article)
    }
  });
}

function currentFilters() {
  return {
    cat: $("fCat").value,
    line: $("fLine").value,
    col: $("fCol").value,
    price: $("fPrice").value,
    menh: $("fMenh").value,
    sort: $("fSort").value,
    favOnly: $("fFavOnly").checked,
    q: state.query.trim().toLowerCase()
  };
}

function filtered() {
  var f = currentFilters();
  var list = PRODUCTS.filter(function(p) {
    if (f.cat && p.cats.indexOf(f.cat) < 0) return false;
    if (f.line && p.line !== f.line) return false;
    if (f.col && p.col !== f.col) return false;
    if (f.menh && !(p.allMenh || p.menh.indexOf(f.menh) >= 0)) return false;
    if (f.favOnly && state.favs.indexOf(p.id) < 0) return false;
    if (f.price) {
      var parts = f.price.split("-");
      var lo = +parts[0],
        hi = +parts[1];
      if (p.sale < lo || p.sale > hi) return false;
    }
    if (f.q) {
      var hay = (p.name + " " + p.id + " " + p.material + " " + (p.menh.join(" "))).toLowerCase();
      if (hay.indexOf(f.q) < 0) return false;
    }
    return true;
  });
  if (f.sort === "price-asc") list.sort(function(a, b) {
    return a.sale - b.sale
  });
  if (f.sort === "price-desc") list.sort(function(a, b) {
    return b.sale - a.sale
  });
  if (f.sort === "name") list.sort(function(a, b) {
    return a.name.localeCompare(b.name, "vi")
  });
  if (f.sort === "discount") list.sort(function(a, b) {
    return disc(b) - disc(a)
  });
  return list;
}

function renderShop() {
  var list = filtered();
  $("shopGrid").innerHTML = list.map(cardHTML).join("");
  $("shopEmpty").style.display = list.length ? "none" : "block";
  $("resultNote").textContent = "Hiển thị " + list.length + " / " + PRODUCTS.length + " sản phẩm" + (currentFilters().menh ? " · hợp mệnh " + currentFilters().menh : "") + (state.query ? " · từ khóa “" + state.query + "”" : "");
  bindCards($("shopGrid"));
  initRv($("shopGrid"));
}
var shopToken = 0;

function renderShopFx() {
  var tk = ++shopToken;
  $("shopGrid").innerHTML = skelCards(8);
  $("shopEmpty").style.display = "none";
  $("resultNote").textContent = "Đang tải sản phẩm…";
  setTimeout(function() {
    if (tk === shopToken) renderShop()
  }, 430)
}
["fCat", "fLine", "fCol", "fPrice", "fMenh", "fSort", "fFavOnly"].forEach(function(id) {
  $(id).addEventListener("change", renderShopFx)
});

function clearAllFilters() {
  $("fCat").value = "";
  $("fLine").value = "";
  $("fCol").value = "";
  $("fPrice").value = "";
  $("fMenh").value = "";
  $("fSort").value = "featured";
  $("fFavOnly").checked = false;
  state.query = "";
  $("globalSearch").value = "";
  renderShop()
}
$("clearFilters").onclick = clearAllFilters;
$("emptyReset").onclick = clearAllFilters;

function doSearch() {
  state.query = $("globalSearch").value;
  showView("shop");
  renderShopFx()
}
$("searchGo").onclick = doSearch;
$("globalSearch").addEventListener("keydown", function(e) {
  if (e.key === "Enter") doSearch()
});
document.querySelectorAll(".menh").forEach(function(b) {
  b.onclick = function() {
    $("fMenh").value = b.dataset.menh;
    showView("shop");
    renderShopFx();
    toast("Đã lọc vòng hợp mệnh " + b.dataset.menh)
  }
});
$("ctaMenh").onclick = function() {
  $("menhSection").scrollIntoView({
    behavior: scrollBehavior()
  })
};

function goDaminh() {
  $("fCol").value = "daminh";
  showView("shop");
  renderShopFx()
}
$("bstGo").onclick = goDaminh;
$("bstGo2").onclick = goDaminh;
$("tvGo").onclick = function() {
  $("fCol").value = "thanhvan";
  showView("shop");
  renderShopFx()
};
/* Scroll reveal — nhẹ, tôn trọng prefers-reduced-motion qua CSS */
var rvIO = ("IntersectionObserver" in window) ? new IntersectionObserver(function(es) {
  es.forEach(function(e) {
    if (e.isIntersecting) {
      var el = e.target;
      el.classList.add("in");
      if (!RM && el.animate) el.animate([{
        transform: "translateY(14px)"
      }, {
        transform: "none"
      }], {
        duration: 550,
        easing: "ease-out"
      });
      rvIO.unobserve(el)
    }
  })
}, {
  threshold: .06,
  rootMargin: "0px 0px -4% 0px"
}) : null;

function initRv(scope) {
  (scope || document).querySelectorAll(".rv:not(.in)").forEach(function(el) {
    if (rvIO) rvIO.observe(el);
    else el.classList.add("in")
  })
}
/* Detail */
function openDetail(id) {
  var p = prod(id);
  state.detail = p;
  state.stone = "10mm";
  state.wrist = "16cm";
  state.qty = 1;
  $("qVal").value = 1;
  $("dCert").checked = false;
  $("dImg").classList.remove("ld");
  $("dImg").src = p.img;
  $("dImg").alt = p.name;
  if ($("dImg").complete && $("dImg").naturalWidth) $("dImg").classList.add("ld");
  $("dSku").textContent = p.id + " · " + p.material;
  $("dName").textContent = p.name;
  $("dChips").innerHTML = '<span class="chip">' + LINES[p.line] + '</span>' + (p.col !== "none" ? '<span class="chip gold">' + COLS[p.col] + '</span>' : "") + '<span class="chip">Mệnh ' + (p.allMenh ? "Tất cả" : (p.menh.length ? p.menh.join(" · ") : "— tư vấn")) + '</span>';
  $("dPrice").textContent = fmt(p.sale);
  $("dOld").textContent = fmt(p.price);
  $("dDisc").textContent = "Tiết kiệm " + disc(p) + "%";
  $("dStock").textContent = "Tình trạng: còn " + p.stock + " sản phẩm · Bảo hành dây đeo vĩnh viễn";
  $("dDesc").textContent = p.desc;
  renderPills();
  updateFavBtn();
  var rel = PRODUCTS.filter(function(x) {
    return x.id !== p.id && (x.material === p.material || x.col === p.col && p.col !== "none")
  }).slice(0, 4);
  if (rel.length < 2) rel = PRODUCTS.filter(function(x) {
    return x.id !== p.id
  }).slice(0, 4);
  $("relatedGrid").innerHTML = rel.map(cardHTML).join("");
  bindCards($("relatedGrid"));
  initRv($("relatedGrid"));
  showView("detail");
}

function renderPills() {
  $("dStone").innerHTML = ["6mm", "8mm", "10mm", "12mm"].map(function(s) {
    return '<button class="pill' + (state.stone === s ? " on" : "") + '" data-stone="' + s + '">Đá ' + s + '</button>'
  }).join("");
  $("dWrist").innerHTML = ["14cm", "15cm", "16cm", "17cm", "18cm", "19cm", "20cm"].map(function(s) {
    return '<button class="pill' + (state.wrist === s ? " on" : "") + '" data-wrist="' + s + '">' + s + '</button>'
  }).join("");
  $("dStone").querySelectorAll("[data-stone]").forEach(function(b) {
    b.onclick = function() {
      state.stone = b.dataset.stone;
      renderPills()
    }
  });
  $("dWrist").querySelectorAll("[data-wrist]").forEach(function(b) {
    b.onclick = function() {
      state.wrist = b.dataset.wrist;
      renderPills()
    }
  });
}
$("qMinus").onclick = function() {
  state.qty = Math.max(1, state.qty - 1);
  $("qVal").value = state.qty
};
$("qPlus").onclick = function() {
  state.qty = Math.min(state.detail ? state.detail.stock : 99, state.qty + 1);
  $("qVal").value = state.qty
};
$("qVal").addEventListener("change", function() {
  var v = parseInt(this.value, 10);
  if (isNaN(v) || v < 1) v = 1;
  if (state.detail && v > state.detail.stock) v = state.detail.stock;
  state.qty = v;
  this.value = v
});
$("backShop").onclick = function() {
  showView("shop")
};
/* Phụ lục size ở trang chi tiết: chuyển tab + nút "Xem cách đo" cuộn xuống phụ lục */
document.querySelectorAll(".app-tab").forEach(function(t) {
  t.onclick = function() {
    document.querySelectorAll(".app-tab").forEach(function(x) {
      x.classList.remove("on")
    });
    document.querySelectorAll(".app-panel").forEach(function(x) {
      x.classList.remove("on")
    });
    t.classList.add("on");
    $("appPanel" + t.dataset.app).classList.add("on");
  }
});
$("dSizeHelp").onclick = function() {
  document.querySelector('[data-app="1"]').click();
  $("appendix").scrollIntoView({
    behavior: RM ? "auto" : "smooth",
    block: "start"
  });
};

function keyOf(id, stone, wrist, cert) {
  return id + "|" + stone + "|" + wrist + "|" + (cert ? "cert" : "std")
}

function addToCart(id, stone, wrist, qty, cert) {
  var k = keyOf(id, stone, wrist, cert);
  var ex = state.cart.filter(function(i) {
    return i.key === k
  })[0];
  if (ex) ex.qty = Math.min(prod(id).stock, ex.qty + qty);
  else state.cart.push({
    key: k,
    id: id,
    stone: stone,
    wrist: wrist,
    qty: qty,
    cert: !!cert
  });
  renderCart();
}
$("dAdd").onclick = function() {
  if (!state.detail) return;
  flyToCart($("dImg"));
  addToCart(state.detail.id, state.stone, state.wrist, state.qty, $("dCert").checked);
  var b = this,
    o = b.textContent;
  b.textContent = "✓ Đã thêm vào giỏ";
  b.classList.add("added");
  setTimeout(function() {
    b.textContent = o;
    b.classList.remove("added")
  }, 1300);
  toast("Đã thêm " + state.detail.name + " vào giỏ hàng")
};
$("dBuy").onclick = function() {
  if (!state.detail) return;
  addToCart(state.detail.id, state.stone, state.wrist, state.qty, $("dCert").checked);
  showView("cart")
};

function updateFavBtn() {
  if (!state.detail) return;
  var on = state.favs.indexOf(state.detail.id) >= 0;
  $("dFav").innerHTML = on ? "♥ Đã yêu thích" : "♡ Yêu thích"
}
$("dFav").onclick = function() {
  if (state.detail) toggleFav(state.detail.id, this)
};
/* Cập nhật tim tại chỗ (không innerHTML) để nút đang animate không bị xóa */
function syncFavUI(id) {
  var on = state.favs.indexOf(id) >= 0;
  document.querySelectorAll('[data-fav="' + id + '"]').forEach(function(b) {
    b.classList.toggle("on", on);
    b.textContent = on ? "♥" : "♡"
  });
  $("favCount").textContent = state.favs.length || "";
  if (state.detail && state.detail.id === id) updateFavBtn();
}
var favRenderTimer = null;

function scheduleFavRender(delay) {
  /* Chỉ render lại lưới SAU khi hiệu ứng tim đã chạy xong */
  if (favRenderTimer) clearTimeout(favRenderTimer);
  favRenderTimer = setTimeout(function() {
    favRenderTimer = null;
    renderHome();
    renderShop();
    if ($("view-detail").classList.contains("active")) updateFavBtn()
  }, Math.max(0, delay || 0));
}

function applyFav(id, deferMs) {
  var i = state.favs.indexOf(id);
  if (i >= 0) {
    state.favs.splice(i, 1);
    toast("Đã bỏ yêu thích: " + prod(id).name)
  } else {
    state.favs.push(id);
    toast("Đã thêm vào yêu thích: " + prod(id).name)
  }
  /* Trạng thái + tim đầy/rỗng áp dụng ngay tại chỗ, không đụng innerHTML */
  syncFavUI(id);
  if (typeof deferMs === "number" && deferMs > 0) {
    scheduleFavRender(deferMs);
    return
  }
  /* Không có animation: nếu đang lọc "chỉ yêu thích" mới cần render lại ngay để thêm/bớt khỏi lưới */
  if ($("fFavOnly") && $("fFavOnly").checked) {
    renderHome();
    renderShop();
    if ($("view-detail").classList.contains("active")) updateFavBtn()
  }
}

function toggleFav(id, el) {
  var adding = state.favs.indexOf(id) < 0;
  if (navigator.vibrate) {
    try {
      navigator.vibrate(12)
    } catch (e) {}
  }
  if (el && !RM) {
    var r = el.getBoundingClientRect(),
      cx = r.left + r.width / 2,
      cy = r.top + r.height / 2;
    if (adding) {
      /* 1) Đổi sang tim đầy NGAY trên chính nút vừa bấm, ép trình duyệt sơn trạng thái này trước */
      if (el.dataset && el.dataset.fav) {
        el.classList.add("on");
        el.textContent = "♥"
      }
      void el.offsetWidth;
      /* 2) Nảy phóng to + rung nhẹ + bùng tia trên nút còn nguyên trong DOM */
      var anim = el.animate([{
        transform: "scale(1)"
      }, {
        transform: "scale(1.5) rotate(-8deg)"
      }, {
        transform: "scale(.92) rotate(3deg)"
      }, {
        transform: "scale(1.12)"
      }, {
        transform: "scale(1)"
      }], {
        duration: 480,
        easing: "ease-out"
      });
      burstAt(cx, cy);
      /* 3) Lưu trạng thái ngay (giữ nguyên khi chuyển trang/lọc) nhưng hoãn render lại lưới
            tới khi animation kết thúc — innerHTML không còn cơ hội xóa tim trước khung hình đầu tiên */
      applyFav(id, 490);
      if (anim && anim.finished && typeof anim.finished.then === "function") {
        anim.finished.then(function() {
          scheduleFavRender(10)
        }, function() {})
      }
      return;
    } else {
      /* Bỏ yêu thích: tim mờ + thu nhỏ dần, xem xong hiệu ứng mới cập nhật trạng thái/render */
      el.animate([{
        opacity: 1,
        transform: "scale(1)"
      }, {
        opacity: .2,
        transform: "scale(.75)"
      }], {
        duration: 190,
        easing: "ease-in",
        fill: "forwards"
      });
      setTimeout(function() {
        if (el.getAnimations) el.getAnimations().forEach(function(a) {
          a.cancel()
        });
        applyFav(id, $("fFavOnly") && $("fFavOnly").checked ? 60 : 0)
      }, 185);
      return;
    }
  }
  applyFav(id);
}
$("favBtn").onclick = function() {
  $("fFavOnly").checked = true;
  renderShop();
  showView("shop");
  toast(state.favs.length ? "Đang hiện sản phẩm yêu thích của bạn" : "Bạn chưa yêu thích sản phẩm nào — bấm ♡ trên sản phẩm để thêm")
};
/* Cart */
function cartTotals() {
  var sub = state.cart.reduce(function(s, i) {
    return s + prod(i.id).sale * i.qty
  }, 0);
  var ship = $("shipZone").value === "province" ? (sub > 0 ? 30000 : 0) : 0;
  return {
    sub: sub,
    ship: ship,
    total: sub + ship
  }
}
var lastCartN = 0;

function renderCart() {
  var n = state.cart.reduce(function(s, i) {
    return s + i.qty
  }, 0);
  $("cartCount").textContent = n || "";
  if (n !== lastCartN) {
    lastCartN = n;
    if (n > 0) {
      var b = $("cartCount");
      b.classList.remove("pop");
      void b.offsetWidth;
      b.classList.add("pop")
    }
  }
  $("cartEmpty").style.display = state.cart.length ? "none" : "block";
  $("cartWrap").style.display = state.cart.length ? "grid" : "none";
  $("cartItems").innerHTML = state.cart.map(function(i, idx) {
    var p = prod(i.id);
    return '<div class="cart-item"><img src="' + p.img + '" alt="' + p.name + '"><div><h4>' + p.name + '</h4><div class="sub">' + p.id + ' · Đá ' + i.stone + ' · Cổ tay ' + i.wrist + (i.cert ? " · Có giấy kiểm định (+20 ngày giao)" : "") + '</div><div class="sub">' + fmt(p.sale) + ' × ' + i.qty + '</div><button class="rm" data-rm="' + idx + '">✕ Xóa khỏi giỏ</button></div><div style="text-align:right"><span class="qty"><button data-dec="' + idx + '" aria-label="Giảm">−</button><input value="' + i.qty + '" readonly aria-label="Số lượng"><button data-inc="' + idx + '" aria-label="Tăng">+</button></span><div style="font-weight:700;color:var(--jade2);margin-top:8px">' + fmt(p.sale * i.qty) + '</div></div></div>'
  }).join("");
  $("cartItems").querySelectorAll("[data-inc]").forEach(function(b) {
    b.onclick = function() {
      var i = state.cart[+b.dataset.inc];
      i.qty = Math.min(prod(i.id).stock, i.qty + 1);
      renderCart()
    }
  });
  $("cartItems").querySelectorAll("[data-dec]").forEach(function(b) {
    b.onclick = function() {
      var i = state.cart[+b.dataset.dec];
      i.qty--;
      if (i.qty < 1) state.cart.splice(+b.dataset.dec, 1);
      renderCart()
    }
  });
  $("cartItems").querySelectorAll("[data-rm]").forEach(function(b) {
    b.onclick = function() {
      state.cart.splice(+b.dataset.rm, 1);
      renderCart();
      toast("Đã xóa sản phẩm khỏi giỏ")
    }
  });
  var t = cartTotals();
  $("sumSub").textContent = fmt(t.sub);
  $("sumShip").textContent = t.ship ? fmt(t.ship) : "Miễn phí";
  $("sumTotal").textContent = fmt(t.total);
  $("shipNote").textContent = $("shipZone").value === "province" ? "Tỉnh/thành khác: giao 5–7 ngày, phí 30.000₫/đơn. Thời gian có thể thay đổi theo địa chỉ; đơn có giấy kiểm định cộng thêm 20 ngày." : "Nội thành Hà Nội: giao 1–3 ngày, miễn phí trong bán kính 10km. Đơn có giấy kiểm định cộng thêm 20 ngày.";
}
$("shipZone").addEventListener("change", renderCart);
$("cartBtn").onclick = function() {
  showView("cart")
};
/* Checkout */
function openCheckout() {
  $("checkoutModal").classList.add("open");
  document.body.classList.add("locked")
}

function closeCheckout() {
  $("checkoutModal").classList.remove("open");
  document.body.classList.remove("locked")
}
$("toCheckout").onclick = function() {
  if (!state.cart.length) {
    toast("Giỏ hàng đang trống");
    return
  }
  $("oTotal").textContent = fmt(cartTotals().total);
  $("orderOk").style.display = "none";
  $("checkoutForm").style.display = "grid";
  openCheckout();
};
$("cancelCheckout").onclick = closeCheckout;
$("checkoutModal").addEventListener("click", function(e) {
  if (e.target === this) closeCheckout()
});

function validPhone(v) {
  return /^[0-9\s.]+$/.test(v) && v.replace(/\D/g, "").length >= 9 && v.replace(/\D/g, "").length <= 11
}
/* Kiểm tra form thanh toán: hiện lỗi đỏ dưới từng ô + viền đỏ + focus ô lỗi đầu tiên.
   Chạy cả khi bấm nút (click) lẫn khi gửi form (submit) để không trình duyệt nào nuốt mất lượt kiểm tra. */
function validateCheckout() {
  var ok = true,
    firstBad = null;

  function chk(id, eid, valid) {
    var f = $(id),
      e = $(eid);
    e.style.display = valid ? "none" : "block";
    f.classList.toggle("bad", !valid);
    if (!valid) {
      ok = false;
      if (!firstBad) firstBad = f
    }
  }
  chk("oName", "oeName", $("oName").value.trim().length >= 2);
  chk("oPhone", "oePhone", validPhone($("oPhone").value.trim()));
  chk("oAddr", "oeAddr", $("oAddr").value.trim().length >= 8);
  if (!ok) {
    toast("Vui lòng kiểm tra lại thông tin đã nhập");
    if (firstBad) firstBad.focus()
  }
  return ok;
}
[
  ["oName", "oeName"],
  ["oPhone", "oePhone"],
  ["oAddr", "oeAddr"]
].forEach(function(p) {
  $(p[0]).addEventListener("input", function() {
    $(p[1]).style.display = "none";
    this.classList.remove("bad")
  })
});
$("checkoutForm").querySelector('button[type="submit"]').addEventListener("click", function(e) {
  if (!validateCheckout()) e.preventDefault()
});
$("checkoutForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (!validateCheckout()) return;
  var btn = this.querySelector('button[type="submit"]');
  var oldBtn = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spin"></span> Đang xử lý đơn hàng…';
  var t = cartTotals();
  var hasCert = state.cart.some(function(i) {
    return i.cert
  });
  var phone = $("oPhone").value.trim();
  var pay = $("oPay").value;
  var zone = $("shipZone").value;
  var form = this;
  setTimeout(function() {
    var code = "NVC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    var oItems = state.cart.map(function(i) {
      var p = prod(i.id);
      return {
        id: i.id,
        name: p.name,
        img: p.img,
        sale: p.sale,
        qty: i.qty,
        stone: i.stone,
        wrist: i.wrist,
        cert: i.cert
      }
    });
    var oNew = {
      code: code,
      placedAt: Date.now(),
      items: oItems,
      total: t.total,
      name: $("oName").value.trim(),
      phone: phone,
      addr: $("oAddr").value.trim(),
      pay: pay,
      zone: zone,
      hasCert: hasCert
    };
    state.orders.unshift(oNew);
    saveOrders();
    lastOrderCode = code;
    renderOrders();
    $("orderCode").textContent = code;
    $("orderNote").textContent = "Tổng thanh toán: " + fmt(t.total) + " · " + pay + " · Dự kiến giao: " + (zone === "province" ? "5–7 ngày" : "1–3 ngày") + (hasCert ? " (+20 ngày do có giấy kiểm định đá)" : "") + ". CSKH sẽ liên hệ xác nhận qua số " + phone + ".";
    form.style.display = "none";
    $("orderOk").style.display = "block";
    state.cart = [];
    renderCart();
    btn.disabled = false;
    btn.innerHTML = oldBtn;
    form.reset();
  }, 900);
});
$("okContinue").onclick = function() {
  closeCheckout();
  showView("shop")
};
/* ---- Theo dõi đơn hàng (kiểu TikTok Shop, mô phỏng — đơn chỉ lưu trên trình duyệt này vì web demo không có backend) ---- */
function loadOrders() {
  try {
    var raw = localStorage.getItem("nvc_orders");
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function saveOrders() {
  try {
    localStorage.setItem("nvc_orders", JSON.stringify(state.orders))
  } catch (e) {}
}

function fmtDate(ts) {
  var d = new Date(ts);
  return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear()
}

function fmtTime(ts) {
  var d = new Date(ts);
  return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + " " + fmtDate(ts)
}

function deliveryRange(o) {
  var min = o.zone === "province" ? 5 : 1,
    max = o.zone === "province" ? 7 : 3;
  if (o.hasCert) {
    min += 20;
    max += 20
  }
  return fmtDate(o.placedAt + min * 864e5) + " – " + fmtDate(o.placedAt + max * 864e5)
}

function orderSteps(o) {
  return [{
    t: "Đã đặt hàng",
    time: fmtTime(o.placedAt),
    st: "done"
  }, {
    t: "Đã xác nhận",
    time: fmtTime(o.placedAt + 15 * 6e4),
    st: "done"
  }, {
    t: "Đang chuẩn bị hàng",
    time: "Đang thực hiện",
    st: "now"
  }, {
    t: "Đang giao hàng",
    time: "Dự kiến " + deliveryRange(o),
    st: "todo"
  }, {
    t: "Đã giao hàng",
    time: "Dự kiến " + deliveryRange(o),
    st: "todo"
  }]
}

function trackHTML(o) {
  return '<ol class="track">' + orderSteps(o).map(function(s) {
    return '<li class="' + s.st + '"><span class="dot">' + (s.st === "done" ? "✓" : s.st === "now" ? "●" : "") + '</span><div>' + s.t + '</div><div class="t-time">' + s.time + '</div></li>'
  }).join("") + '</ol>'
}

function renderOrders() {
  var list = $("ordersList");
  if (!list) return;
  $("ordersEmpty").style.display = state.orders.length ? "none" : "block";
  $("ordersCount").textContent = state.orders.length ? ("Bạn có " + state.orders.length + " đơn hàng") : "";
  list.innerHTML = state.orders.map(function(o) {
    return '<article class="order-card" id="order-' + o.code + '">' +
      '<div class="order-head"><div><span class="order-code">' + o.code + '</span> · ' + fmtTime(o.placedAt) + '</div><span class="status-badge">📦 Đang chuẩn bị hàng</span></div>' +
      '<div class="order-items">' + o.items.map(function(i) {
        return '<img src="' + i.img + '" alt="' + i.name + '" loading="lazy">'
      }).join("") + '</div>' +
      '<div class="order-meta">' + o.items.map(function(i) {
        return i.name + " × " + i.qty
      }).join(" · ") + '<br>Nhận hàng: ' + o.name + " · " + o.phone + "<br>" + o.addr + "<br>" + o.pay + " · Tổng thanh toán: <b>" + fmt(o.total) + "</b> · Dự kiến giao: " + deliveryRange(o) + '</div>' +
      trackHTML(o) + '</article>';
  }).join("");
}
$("okTrack").onclick = function() {
  closeCheckout();
  showView("orders");
  $("trackCode").value = lastOrderCode || "";
  renderOrders();
  var el = lastOrderCode && $("order-" + lastOrderCode);
  if (el) {
    el.style.outline = "2px solid var(--gold)";
    setTimeout(function() {
      el.style.outline = ""
    }, 2500)
  }
};
$("trackGo").onclick = function() {
  var code = $("trackCode").value.trim().toUpperCase();
  if (!code) {
    toast("Nhập mã đơn hàng để tra cứu");
    return
  }
  var el = $("order-" + code);
  if (el) {
    el.scrollIntoView({
      behavior: RM ? "auto" : "smooth",
      block: "center"
    });
    el.style.outline = "2px solid var(--gold)";
    setTimeout(function() {
      el.style.outline = ""
    }, 2500)
  } else toast("Không tìm thấy đơn hàng " + code + " trên trình duyệt này");
};
renderOrders();
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && $("checkoutModal").classList.contains("open")) closeCheckout()
});
/* Articles */
function openArticle(id) {
  var a = ARTICLES.filter(function(x) {
    return x.id === id
  })[0];
  if (!a) return;
  $("articleBody").innerHTML = '<span class="meta" style="color:var(--muted)">' + a.date + ' · ' + a.cat + '</span><h1 style="font-size:clamp(26px,4vw,36px);color:var(--jade2);line-height:1.25;margin:8px 0 16px">' + a.title + '</h1><img src="' + a.img + '" alt="' + a.title + '" style="border-radius:16px;margin-bottom:20px;width:100%;aspect-ratio:16/9;object-fit:contain;background:#f6f1e6">' + a.body + '<div style="margin-top:26px"><button class="btn btn-jade" onclick="document.querySelector(\'[data-nav=shop]\').click()">Xem các mẫu vòng trong bài</button></div>';
  showView("article");
}
/* Contact */
$("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  var ok = true;

  function chk(eid, valid) {
    $(eid).style.display = valid ? "none" : "block";
    if (!valid) ok = false
  }
  chk("eName", $("cName").value.trim().length >= 2);
  chk("ePhone", validPhone($("cPhone").value.trim()));
  chk("eEmail", /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test($("cEmail").value.trim()));
  chk("eMsg", $("cMsg").value.trim().length >= 5);
  if (!ok) {
    toast("Vui lòng kiểm tra lại thông tin đã nhập");
    return
  }
  $("contactOk").style.display = "block";
  this.reset();
  toast("Đã gửi liên hệ thành công!");
});
document.querySelectorAll("section.block,.lookbook,.bst-banner,.why>div,.article-card").forEach(function(el) {
  el.classList.add("rv")
});
/* Header đổ bóng khi cuộn */
window.addEventListener("scroll", function() {
  document.querySelector("header.site").classList.toggle("scrolled", window.scrollY > 8)
}, {
  passive: true
});
/* Skeleton khởi động: hiện khung shimmer trước, rồi mới nạp sản phẩm thật */
$("homeThanhvan").innerHTML = skelCards(3);
$("homeDaminh").innerHTML = skelCards(3);
$("homeFeatured").innerHTML = skelCards(4);
$("homeArticles").innerHTML = skelCards(2);
$("shopGrid").innerHTML = skelCards(8);
$("resultNote").textContent = "Đang tải sản phẩm…";
/* Áp dụng CẤU HÌNH NHANH (khối CAU_HINH ở trên). Đừng sửa đoạn này trừ khi biết JS. */
(function() {
  var c = window.CAU_HINH || {};
  var sec = document.getElementById("promoBannerSection");
  if (sec) {
    if (c.BANNER_HIEN === false) {
      sec.style.display = "none";
    } else {
      var im = document.getElementById("promoBannerImg");
      if (im && c.BANNER_ANH) im.src = c.BANNER_ANH;
      var lk = document.getElementById("promoBannerLink");
      if (lk && c.BANNER_TRANG) lk.setAttribute("data-nav", c.BANNER_TRANG);
    }
  }

  function setText(id, v) {
    var el = document.getElementById(id);
    if (el && v) el.textContent = v;
  }
  setText("cfgHotlineTop", c.HOTLINE);
  setText("cfgHotline", c.HOTLINE);
  setText("cfgZalo", c.HOTLINE);
  setText("cfgEmail", c.EMAIL);
  setText("cfgDiaChi", c.DIA_CHI);
  var zf = document.getElementById("zaloFab");
  if (zf && c.ZALO_SDT) {
    zf.href = "https://zalo.me/" + c.ZALO_SDT.replace(/\s/g, "");
    zf.setAttribute("aria-label", "Nhắn tin tư vấn qua Zalo " + c.ZALO_SDT);
  }
  var hl = document.getElementById("cfgHotlineLink");
  if (hl && c.HOTLINE) hl.href = "tel:" + c.HOTLINE.replace(/\s/g, "");
  var em = document.getElementById("cfgEmailLink");
  if (em && c.EMAIL) em.href = "mailto:" + c.EMAIL;
})();
renderCart();
initRv(document);
setTimeout(function() {
  renderHome();
  renderShop();
  initRv(document)
}, 750);