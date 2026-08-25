/* inscrição de parceiro — gerado por gerador/inscricao_js.py. Não editar à mão. */
(function () {
  "use strict";
  var raizD = document.getElementById("ins-dados");
  var raizT = document.getElementById("ins-txt");
  if (!raizD || !raizT) return;
  var D = JSON.parse(raizD.textContent), T = JSON.parse(raizT.textContent);
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var regiao = null, principal = null, sec = [], cobre = {}, passo = 1;

  function acha(sl) {
    for (var i = 0; i < D.g.length; i++)
      for (var j = 0; j < D.g[i].f.length; j++)
        if (D.g[i].f[j].s === sl) return D.g[i].f[j];
    return null;
  }
  function todas() { return principal ? [principal].concat(sec) : sec.slice(); }

  function pintaVagas() {
    var el = $("#ins-vagas"); if (!el) return;
    var n = D.livres, u = n === 1 ? D.u[0] : D.u[1];
    el.textContent = n === 0 ? T.vagas_0
      : T.vagas_1.replace("{n}", n).replace("{u}", u);
    el.className = "ins-vagas" + (n === 0 ? " zero" : "");
  }

  function pintaPassos() {
    var nomes = [T.p1, T.p2, T.p3], h = "";
    for (var k = 1; k <= 3; k++) {
      var e = k < passo ? "feito" : k === passo ? "agora" : "";
      h += '<div data-e="' + e + '"><i>' + (k < passo ? "✓" : k) + "</i><span>" +
           esc(nomes[k - 1]) + "</span></div>";
    }
    $("#ins-passos").innerHTML = h;
  }

  function pintaRegioes() {
    var s = $("#ins-regiao"), h = "";
    if (!regiao) regiao = D.g[0].k;
    for (var i = 0; i < D.g.length; i++)
      h += '<option value="' + esc(D.g[i].k) + '"' + (D.g[i].k === regiao ? " selected" : "") +
           ">" + esc(D.g[i].n) + " · " + D.g[i].livres + "</option>";
    s.innerHTML = h;
  }

  function pintaPrincipal() {
    var el = $("#ins-principal");
    if (!principal) { el.innerHTML = '<span class="vazio">' + esc(T.princ_vazio) + "</span>"; return; }
    var f = acha(principal);
    el.innerHTML = "<b>" + esc(f.n) + '</b><button type="button" class="ins-b2" id="ins-trocar" ' +
      'style="margin-left:auto;padding:5px 11px;font-size:12px">' + esc(T.trocar) + "</button>";
    $("#ins-trocar").onclick = function () { principal = null; tudo(); };
  }

  function pintaZonas() {
    var g = null;
    for (var i = 0; i < D.g.length; i++) if (D.g[i].k === regiao) g = D.g[i];
    if (!g) return;
    var rot = { livre: T.est_l, voo: T.est_v, ocup: T.est_o }, h = "";
    for (var j = 0; j < g.f.length; j++) {
      var f = g.f[j], eu = f.s === principal, marcada = sec.indexOf(f.s) >= 0;
      var bloq = (f.e === "ocup" || f.e === "voo") && !eu;
      h += '<button type="button" class="ins-z ' + f.e + '" data-s="' + esc(f.s) + '"' +
        (bloq ? " disabled" : "") + ' aria-pressed="' + (eu || marcada) + '"><span>' +
        esc(f.n) + "</span><em>" + esc(eu ? T.est_p : rot[f.e]) + "</em></button>";
    }
    $("#ins-zonas").innerHTML = h;
  }

  function pintaCobertura() {
    var bl = $("#ins-blococob"), h2 = $("#ins-h2");
    if (!bl) return;
    if (!D.cert || !todas().length) {
      bl.hidden = true; if (h2) h2.textContent = T.h2; return;
    }
    bl.hidden = false; if (h2) h2.textContent = T.h2c;
    var t = todas(), h = "";
    for (var i = 0; i < t.length; i++) {
      var f = acha(t[i]), v = cobre[t[i]] || "tudo";
      h += '<div class="ins-cobre" style="display:flex;gap:10px;align-items:center;padding:9px 12px;' +
        'border:1px solid var(--line);border-radius:8px;background:var(--bg);margin-bottom:6px">' +
        "<b>" + esc(f.n) + '</b><span style="margin-left:auto;display:flex;gap:12px">' +
        '<label style="font-size:12px;display:flex;gap:5px;align-items:center"><input type="radio" name="cb_' +
        esc(t[i]) + '" value="tudo"' + (v === "tudo" ? " checked" : "") + "> " + esc(T.cob_tudo) + "</label>" +
        '<label style="font-size:12px;display:flex;gap:5px;align-items:center"><input type="radio" name="cb_' +
        esc(t[i]) + '" value="parte"' + (v === "parte" ? " checked" : "") + "> " + esc(T.cob_parte) +
        "</label></span></div>";
    }
    $("#ins-cobertura").innerHTML = h;
  }

  function linha(k, v) {
    return '<div><span class="k">' + esc(k) + "</span><span>" + v + "</span></div>";
  }

  function pintaResumo() {
    var f = $("#ins-f"), fd = new FormData(f), vaz = "<em>" + esc(T.v_vazio) + "</em>";
    var nome = fd.get("nome") || "", emp = fd.get("empresa") || "", como = fd.get("mostrar_como");
    var chips = function (a) {
      if (!a.length) return "<em>" + esc(T.v_nenhuma) + "</em>";
      return a.map(function (s) { return '<span class="ins-chip">' + esc(acha(s).n) + "</span>"; }).join("");
    };
    var h = linha(T.k_pais, esc(fd.get("pais")))
      + linha(T.k_nome, esc(nome) || vaz)
      + linha(T.k_email, esc(fd.get("email")) || vaz)
      + linha(T.k_tel, esc(fd.get("telefone")) || vaz)
      + linha(T.k_papel, esc(fd.get("papel")) || vaz)
      + linha(T.k_emp, esc(emp) || "<em>" + esc(T.v_sememp) + "</em>")
      + linha(T.k_mostrar, como === "empresa" ? (esc(emp) || vaz) : (esc(nome) || vaz))
      + linha(T.k_princ, principal ? '<span class="ins-chip p">' + esc(acha(principal).n) + "</span>" : vaz)
      + linha(T.k_sec, chips(sec))
      + linha(T.k_cond, $("#ins-aceite").checked
          ? esc(T.v_aceites.replace("{v}", f.querySelector('[name=condicoes_versao]').value))
          : "<em>" + esc(T.v_poraceitar) + "</em>");
    if (D.cert && todas().length) {
      h += linha(T.k_cob, todas().map(function (s) {
        return '<span class="ins-chip">' + esc(acha(s).n) + ": " +
               esc(cobre[s] === "parte" ? T.cob_parte : T.cob_tudo) + "</span>";
      }).join(""));
    }
    $("#ins-rev").innerHTML = h;
  }

  function sincroniza() {
    $("#ins-h-princ").value = principal ? acha(principal).n : "";
    $("#ins-h-extra").value = sec.map(function (s) { return acha(s).n; }).join(", ");
    $("#ins-h-cobre").value = D.cert
      ? todas().map(function (s) { return acha(s).n + "=" + (cobre[s] || "tudo"); }).join("; ") : "";
  }

  function tudo() {
    pintaVagas(); pintaPassos(); pintaRegioes(); pintaPrincipal(); pintaZonas();
    pintaCobertura(); sincroniza(); pintaResumo();
  }

  function valida(p) {
    if (p === 1) {
      var campos = [["ins-nome", T.q_nome], ["ins-email", T.q_email],
                    ["ins-tel", T.q_tel], ["ins-papel", T.q_papel]];
      for (var i = 0; i < campos.length; i++) {
        var el = $("#" + campos[i][0]);
        if (!el.value.trim()) {
          el.classList.add("mau"); el.focus();
          return T.e_falta.replace("{q}", campos[i][1]);
        }
        el.classList.remove("mau");
      }
      var em = $("#ins-email");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value.trim())) {
        em.classList.add("mau"); em.focus(); return T.e_email;
      }
      if (!principal) return T.e_princ;
      var mc = $("#ins-f").querySelector('[name=mostrar_como]:checked');
      if (mc && mc.value === "empresa" && !$("#ins-emp").value.trim()) return T.e_emp;
      return null;
    }
    if (p === 2 && !$("#ins-aceite").checked) return T.e_cond;
    return null;
  }

  function irPara(n) {
    if (n > passo) {
      for (var p = passo; p < n; p++) {
        var e = valida(p);
        var cx = $("#ins-e" + p);
        if (e) { cx.textContent = e; cx.setAttribute("data-on", "1"); return; }
        cx.setAttribute("data-on", "0");
      }
    }
    passo = n;
    var secs = document.querySelectorAll(".ins-passo");
    for (var i = 0; i < secs.length; i++) secs[i].hidden = Number(secs[i].dataset.p) !== passo;
    pintaPassos(); pintaResumo();
    var h = document.querySelector(".ins-passo:not([hidden]) h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    $("#ins-passos").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function abrir() {
    $("#ins-venda").hidden = true;
    $("#ins-f").hidden = false;
    $("#ins-passos").hidden = false;
    irPara(1);
  }

  $("#ins-abrir").onclick = abrir;
  $("#ins-regiao").onchange = function (e) { regiao = e.target.value; pintaZonas(); };
  $("#ins-zonas").onclick = function (e) {
    var b = e.target.closest(".ins-z"); if (!b || b.disabled) return;
    var s = b.dataset.s, i = sec.indexOf(s);
    if (!principal) { principal = s; if (i >= 0) sec.splice(i, 1); }
    else if (s === principal) { principal = null; }
    else if (i >= 0) { sec.splice(i, 1); delete cobre[s]; }
    else { sec.push(s); }
    tudo();
  };
  $("#ins-cobertura").onchange = function (e) {
    if (e.target.name && e.target.name.indexOf("cb_") === 0) {
      cobre[e.target.name.slice(3)] = e.target.value;
      sincroniza(); pintaResumo();
    }
  };
  var irs = document.querySelectorAll("[data-ir]");
  for (var i = 0; i < irs.length; i++) {
    (function (b) { b.onclick = function () { irPara(Number(b.dataset.ir)); }; })(irs[i]);
  }
  $("#ins-f").addEventListener("input", function () { sincroniza(); pintaResumo(); });
  $("#ins-f").addEventListener("change", function () { sincroniza(); pintaResumo(); });
  // ⚠️ A submissão é a do browser (POST ao Netlify). Aqui só se impede um envio com o
  // passo 1 ou 2 por validar — que é possível se alguém carregar em Enter no passo 3.
  $("#ins-f").addEventListener("submit", function (ev) {
    var err = valida(1) || valida(2);
    if (err) {
      ev.preventDefault();
      var cx = $("#ins-e3"); cx.textContent = err; cx.setAttribute("data-on", "1");
      return;
    }
    sincroniza();
  });

  tudo();
})();
