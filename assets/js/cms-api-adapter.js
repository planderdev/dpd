/* ────────────────────────────────────────────────────────────────
 * DPD CMS API 어댑터 (템플릿)
 *
 * 백엔드가 준비되면 이 파일의 endpoint 만 채우고, 관리자/프론트 페이지에서
 * cms-store.js 다음에 이 파일을 불러온다. 그러면 저장 위치가 브라우저
 * localStorage 에서 서버로 바뀐다. 화면 코드는 고치지 않는다.
 *
 *   <script src="assets/js/cms-store.js"></script>
 *   <script src="assets/js/cms-api-adapter.js"></script>
 *
 * 지금은 어느 페이지에서도 불러오지 않는다. 기본 저장소는 localStorage 다.
 *
 * 서버가 맞춰야 할 응답 구조는 cms-store.js 의 defaultData 와 같다.
 * 관리자 입력 필드와 프론트 출력이 같은 키를 쓰므로 키 이름을 바꾸면 안 된다.
 * ──────────────────────────────────────────────────────────────── */
(function (window) {
  "use strict";

  var store = window.DpdCmsStore;
  if (!store) return;

  var ENDPOINT = {
    database: "/api/cms/database",
    session: "/api/cms/session"
  };

  // store.getData() 가 동기 호출이라 서버 응답을 여기에 들고 있는다.
  var cache = null;
  var session = null;

  var request = function (url, options) {
    return window.fetch(url, Object.assign({
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    }, options || {})).then(function (response) {
      if (!response.ok) throw new Error(url + " responded " + response.status);
      return response.status === 204 ? null : response.json();
    });
  };

  var apiAdapter = {
    name: "api",

    hydrate: function () {
      return Promise.all([
        request(ENDPOINT.database).then(function (data) { cache = data; }),
        request(ENDPOINT.session).then(function (data) { session = data; }, function () { session = null; })
      ]);
    },

    read: function () {
      return cache;
    },

    // 화면은 즉시 갱신하고 전송은 뒤에서 진행한다. 실패하면 서버 상태를 다시 받아온다.
    write: function (database) {
      cache = database;
      request(ENDPOINT.database, {
        method: "PUT",
        body: JSON.stringify(database)
      }).catch(function (error) {
        console.error("CMS save failed:", error);
        apiAdapter.hydrate();
      });
    },

    clear: function () {
      cache = null;
      return request(ENDPOINT.database, { method: "DELETE" }).catch(function (error) {
        console.error("CMS reset failed:", error);
      });
    },

    readSession: function () {
      return session;
    },

    writeSession: function (value) {
      session = value;
    },

    clearSession: function () {
      session = null;
      request(ENDPOINT.session, { method: "DELETE" }).catch(function () {});
    },

    // 서버 인증은 비동기라 로그인 화면에서 store.ready() 이후 상태를 다시 확인해야 한다.
    // 여기서는 hydrate() 로 받아온 세션이 살아 있는지만 본다.
    authenticate: function () {
      return Boolean(session && session.loggedIn);
    },

    // 서버에는 storage 이벤트가 없으므로 주기적으로 updatedAt 을 확인한다.
    subscribe: function (handler) {
      var lastSeen = cache && cache.updatedAt;
      var timer = window.setInterval(function () {
        request(ENDPOINT.database).then(function (data) {
          if (!data || data.updatedAt === lastSeen) return;
          lastSeen = data.updatedAt;
          cache = data;
          handler();
        }).catch(function () {});
      }, 60000);
      return function () {
        window.clearInterval(timer);
      };
    }
  };

  store.useAdapter(apiAdapter);
})(window);
