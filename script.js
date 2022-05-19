// selected all the elements for reference

const LOGIN_FORM_SECTION = document.querySelector(".login-section");
const LOGIN_FORM = document.querySelector("#login-form");
const SPIN_SECTION = document.querySelector(".spin-section");
const BTN_SPIN = document.querySelector("#spin");
const VIEW_PORT = document.querySelector(".view-port");
const EMAIL_INPUT = document.querySelector("#email");
const BTN_LOGIN = document.querySelector("#btn-login");
const IMG = document.querySelector("#selectedImg");

/// data for to be selected randomly when clicking on Spin button
const data = [
  { src: "kl-bag", value: 20 },
  { src: "kl-black-hoodie", value: 34 },
  { src: "kl-black-joggers", value: 32 },
  { src: "kl-hat", value: 29 },
  { src: "kl-pink-joggers", value: 90 },
  { src: "kl-white-tee", value: 57 },
];

// function to get random number from min to max in our case (0,5)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/// event listener function when click on Spin button
BTN_SPIN.addEventListener("click", async function () {
  // making api request and changing feedback accorindly
  document.querySelector("#feedback").innerHTML = "Try your luck";
  IMG.classList.add("loading");

  // checking if a user is logged in or not
  if (
    localStorage.getItem("auth") === null ||
    localStorage.getItem("auth") === undefined
  ) {
    // showing login form and hiding spin section if not logged in
    LOGIN_FORM_SECTION.classList.remove("hide");
    SPIN_SECTION.classList.add("hide");
  } else {
    // if logged in
    const random = getRandomInt(0, 5); //3
    const selectedImage = "./images/" + data[random].src + ".png";

    IMG.setAttribute("src", selectedImage);
    const selectedItem = data[random];

    // composing request object and configureations for sending request to api
    const options = {
      method: "POST",
      headers: {
        Accept: "text/html",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        data: `{"token": "RRftKA", "event": "Won Prize", "customer_properties": {"$email": "${localStorage.getItem(
          "auth"
        )}"}, "properties": {"item_name": "${selectedItem.src}","$value": ${
          selectedItem.value
        }}}`,
      }),
    };

    // making actualy api call with async/await paradigme

    const res = await fetch("https://a.klaviyo.com/api/track", options);

    const result = await res.json();
    IMG.classList.remove("loading");

    //// writing Congruations message upon successful posting of selected item
    if (result === 1) {
      document.querySelector("#feedback").innerHTML = "Congratulations";
    }
  }
});

///// even listener function of login functilaity
LOGIN_FORM.addEventListener("submit", async function (e) {
  e.preventDefault();

  //// login button feedback upon clicking LogIn
  BTN_LOGIN.innerHTML = "sending...";

  /// request sending configuations again
  const options = {
    method: "POST",
    headers: {
      Accept: "text/html",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      data: `{"token": "RRftKA","properties": {"$email":"${EMAIL_INPUT.value}"}}`,
    }),
  };

  // making api call to indentify the user

  const res = await fetch("https://a.klaviyo.com/api/identify", options);

  const result = await res.json();

  BTN_LOGIN.innerHTML = "Submit";

  // if success saving email in local store, hiding login form section and showing spin section
  if (result === 1) {
    localStorage.setItem("auth", EMAIL_INPUT.value);
    LOGIN_FORM_SECTION.classList.add("hide");
    SPIN_SECTION.classList.remove("hide");
  } else {
    // alerting user for Login Failed just in case if login failed
    alert("Login failed");
  }
});
