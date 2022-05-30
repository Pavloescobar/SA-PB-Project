// selected all the elements for reference

// the form to get apikey and apiSecert from the user
CONFIG_FORM.addEventListener("submit", async function (event) {
  event.preventDefault();

  const data = {
    apiKey: API_KEY_INPUT.value,
    apiSecret: API_SECRET_INPUT.value,
  };

  const res = await fetch(
    "https://shellective-woo.com/wp-json/wc/v3/products",
    {
      headers: {
        Authorization:
          "Basic " + btoa(`${API_KEY_INPUT.value}:${API_SECRET_INPUT.value}`),
      },
    }
  );
  const returnedData = await res.json();

  CONFIG_FORM.style.display = "none";

  // saving returned prouducts in products varialbe
  products = [...returnedData];
});

// added a general function to to do data request and catch data back
async function apiCall(url, body) {
  const options = {
    method: "POST",
    headers: {
      Accept: "text/html",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  };
  const res = await fetch(url, options);
  const returnedData = await res.json();
  return returnedData;
}

// commented  the keys and secrete as we are getting it from user

// const apiKeyConsumer = `ck_8852c711cef4ad17f4ad29b1d47cc244158c89c9`;
// const apiKeySecret = `cs_6ff05576b7061595dcaddea31de7f4c57bf1012c`;
let products = [];
document.addEventListener("DOMContentLoaded", async function (e) {
  //
  e.preventDefault();

  // getting products data from WooCommerece REST APi
});

// function to get random number from min to max in our case (0,5)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/// event listener function when click on Spin button
BTN_SPIN.addEventListener("click", async function () {
  // making api request and changing feedback accorindly
  FEEDBACK_CONTAINER.innerHTML = "Try your luck";
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
    const random = getRandomInt(0, products.length - 1); //3

    // selecting images and item randomily from returned prducts that we have
    const selectedImage = products[random].images[0].src;

    //

    IMG.setAttribute("src", "./images/loading.gif");
    PRODUCT_NAME.innerHTML = "loading...";
    const selectedItem = products[random];

    // composing request object and config for sending request to api

    const body = new URLSearchParams({
      data: `{
				"token": "RRftKA", 
				"event": "Won Prize",
				"customer_properties": {
					"$email": "${localStorage.getItem("auth")}"
				}, 
				"properties": {
					"item_name": "${selectedItem.name}",
					"prize_image": "${selectedImage}",
					"$value": ${Number(selectedItem.price)}
				}
			}`,
    });

    // making actual api call with async/await paradigme
    const result = await apiCall("https://a.klaviyo.com/api/track", body);

    IMG.classList.remove("loading");
    PRODUCT_NAME.innerHTML = selectedItem.name;
    IMG.setAttribute("src", selectedImage);

    //// writing congrats message upon successful posting of selected item
    console.log(result);
    if (result === 1) {
      FEEDBACK_CONTAINER.innerHTML = "Congratulations";
    }
  }
});

///// event listener function of login functionality
LOGIN_FORM.addEventListener("submit", async function (e) {
  e.preventDefault();

  //// login button feedback upon clicking LogIn
  BTN_LOGIN.innerHTML = "sending...";

  /// request sending config again

  const body = new URLSearchParams({
    data: `{"token": "RRftKA","properties": {"$email":"${EMAIL_INPUT.value}"}}`,
  });

  // making api call to indentify the user
  const result = await apiCall("https://a.klaviyo.com/api/identify", body);

  BTN_LOGIN.innerHTML = "Submit";

  // if success saving email in local storage, hiding login form section and showing spin section
  if (result === 1) {
    localStorage.setItem("auth", EMAIL_INPUT.value);
    LOGIN_FORM_SECTION.classList.add("hide");
    SPIN_SECTION.classList.remove("hide");
  } else {
    // alerting user for Login Failed just in case if login failed
    alert("Login failed");
  }
});
