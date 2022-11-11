const socket = io();

// ELEMENTS
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("#msg");
const $messageFormBuutton = document.querySelector("#msg_btn");
const $sendLocationButton = document.querySelector("#send-location");
const $message = document.querySelector("#message");

//TEMPLATES
const messageTemplate = document.querySelector("#message-template").innerHTML;
const imageTemplate = document.querySelector("#image-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//OPTIONS
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// ----------------------------------------------------------------
const input = document.querySelector("#img");

const upload = (file) => {
  const formdata = new FormData();
  formdata.append("files", input.files[0]); //here 'files' atribute we can use anything
  // console.log(file)
  let reader = new FileReader();
  reader.onloadend = function () {
    // this will run after file is loded
    console.log(reader);
    socket.emit("avatar", reader.result);
  };
  reader.readAsDataURL(file); // after this upper function will run
  fetch("http://localhost:3000/avatar", {
    method: "post",
    mode: "no-cors",
    body: formdata,
  })
    .then((response) => {
      // console.log(response)
      return response.json();
    })
    .then((success) => console.log(success))
    .catch((error) => console.log(error));
};
const onSelectFile = () => upload(input.files[0]);

input.addEventListener("change", onSelectFile, false);
// ------------------------------------------------------------------

const autoscroll = () => {
  // New message element
  const $newMessage = $message.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $message.offsetHeight;

  // Height of messages container
  const containerHeight = $message.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $message.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset + 10) {
    $message.scrollTop = $message.scrollHeight;
  }
};

socket.on("send-image", (imageData) => {
  console.log("hello");
  console.log("img data->", imageData.text);
  const html = Mustache.render(imageTemplate, {
    username: imageData.username,
    msg: imageData.text,
    createdAt: moment(imageData.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
  document.querySelector("#img").value = "";
  autoscroll();
});

socket.on("personal-ui", () => {
  $message.scrollTop = $message.scrollHeight;
});

socket.on("message", (msg) => {
  console.log(msg);
  const html = Mustache.render(messageTemplate, {
    username: msg.username,
    msg: msg.text,
    createdAt: moment(msg.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("location-message", (location) => {
  console.log(location.url);
  const html = Mustache.render(locationTemplate, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format("h:mm a"),
  });
  $message.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("room", ({ room, users }) => {
  console.log(room, users);
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
});

$messageForm.addEventListener("submit", (event) => {
  event.preventDefault(); // it will prevent( અટકાવવું ) the form from submiting
  $messageFormBuutton.setAttribute("disabled", "disabled");

  // message = document.querySelector("#msg").value        // or like bellow we can acsses by its name(here massage)
  const message = event.target.elements.message.value;

  socket.emit("send", message, (error) => {
    $messageFormBuutton.removeAttribute("disabled");
    if (error) {
      return console.log(error);
    }
    console.log("diliverd");
  });
  $messageFormInput.value = "";
  $messageFormInput.focus();
});

$sendLocationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
  }

  $sendLocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("location shared");
        $sendLocationButton.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
