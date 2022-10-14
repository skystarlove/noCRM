/**
 * ****************************  Socket client ***********************************
 */
// importScripts("socketClient.js");
// importScripts("global.js");

SocketClient.getInstance().connect("ws://127.0.0.1:8080");
// SocketClient.getInstance().connect("wss://app.certalink.com/nocrm-server");
// SocketClient.getInstance().connect("wss://server.certalink.com/nocrm_server");

SocketClient.getInstance().addEventListener(
  SocketClient.EVENT.OPEN,
  function (event) {
    chrome.storage.local.set({
      conn: { state: "true", random: Math.random() },
    });
    // chrome.storage.local.get(null, (r) => {
    //   console.log("open event", r);
    //   if (r.auth) {
    //     SocketClient.getInstance().send("status", {
    //       user_id: r.auth.user_id,
    //       token: r.auth.token,
    //       slug: r.auth.slug,
    //     });
    //   }
    // });
    // send status
  }
);
chrome.runtime.setUninstallURL("https://certalink.com/feedback/");
SocketClient.getInstance().addEventListener(
  SocketClient.EVENT.CLOSE,
  function (event) {
    console.log("close event");
    chrome.storage.local.set({ state: "" });
    chrome.storage.local.set({
      conn: { state: "false", random: Math.random() },
    });
  }
);
SocketClient.getInstance().addEventListener(
  SocketClient.EVENT.MESSAGE,
  function (event) {
    const message = JSON.parse(event.data);
    console.log("message recieved", message);
    chrome.storage.local.set(message.data);

    switch (message.type) {
      case "error":
        chrome.storage.local.set(message.data);
        break;
      case "deals":
        console.log("deals messages", message.data);
        chrome.storage.local.set(message.data);
        chrome.storage.local.set({
          event: Math.random(),
        });
        break;
      case "loginFail":
        chrome.storage.local.set(message.data);
        chrome.storage.local.set({
          loginFailed: Math.random(),
        });
        break;
      case "loggedin":
        chrome.storage.local.set(message.data);
        SocketClient.getInstance().send("status", {
          user_id: message.data.auth.user_id,
          token: message.data.auth.token,
          slug: message.data.auth.slug,
        });
        break;
      case "status":
        console.log("status messages", message.data);
        chrome.storage.local.set(message.data);
        chrome.storage.local.set({
          event: Math.random(),
        });
        break;
    }
  }
);

/**
 * *************************** WebRequest Listner *******************************
 * It will be called at first and make session_token to be initialized.
 *
 */

/**
 * ************************** Local storage Change Listener *****************************
 * It is listener for UI.
 * Once user click, it will be called
 */
chrome.storage.onChanged.addListener((data) => {
  if (data.state) {
    if (data.state.newValue == "scanning") {
      startScaner(data.stateData.newValue);
    }
  } else if (data.user && data.user.newValue) {
    // send('status', { id: data.user.newValue })
  }
});
chrome.runtime.onMessage.addListener(function (message, sender) {
  console.log("actions", message.action);
  const actions = {
    login() {
      console.log(",,,,,,,,,,,,,,,,,,,,,send item serveral,,,,,,,,,,,,,,,,,,,,");
      SocketClient.getInstance().send("login", {
        email: message.email,
        password: message.password,
      });
    },
    status() {
      chrome.storage.local.get(null, (r) => {
        if (r.auth) {
          SocketClient.getInstance().send("status", {
            user_id: r.auth.user_id,
            token: r.auth.token,
            slug: r.auth.slug,
          });
        }
      });
    },
    deals() {
      console.log("deals send", message);
      SocketClient.getInstance().send("deals", {
        email: message.email,
        slug: message.slug,
        id: message.id,
        token: message.token,
      });
    },
    nextdeals() {
      console.log("deals send", message);
      SocketClient.getInstance().send("nextdeals", {
        slug: message.slug,
        token: message.token,
      });
    },
    createlead() {
      console.log("=========middle step========>>>>>>", message);
      SocketClient.getInstance().send("createlead", {
        title: message.title,
        description: message.description,
        amount: message.amount,
        slug: message.slug,
        token: message.token,
      });
    },
    logout() {
      console.log("logout send", message);
      SocketClient.getInstance().send("logout", {
        token: message.token,
        slug: message.slug,
      });
    },
  };
  actions[message.action] && actions[message.action]();
});
