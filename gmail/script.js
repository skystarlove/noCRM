"use strict";
chrome.storage.local.set({ pageLoad: 0 });
const utils = {
  // get first character of string after space javascript
  getAbbName(text) {
    var matches = text.match(/\b(\w)/g);
    var abb = (matches[0] ? matches[0] : "") + (matches[1] ? matches[1] : "");
    return abb.toUpperCase();
  },

  daysDiff(day, timeZone) {
    var today = new Date().toLocaleString("en", { timeZone: timeZone });
    today = new Date(today)
    var days = Math.round(day.getTime() / (3600 * 24 * 1000)); //days as integer from..
    var todays = Math.round(today.getTime() / (3600 * 24 * 1000)); //days as integer from..
    var daysDiff = days - todays; // exact dates
    return daysDiff;
  },

  // laksh - start
  /*  hoursDiff(day, timeZone) {
      console.log("laksh granular task hours minutes");
      console.log("day");
      console.log(day);
      var today = new Date().toLocaleString("en", { timeZone: timeZone });
      console.log("today1");
      console.log(today);
      today = new Date(today)
      console.log("today2");
      console.log(today);
      var days_minutes = Math.round(day.getTime() / (60 * 1000));
      // console.log("days_minutes:");
      // console.log(days_minutes);
      var todays_minutes = Math.round(today.getTime() / (60 * 1000));
      // console.log("todays_minutes:");
      // console.log(todays_minutes);
      var totalDiff = days_minutes - todays_minutes;
      // console.log("totalDiff:");
      // console.log(totalDiff);
      var hours = totalDiff / 60;
      hours = Math.abs(hours);
      hours = Math.floor(hours);
      // console.log("hours:");
      // console.log(hours);
      var minsRemainder = totalDiff % 60;
      minsRemainder = Math.abs(minsRemainder);
      // console.log("minsRemainder:");
      // console.log(minsRemainder);
      if ( totalDiff > 60 ) {
        var hoursDiff = "In " + hours + "h";
      } else if ( totalDiff < -60 ) {
        var hoursDiff = hours + "h late";
      } else if ( totalDiff > 0 || totalDiff > 60) {
        var hoursDiff = "In " + minsRemainder + "m";
      } else if ( totalDiff > -60  || totalDiff < 0 ) {
        var hoursDiff = minsRemainder + "m late";
      }
      // console.log("hoursDiff:");
      // console.log(hoursDiff);
      return hoursDiff;
    },*/

  /*  hoursDiff(remind_utc_time) {
      console.log("laksh granular task hours minutes");
      var remind_utc_time_array = remind_utc_time.split(":");
      var remind_hour = remind_utc_time_array[0];
      var remind_min = remind_utc_time_array[1];
      var current_d = new Date();
      var current_hour = current_d.getUTCHours();
      var current_min = current_d.getUTCMinutes();
      var hour_diff = remind_hour - current_hour;
      var min_diff = remind_min - current_min;
      if (hour_diff != 0) {
        if ( Math.sign(hour_diff) === 1 ) {
          var remain_Diff = "In " + hour_diff + "h";
        } else if ( Math.sign(hour_diff) === -1 ) {
          var remain_Diff = hour_diff + "h late";
        }
      } else if (hour_diff == 0) {
        if ( Math.sign(min_diff) === 1 ) {
          var remain_Diff = "In " + min_diff + "m";
        } else if ( Math.sign(min_diff) === -1 ) {
          var remain_Diff = min_diff + "m late";
        }
      }
      return remain_Diff;
    },*/

  hoursDiff(remind_time) {
    if(!remind_time) return
    console.log("laksh granular task hours minutes");
    var remind_time_array = remind_time?.split(":");
    var remind_hour = remind_time_array[0];
    var remind_min = remind_time_array[1];
    var current_d = new Date();
    var current_hour = current_d.getHours();
    var current_min = current_d.getMinutes();
    var hour_diff = remind_hour - current_hour;
    var min_diff = remind_min - current_min;
    // hour_diff = hour_diff - 1;
    if (hour_diff > 0) {
      if (Math.sign(hour_diff) === 1) {
        var remain_Diff = "In " + hour_diff + "h";
      } else if (Math.sign(hour_diff) === -1) {
        var remain_Diff = hour_diff + "h late";
      }
    } else if (hour_diff == 0) {
      if (Math.sign(min_diff) === 1) {
        var remain_Diff = "In " + min_diff + "m";
      } else if (Math.sign(min_diff) === -1) {
        var remain_Diff = min_diff + "m late";
      }
    }
    return remain_Diff;
  },
  // laksh - end

  numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  domChanged(changes) {
    // console.log(">>>>>>>>>>>dom_change>>>>>>>>>>>>>>");
    var isSplitViewEmail;
    changes.map((change) => {
      // console.log(">>>>>>>>>>>dom_change_map>>>>>>>>>>>>>>");
      change.addedNodes[0] &&
        change.addedNodes.forEach((node) => {
          // console.log(">>>>>>>>>>>dom_change_foreach>>>>>>>>>>>>>>");
          if (!auth.pageLoad) {
           // console.log(">>>>>>>>>>>>>dom_change......pageload>>>>>>>>>>>>>");
            var sdkNode = document.querySelectorAll(".global_app_sidebar");
            if (sdkNode.length > 0) {
              chrome.storage.local.set({ pageLoad: 1 });
              auth.pageLoad = true;
            }
          }
          if (
            (isSplitViewEmail = utils.splitViewEmail(node, change)) ||
            utils.normalViewEmail(node)
          ) {
          //  console.log(">>>>>>>>>>>>dom_change_gD..........>>>>>>>>>>>>");
            let userData = node.getElementsByClassName("gD")[0];
            if (userData) {
              auth.inboxEmail = userData.getAttribute("email");
              auth.inboxName = userData.getAttribute("name");
            }
            if (auth.loggedIn) {
              console.log("logedIn......................", userData);
              chrome.extension.sendMessage({
                action: "deals",
                email: auth.inboxEmail,
                id: auth.id,
                token: auth.token,
                slug: auth.slug,
              });
            }
            // Only Display when it's in individual messagebox
            certalinkView.children[0].children[3].children[1].style.display =
              window.location.hash.length > 30 ? "block" : "none";
            if (document.getElementById("messageView")) {
              document.getElementById("messageView").style.display =
                window.location.hash.length > 30 ? "block" : "none";
            }

            if (window.location.hash.length < 30)
              certalinkView.children[0].children[3].children[0].style.display =
                window.location.hash.length < 30 ? "block" : "none";
            if (document.getElementById("inboxView")) {
              document.getElementById("inboxView").style.display =
                window.location.hash.length < 30 ? "block" : "none";
            }
          }
        });
    });
  },
  hashChange(a) {
    // only display when it is in individual box
    if (document.getElementById("messageView"))
      document.getElementById("messageView").style.display =
        window.location.hash.length > 30 ? "block" : "none";
    if (document.getElementById("inboxView"))
      document.getElementById("inboxView").style.display =
        window.location.hash.length < 30 ? "block" : "none";
  },
  normalViewEmail(node) {
    return node.tagName == "TABLE" && node.className == "Bs nH iY bAt";
  },
  splitViewEmail(node, change) {
    return change.target.nodeName == "TR" && node.className == "Bu";
  },
  clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  },
  form2object(form) {
    var data = new FormData(form),
      result = {};
    // console.log(data);
    for (let pair of data.entries()) {
      result[pair[0]] = pair[1];
    }
    form.querySelectorAll("input, textarea").forEach((i) => (i.value = ""));
    form
      .querySelectorAll("select")
      .forEach((s) => (s.children[0].selected = true));
    return result;
  },
};
var fname;
var lname;
var email;
chrome.storage.local.get(null, (r) => {
  console.log("user", r.user);
  // console.log("email", r.user[0].email);
  // console.log("firstname", r.user[0].firstname);
  // console.log("lastname", r.user[0].lastname);
  fname = r.user[0].firstname;
  lname = r.user[0].lastname;
  email = r.user[0].email;
  if (r.auth) {
    chrome.extension.sendMessage({
      action: "status",
    });
  }
});
let observer = new MutationObserver(utils.domChanged);
observer.observe(document.body, { childList: true, subtree: true });
window.onhashchange = utils.hashChange;
const certalinkView = document.createElement("div"),
  messageView = document.createElement("div"),
  inboxView = document.createElement("div"),
  auth = {
    loggedIn: false,
    slug: "",
    token: "",
    id: 0,
    inboxEmail: "",
    inboxName: "",
    oneTimeSend: false,
  };

let menu;
fetch("chrome-extension://" + chrome.runtime.id + "/gmail/messageview.html", {
  credentials: "omit",
  referrerPolicy: "no-referrer-when-downgrade",
  body: null,
  method: "GET",
  mode: "cors",
})
  .then((r) => r.text())
  .then((html) => {
    messageView.innerHTML = html;
  });
fetch("chrome-extension://" + chrome.runtime.id + "/gmail/inboxview.html", {
  credentials: "omit",
  referrerPolicy: "no-referrer-when-downgrade",
  body: null,
  method: "GET",
  mode: "cors",
})
  .then((r) => r.text())
  .then((html) => {
    inboxView.innerHTML = html;
  });
fetch("chrome-extension://" + chrome.runtime.id + "/gmail/markup.html", {
  credentials: "omit",
  referrerPolicy: "no-referrer-when-downgrade",
  body: null,
  method: "GET",
  mode: "cors",
})
  .then((r) => r.text())
  .then((html) => {
    certalinkView.innerHTML = html;
    // chrome.storage.local.get(["user"], (r) => {

    chrome.storage.local.get(null, (r) => {
      if (r.auth) {
        auth.id = r.auth.user_id;
        auth.token = r.auth.token;
        auth.slug = r.auth.slug;
        auth.loggedIn = true;
        auth.time_zone = r.time_zone;
      }

      // NextDealHeader
      certalinkView.children[0].children[3].children[0].children[0].children[0].children[0].children[0].src =
        chrome.extension.getURL("/resources/images/exclamation.png");
      certalinkView.children[0].children[3].children[0].children[0].children[1].textContent =
        "There are no leads to do";

      // Coming Up Panel
      certalinkView.children[0].children[3].children[0].children[1].children[0].children[0].children[0].src =
        chrome.extension.getURL("/resources/images/clock.png");
      certalinkView.children[0].children[3].children[0].children[1].children[1].textContent =
        "There are no leads on stand by";

      certalinkView.children[0].children[2].style.display = auth.loggedIn
        ? "none"
        : "block";
      certalinkView.children[0].children[3].style.display = auth.loggedIn
        ? "block"
        : "none";
      certalinkView.children[0].children[3].children[0].style.display =
        window.location.hash.length < 30 ? "block" : "none";
      if (document.getElementById("inboxView")) {
        document.getElementById("inboxView").style.display =
          window.location.hash.length < 30 ? "block" : "none";
      }

      //certalinkView.children[0].children[4].style.display = auth.loggedIn
      //   ? "block"
      //   : "none";
    });
    // certalinkView.childNodes[0].childNodes[0].childNodes[0].src =
    //   chrome.runtime.getURL("resources/images/Logo240w.png");
  });

InboxSDK.load(2, "sdk_CertaLink_36058f05b1").then((sdk) => {
  // certalink = certalink.children;
  const el = document.createElement("div");

  el.innerHTML = certalinkView.innerHTML;
  sdk.Global.addSidebarContentPanel({
    iconUrl: chrome.runtime.getURL("resources/images/certalink32.png"),
    el,
  });
});

var refreshIntervalId = "";

document.addEventListener("click", function (e) {
  document.getElementById("menu").style.display = "none";
  switch (e.target.id) {
    case "loginButton":

      // console.log(">>>>========loginButton-active=========>>>>");
      let password = document.getElementById("loginPassword").value;
      let email = document.getElementById("loginMail").value;

      chrome.extension.sendMessage({
        action: "login",
        email: email,
        password: password,
      });
      //////////////////////////////////////////////
      document.getElementById("loginButton").innerHTML = "Signing in";
      refreshIntervalId = setInterval(function () {
        // console.log(">>>>========innerHTML=========>>>>", document.getElementById("loginButton").innerHTML);
        let count = (document.getElementById("loginButton").innerHTML.split(".").length - 1);
        // console.log(">>>>========count=========>>>>", count);
        if (count >= 5) {
          // console.log(">>>>========maxAmount=========>>>>");
          document.getElementById("loginButton").innerHTML = "Signing in";

        } else {
          let buttval = document.getElementById("loginButton").innerHTML + ".";
          // console.log(">>>>========loginButton-value=========>>>>", buttval);
          document.getElementById("loginButton").innerHTML = buttval;
        }
      }, 1000);

      // console.log("=========000refreshIntervalId000=========>>>>>>", refreshIntervalId);
      //////////////////////////////////////////////

      break;
    case "mainMenu":
      document.getElementById("menu").style.display = "block";
      break;
    case "newLeadButton":
      document.getElementById("newLeadForm").style.display = "block"
      document.getElementById("contentView").style.display = "none"
      document.getElementById("messageView").style.display = "none"; 
      break;
    case "createLeadbtn":
      // console.log(">>>>=========createButton-active============>>>>");
      let title = document.getElementById("leadName").value;
      // console.log(">>>>=========createButton-title============>>>>", title);
      let description = document.getElementById("leadDescription").value;
      // console.log(">>>>=========createButton-description============>>>>", description);
      let amount = document.getElementById("leadAmount").value;
      // console.log(">>>>=========createButton-amount============>>>>", amount);
      chrome.extension.sendMessage({
        action: "createlead",
        title: title,
        description: description,
        amount: amount,
        token: auth.token,
        slug: auth.slug,
      });
      break;
    case "collapseTodo":
      document.getElementById("todonoLeads").style.display = "none"
      document.getElementById("collapseTodo").style.display = "none"
      document.getElementById("expandTodo").style.display = "block";
      break;
    case "expandTodo":
      document.getElementById("collapseTodo").style.display = "block"
      document.getElementById("expandTodo").style.display = "none"
      document.getElementById("todonoLeads").style.display = "block";
      break;
    case "collapseStandby":
      document.getElementById("standbynoLeads").style.display = "none"
      document.getElementById("collapseStandby").style.display = "none"
      document.getElementById("expandStandby").style.display = "block";
      break;
    case "expandStandby":
      document.getElementById("collapseStandby").style.display = "block"
      document.getElementById("expandStandby").style.display = "none"
      document.getElementById("standbynoLeads").style.display = "block";
      break;

    case "logout":
      auth.loggedIn = false;
      chrome.storage.local.clear();

      chrome.extension.sendMessage({
        action: "logout",
        token: auth.token,
        slug: auth.slug,
      });
      auth.id = 0;
      auth.token = "";
      auth.slug = "";
      auth.loggedIn = false;
      auth.time_zone = ""
      document.getElementById("loginBlock").style.display = auth.loggedIn
        ? "none"
        : "block";
      document.getElementById("contentView").style.display = auth.loggedIn
        ? "block"
        : "none";
      document.getElementById("newLeadForm").style.display = auth.loggedIn
        ? "block"
        : "none";
      document.getElementById("newLeadButton").style.display = "none";
      document.getElementById("Div0").style.display = "none";
      setTimeout(function () {
        location.reload()
      }, 100);
      break;
    default:
      break;
  }
});

/**
 * ************************** Local storage Change Listener *****************************
 * It is listener for UI.
 * Once user click, it will be called
 */

chrome.storage.onChanged.addListener((data) => {
  chrome.storage.local.get(null, (r) => {
    if (auth.pageLoad) {
      if (r.loginFailed && data.loginFailed) {
        document.getElementById("loginMail").classList.add("failed");
        document.getElementById("loginPassword").classList.add("failed");
        document.getElementById("loginError").innerHTML =
          "Invalid login or password";
      } else {
        document.getElementById("loginMail").classList.remove("failed");
        document.getElementById("loginPassword").classList.remove("failed");
      }
      // console.log("something changed", data, r);
      if (r.auth) {
        document.getElementById("loginError").innerHTML = "";

        // laksh start
        // get header div
        const refElem = document.getElementsByClassName("header")[0];
        // avatar
        if (document.getElementById("Div0")) {
          document.getElementById("Div0").remove();
        }
        const picture = document.getElementsByClassName("gb_Ba gbii");
        const src = picture[0].src;
        const newNode0 = document.createElement("img");
        newNode0.setAttribute('src', src);
        newNode0.setAttribute('alt', 'na');
        newNode0.setAttribute('height', '24');
        newNode0.setAttribute('width', '24');
        newNode0.setAttribute("id", "Div0");
        // name
        if (document.getElementById("Div1")) {
          document.getElementById("Div1").remove();
        }
        const newNode1 = document.createElement("div");
        newNode1.setAttribute("id", "Div1");
        const textNode1 = document.createTextNode(r?.user[0].firstname + " " + r?.user[0].lastname);
        newNode1.appendChild(textNode1);
        // slug
        if (document.getElementById("Div2")) {
          document.getElementById("Div2").remove();
        }
        const newNode2 = document.createElement("div");
        newNode2.setAttribute("id", "Div2");
        const textNode2 = document.createTextNode(r.auth.slug + ".nocrm.io");
        newNode2.appendChild(textNode2);
        // add all 3 divs at end of header div
        refElem.insertAdjacentElement('beforeend', newNode0);
        refElem.insertAdjacentElement('beforeend', newNode1);
        refElem.insertAdjacentElement('beforeend', newNode2);
        // laksh end

        // laksh start
        // console.log("laksh start");
        var fieldsArray = r.fields;
        function compare(a, b) {
          if (a.position < b.position) {
            return -1;
          }
          if (a.position > b.position) {
            return 1;
          }
          return 0;
        }
        fieldsArray.sort(compare);
        // console.log(fieldsArray);
        var fieldsArrayLength = fieldsArray.length;
        var leadDescription = document.getElementById('leadDescription');
        leadDescription.value = '';
        // email sender details - start
        // var gD = document.getElementsByClassName('gD');
        // console.log("==========email===========>",email);
        // var email = gD[0]['dataset']['hovercardId'];
        // var fullname = gD[0]['innerText'];
        // var fullname_array = fullname.split(" ");
        // var fname = fullname_array[0];
        // var lname = fullname_array[1];
        // console.log("==========email===========>",email);
        // console.log("==========fullname===========>",fullname);
        // console.log("==========fullname_array===========>",fullname_array);
        // console.log("==========fname===========>",fname);
        // console.log("==========lname===========>",lname);
        // email sender details - end
        for (var i = 0; i < fieldsArrayLength; i++) {
          var truncatedfieldsArray = [];
          for (var key in fieldsArray[i]) {
            if (fieldsArray[i].hasOwnProperty(key)) {
              if (key == "name" || key == "type" || key == "position") {
                truncatedfieldsArray.push(fieldsArray[i][key]);
              }
            }
          }
          // console.log(truncatedfieldsArray);
          // fill in description box of new lead form
          var fieldName = fieldsArray[i]["name"];
          // console.log("-------fname--------", fname);
          // console.log("-------lname--------", lname);
          // console.log("-------email--------", email);
          if (fieldName == "First name") {
            leadDescription.value += fieldName + ": " + fname + "\n";
          } else if (fieldName == "Last name") {
            leadDescription.value += fieldName + ": " + lname + "\n";
          } else if (fieldName == "Email") {
            leadDescription.value += fieldName + ": " + email + "\n";
          } else {
            leadDescription.value += fieldName + ": \n";
          }
        }
        leadDescription.value += "\n";
        leadDescription.value += "--- Enter description below ---\n";

        /*for (var i = 0; i < stepsArrayLength; i++) {
            var pipelineArray = [];
            for (var key in stepsArray[i]["pipeline"]) {
                if (stepsArray[i]["pipeline"].hasOwnProperty(key)) {
                    if ( key == "name" || key == "id" || key == "is_default" ) {
                        pipelineArray.push(stepsArray[i]["pipeline"][key]);
                    }
                }
            }
            var truncatedstepsArray = [];
            for (var key in stepsArray[i]) {
                if (stepsArray[i].hasOwnProperty(key)) {
                    if ( key == "name" || key == "id" || key == "position" ) {
                        truncatedstepsArray.push(stepsArray[i][key]);
                    }
                }
            }
            truncatedstepsArray.push(pipelineArray);
            // console.log(truncatedstepsArray);
        }*/

        var stepsArray = r.steps;
        var stepsArrayLength = stepsArray.length;

        var stepsPipelineNamesArray = [];
        for (var i = 0; i < stepsArrayLength; i++) {
          for (var key in stepsArray[i]["pipeline"]["name"]) {
            stepsPipelineNamesArray.push(stepsArray[i]["pipeline"]["name"]);
          }
        }
        stepsPipelineNamesArray = stepsPipelineNamesArray.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });

        var stepsPipelineNamesArrayLength = stepsPipelineNamesArray.length;
        var leadStage = document.getElementById('leadStage');
        leadStage.innerHTML = "";
        var topOpt = document.createElement('option');
        topOpt.value = "null";
        topOpt.innerHTML = "Select a stage";
        leadStage.appendChild(topOpt);
        for (var i = 0; i < stepsPipelineNamesArrayLength; i++) {
          var currentPipelineName = stepsPipelineNamesArray[i];
          var truncatedStepsArray = [];
          for (var j = 0; j < stepsArrayLength; j++) {
            if (stepsArray[j]["pipeline"]["name"] == currentPipelineName) {
              truncatedStepsArray.push(stepsArray[j]);
            }
          }
          truncatedStepsArray.sort(compare);
          var optg = document.createElement('optgroup');
          optg.label = currentPipelineName;
          leadStage.appendChild(optg);
          var truncatedStepsArrayLength = truncatedStepsArray.length;
          for (var k = 0; k < truncatedStepsArrayLength; k++) {
            var opt = document.createElement('option');
            opt.value = truncatedStepsArray[k]["name"];
            opt.innerHTML = truncatedStepsArray[k]["name"];
            leadStage.appendChild(opt);
          }
        }

        console.log("laksh end");
        // laksh end

        auth.id = r.auth.user_id;
        auth.token = r.auth.token;
        auth.slug = r.auth.slug;
        auth.loggedIn = true;
        auth.time_zone = r.time_zone;
        if (data.auth && window.location.hash.length > 30) {
          chrome.extension.sendMessage({
            action: "deals",
            email: auth.inboxEmail,
            id: auth.id,
            token: auth.token,
            slug: auth.slug,
          });
        }
        if (data.auth && window.location.hash.length.length < 30)
          // console.log("nextdeal send request------->");
        if (document.getElementById("messageView")) {
          // Display Only Message view when you're in individual messagebox
          document.getElementById("messageView").style.display =
            window.location.hash.length > 30 ? "block" : "none"
          document.getElementById("newLeadButton").style.display = "inline-flex";
        }
        if (document.getElementById("inboxView")) {
          document.getElementById("inboxView").style.display =
            window.location.hash.length < 30 ? "block" : "none"
          document.getElementById("newLeadButton").style.display = "inline-flex";
        }
      }
      if (r.nextdeals) {
        if (r.nextdeals.length > 0) {
          utils.clearNode(
            document.getElementById("inboxView").children[0].children[1]
          );

          r.nextdeals.forEach((deal) => {
            var lead = inboxView.cloneNode(1);
            lead.children[0].children[0].textContent = deal.title;
            lead.children[0].children[0].href =
              "https://" + auth.slug + ".nocrm.io/leads/" + deal.id;
            let remain_days = deal.remind_date
              ? utils.daysDiff(new Date(deal.remind_date), auth.time_zone)
              : null;
            
            lead.children[0].children[1].textContent = "";
            if (remain_days == 0) {
              // laksh - start
              /*let remain_hours_minutes = deal.remind_date
                ? utils.hoursDiff(new Date(deal.remind_date), auth.time_zone)
                : null;*/
              // console.log("Today");
              // let remain_hours_minutes = utils.hoursDiff(new Date(deal.remind_date), auth.time_zone);
                //10-13 modified
            //  let remain_hours_minutes = utils.hoursDiff(deal?.remind_time);
              // laksh - end
              // lead.children[0].children[1].textContent = "Today";
              // lead.children[0].children[1].textContent = deal.remind_time;
                //10-13 modified
            //  lead.children[0].children[1].textContent = remain_hours_minutes;
             lead.children[0].children[1].textContent = "Today";
            }
            else if (remain_days > 0)
              lead.children[0].children[1].textContent =
                "In " + remain_days + "d";
            if (remain_days < 0)
              lead.children[0].children[1].textContent =
                Math.abs(remain_days) + "d late";

            // console.log("certalinkview whats next ", certalinkView.children[0].children[3].children[0].children[1]);
            certalinkView.children[0].children[3].children[0].children[0].children[1].appendChild(
              lead
            );

            certalinkView.children[0].children[3].children[0].children[0].children[0].children[1].textContent =
              r.nextdeals.length;
            // console.log(">>++++++++number++++++++>>", r.nextdeals.length);
            if (document.getElementById("inboxView")) {
              document
                .getElementById("inboxView")
                .children[0].children[1].appendChild(lead);
              document.getElementById(
                "inboxView"
              ).children[0].children[0].children[3].textContent =
                r.nextdeals.length;
            }
          });
        }
      }
      if (r.comingdeals) {
        if (r.comingdeals.length > 0) {
          utils.clearNode(
            document.getElementById("inboxView").children[1].children[1]
          );

          r.comingdeals.forEach((deal) => {
            var lead = inboxView.cloneNode(1);
            lead.children[0].children[0].textContent = deal.title;
            lead.children[0].children[0].href =
              "https://" + auth.slug + ".nocrm.io/leads/" + deal.id;
            let remain_days = deal.remind_date
              ? utils.daysDiff(new Date(deal.remind_date))
              : null;
            lead.children[0].children[1].textContent = "";
            if (remain_days == 0) {
              // laksh - start
              /*let remain_hours_minutes = deal.remind_date
                ? utils.hoursDiff(new Date(deal.remind_date), auth.time_zone)
                : null;*/
              // console.log("Today");
              // let remain_hours_minutes = utils.hoursDiff(new Date(deal.remind_date), auth.time_zone);
              let remain_hours_minutes = utils.hoursDiff(deal?.remind_time);
              // laksh - end
              // lead.children[0].children[1].textContent = "Today";
              // lead.children[0].children[1].textContent = deal.remind_time;
              lead.children[0].children[1].textContent = remain_hours_minutes;
            }
            else if (remain_days > 0)
              lead.children[0].children[1].textContent =
                "In " + remain_days + "d";
            if (remain_days < 0)
              lead.children[0].children[1].textContent =
                Math.abs(remain_days) + "d late";
            certalinkView.children[0].children[3].children[0].children[1].appendChild(
              lead
            );

            certalinkView.children[0].children[3].children[0].children[0].children[0].children[1].textContent =
              r.comingdeals.length;
            if (document.getElementById("inboxView")) {
              document
                .getElementById("inboxView")
                .children[1].children[1].appendChild(lead);
              document.getElementById(
                "inboxView"
              ).children[1].children[0].children[3].textContent =
                r.comingdeals.length;
            }
          });
        }
      }
      if (r.deals) 
      {
        if (r.deals.length > 0) {
          utils.clearNode(document.getElementById("messageView"));
          r.deals.forEach((deal) => {
            var lead = messageView.cloneNode(1);

            // status standby or todo
            deal.status == "todo" ? lead.children[0].classList.add("todo") : "";
            deal.status == "standby"
              ? lead.children[0].classList.add("standby")
              : "";

            // // Name of Abbrebiation
            lead.children[0].children[0].children[0].children[0].textContent = r
              .names[deal.user_id]
              ? utils.getAbbName(r.names[deal.user_id])
              : "?";

            // Lead Title
            lead.children[0].children[0].children[0].children[1].textContent =
              deal.title;
            lead.children[0].children[0].children[0].children[1].href =
              "https://" + auth.slug + ".nocrm.io/leads/" + deal.id;

            // Date Time
            lead.children[0].children[1].children[0].children[0].textContent =
              deal.estimated_closing_date ? deal.estimated_closing_date : "";

            // Lead Detail
            // lead.children[0].children[0].children[1].children[0].children[0].src =
            //   chrome.extension.getURL("/resources/images/starred.png");

            // starred image
            lead.children[0].children[0].children[1].children[0].src =
              deal.starred
                ? chrome.extension.getURL("/resources/images/starred.png")
                : chrome.extension.getURL("/resources/images/star.png");

            // laksh - start
            // tags display
            // console.log("lakshtest" + deal.tags);
            // avoid repetition
            /*if ( document.getElementById("tagDisplay") ) {
              document.getElementById("tagDisplay").remove();
            }*/
            // create div
            const tagDisplay = document.createElement("div");
            tagDisplay.setAttribute("id", "tagDisplay");
            // add tags text to the div
            var tagArr = deal.tags;
            var arrayLength = tagArr.length;
            for (var i = 0; i < arrayLength; i++) {
              // console.log(tagArr[i]);
              const tagSpan = document.createElement("span");
              const tagText = document.createTextNode(tagArr[i]);
              tagSpan.appendChild(tagText);
              tagDisplay.insertAdjacentElement('beforeend', tagSpan);
            }
            // add div at end of lead (parent) div
            // lead.insertAdjacentElement('beforeend', tagDisplay);
            // add div in middle of lead box
            if (lead.children[0].children[1]) {
              const aftertitle = lead.children[0].children[1];
              aftertitle.insertAdjacentElement('afterbegin', tagDisplay);
            }

            /*if ( lead.children[0].children[0] ) {
              function nodeToString ( node ) {
                 var tmpNode = document.createElement( "div" );
                 tmpNode.appendChild( node.cloneNode( true ) );
                 var str = tmpNode.innerHTML;
                 tmpNode = node = null; // prevent memory leaks in IE
                 return str;
              }
              var escapedStr = nodeToString( tagDisplay ).replace( "<" , "&lt;" ).replace( ">" , "&gt;");
              tagDisplay.innerHTML += escapedStr;
              lead.children[0].children[1].children[0].children[0].innerHTML = deal.tagDisplay;
            }*/
            // console.log("lakshtest4" + tagDisplay);
            // console.log("lakshtest5" + lead);
            // laksh - end

            // Remind Date
            let remain_days = deal.remind_date
              ? utils.daysDiff(new Date(deal.remind_date))
              : null;
            if (remain_days == 0) {
              // laksh - start
              /*let remain_hours_minutes = deal.remind_date
                ? utils.hoursDiff(new Date(deal.remind_date), auth.time_zone)
                : null;*/
              // console.log("Today");
              // let remain_hours_minutes = utils.hoursDiff(new Date(deal.remind_date), auth.time_zone);
              let remain_hours_minutes = utils.hoursDiff(deal?.remind_time);
              // laksh - end
              /*lead.children[0].children[2].children[1].children[0].textContent =
                "Today";
              lead.children[0].children[2].children[1].children[0].classList.add(
                "today"
              );*/
              /*lead.children[0].children[2].children[1].children[0].textContent =
                deal.remind_time;
              lead.children[0].children[2].children[1].children[0].classList.add(
                deal.remind_time
              );*/
              lead.children[0].children[2].children[1].children[0].textContent =
                remain_hours_minutes;
              lead.children[0].children[2].children[1].children[0].classList.add(
                remain_hours_minutes
              );
            } else if (remain_days > 0) {
              lead.children[0].children[2].children[1].children[0].classList.add(
                "future"
              );
              lead.children[0].children[2].children[1].children[0].textContent =
                "in " + remain_days + "d";
            } else if (remain_days < 0) {
              lead.children[0].children[2].children[1].children[0].classList.add(
                "past"
              );
              lead.children[0].children[2].children[1].children[0].textContent =
                Math.abs(remain_days) + "d late";
            }
            // Deal Amount
            var dealAmount = deal.currency ? deal.currency + " " : " ";
            if (deal.amount) dealAmount += utils.numberWithCommas(deal.amount);
            if (deal.probability) dealAmount += " (" + deal.probability + "%)";
            lead.children[0].children[2].children[0].children[0].textContent =
              dealAmount;

            certalinkView.children[0].children[3].children[1].appendChild(lead);
            if (document.getElementById("messageView"))
              document.getElementById("messageView").appendChild(lead);
            if (deal.status == "standby") {
              lead.children[0].children[2].classList.add("leadFooterStandby");
              lead.children[0].children[2].classList.remove("leadFooterTodo");
            } else if (deal.status == "todo") {
              lead.children[0].children[2].classList.remove(
                "leadFooterStandby"
              );
              lead.children[0].children[2].classList.add("leadFooterTodo");
            }
          });
        } 
        else {
          utils.clearNode(document.getElementById("messageView"));
          var lead = document.createElement("div");
          lead.innerHTML = "There are no leads associated with this contact.";
          lead.classList.add("messageView");
          if (document.getElementById("messageView"))
            document.getElementById("messageView").appendChild(lead)
          document.getElementById("newLeadButton").style.display = "inline-flex";
        }
      }
      /////////////// 10/05/2022 //////////////////

      if (document.getElementById("loginBlock") && document.getElementById("loginBlock").style.display == "block" && auth.loggedIn) {
        document.getElementById("loginBlock").style.display = "none";
        clearInterval(refreshIntervalId);
        setTimeout(function () {
          location.reload()
        }, 100);
      }
      if (document.getElementById("contentView")) {
        document.getElementById("contentView").style.display = auth.loggedIn
          ? "block"
          : "none";
      }
    }
  });
});