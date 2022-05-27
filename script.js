// selected all the elements for reference

const apiKeyConsumer = `ck_8852c711cef4ad17f4ad29b1d47cc244158c89c9`;
// need to place consideration to hide secret key
const apiKeySecret = `cs_6ff05576b7061595dcaddea31de7f4c57bf1012c`;
let products = [];
document.addEventListener("DOMContentLoaded", async function (e) {
  //
  e.preventDefault();

  // getting products data from WooCommerece REST APi
  const res = await fetch(
    "https://shellective-woo.com/wp-json/wc/v3/products",
    {
      headers: {
        Authorization: "Basic " + btoa(`${apiKeyConsumer}:${apiKeySecret}`),
      },
    }
  );
  const data = await res.json();

  // saving returned prouducts in products varialbe
  products = [...data];
});

const LOGIN_FORM_SECTION = document.querySelector(".login-section");
const LOGIN_FORM = document.querySelector("#login-form");
const SPIN_SECTION = document.querySelector(".spin-section");
const BTN_SPIN = document.querySelector("#spin");
const VIEW_PORT = document.querySelector(".view-port");
const EMAIL_INPUT = document.querySelector("#email");
const BTN_LOGIN = document.querySelector("#btn-login");
const IMG = document.querySelector("#selectedImg");
const PRODUCT_NAME = document.querySelector("#product-name");

/// data for to be selected randomly when clicking on Spin button // using local storage // no longer required due to using WooAPI
// const data = [
//   { src: "kl-bag", value: 20 },
//   { src: "kl-black-hoodie", value: 34 },
//   { src: "kl-black-joggers", value: 32 },
//   { src: "kl-hat", value: 29 },
//   { src: "kl-pink-joggers", value: 90 },
//   { src: "kl-white-tee", value: 57 },
// ];

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
    /// considerdations being made for dynamic array length instead of defining static length, so we take method .length -1
    const random = getRandomInt(0, products.length - 1); //3

    // selecting images and item randomly from returned prducts that we have
    const selectedImage = products[random].images[0].src;

    IMG.setAttribute("src", selectedImage);
    const selectedItem = products[random];

    // composing request object and config for sending request to api
    const options = {
      method: "POST",
      headers: {
        Accept: "text/html",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        data: `{"token": "RRftKA", "event": "Won Prize", "customer_properties": {"$email": "${localStorage.getItem(
          "auth"
        )}","$image":"${selectedImage}"}, "properties": {"item_name": "${
          selectedItem.name
        }","$value": ${Number(selectedItem.price)}}}`,
      }),
    };

    // making actualy api call with async/await paradigme

    const res = await fetch("https://a.klaviyo.com/api/track", options);

    const result = await res.json();

    IMG.classList.remove("loading");
    PRODUCT_NAME.innerHTML = selectedItem.name;

    //// Writing success message displaying in the DOM, upon successful posting of selected item
    console.log(result);
    if (result === 1) {
      document.querySelector("#feedback").innerHTML = "Congratulations";
    }
  }
});

///// even listener function of login functionality
LOGIN_FORM.addEventListener("submit", async function (e) {
  e.preventDefault();

  //// login button feedback upon clicking LogIn
  BTN_LOGIN.innerHTML = "sending...";

  /// request sending config again
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

  // if success, saving email in local storage, hiding login form section and showing spin section
  if (result === 1) {
    localStorage.setItem("auth", EMAIL_INPUT.value);
    LOGIN_FORM_SECTION.classList.add("hide");
    SPIN_SECTION.classList.remove("hide");
  } else {
    // alerting user for Login Failed just in case if login failed
    alert("Login failed");
  }
});
