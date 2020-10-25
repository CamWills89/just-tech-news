async function upvoteClickHandler(event) {
  event.preventDefault();

  //this is grabbing the post_id from the url in the browser by splitting the
  //url string(converted with toString) into and array on the /, then selecting the
  //last item in the array as post_id
  const id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  //we can use the id variable (as post_id) in a fetch request and then check
  //the status of the request afterwards. But we need the user_id too
  const response = await fetch("/api/posts/upvote", {
    method: "PUT",
    body: JSON.stringify({
      post_id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector(".upvote-btn")
  .addEventListener("click", upvoteClickHandler);
