// handle new destination form input fields
document.getElementById("destinationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const destinationObj = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    location: document.getElementById("location").value,
    dateFrom: document.getElementById("dateFrom").value,
    dateTo: document.getElementById("dateTo").value,
  };
  console.log(destinationObj);
  const response = await createDestination(destinationObj);
  // If mongoose errors in the response, validate
  if (response.error) {
    if (response.error.title) {
      document.getElementById("titleError").textContent =
        response.error.title.message || "Invalii title";
    } else {
      document.getElementById("titleError").textContent = "";
    }
    if (response.error.description) {
      document.getElementById("descriptionError").textContent =
        response.error.description.message || "Invalid descrirption";
    } else {
      document.getElementById("descriptionError").textContent = "";
    }
  } else {
    // clear all error messages
    document.querySelectorAll(".errorMessage").forEach((error) => {
      error.textContent = "";
    });
    // clear all input fields
    document.querySelectorAll(".destinationField").forEach((field) => {
      field.value = "";
    });
    console.log("Form submitted successfully:", response);
  }
});

// send the new destination object to the api endpoint
async function createDestination(destination) {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/traveldestinations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(destination),
    });
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

// handle new user sign up form input fields
document.getElementById("signUpForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userObj = {
    firstname: document.getElementById("firstname").value,
    lastname: document.getElementById("lastname").value,
    username: document.getElementById("username").value,
    email: document.getElementById("signUpEmail").value,
    password: document.getElementById("signUpPassword").value,
    confirmPassword: document.getElementById("signUpConfirmPassword").value,
  };
  const password = document.getElementById("signUpPassword").value;
  const confirmPassword = document.getElementById("signUpConfirmPassword").value;

  // check for password confirmation before the user object is sent to the api endpoint
  if (password !== confirmPassword) {
    document.getElementById("signUpPasswordError").textContent = "Passwords do not match";
    document.getElementById("signUpConfirmPasswordError").textContent = "Passwords do not match";
    // end the function if passwords don't match
    return;
  }
  const response = await createUser(userObj);

  // If mongoose errors in the response, validate
  if (response.error) {
    console.log(response.error);
    if (response.error.firstname) {
      document.getElementById("firstnameError").textContent =
        response.error.firstname.message || "Invalid first name";
    } else {
      document.getElementById("firstnameError").textContent = "";
    }
    if (response.error.lastname) {
      document.getElementById("lastnameError").textContent =
        response.error.lastname.message || "Invalid last name";
    } else {
      document.getElementById("lastnameError").textContent = "";
    }
    if (response.error.username) {
      document.getElementById("usernameError").textContent =
        response.error.username.message || "Invalid user name";
    } else {
      document.getElementById("usernameError").textContent = "";
    }
    if (response.error.email) {
      document.getElementById("signUpEmailError").textContent =
        response.error.email.message || "Invalid email";
    } else {
      document.getElementById("signUpEmailError").textContent = "";
    }
    if (response.error.password) {
      document.getElementById("signUpPasswordError").textContent =
        response.error.password.message || "Invalid password";
    } else {
      document.getElementById("signUpPasswordError").textContent = "";
    }
  } else {
    // clear all error messages
    document.querySelectorAll(".errorMessage").forEach((error) => {
      error.textContent = "";
    });
    // clear all input fields
    // document.querySelectorAll(".signUpField").forEach((field) => {
    //   field.value = "";
    // });
    console.log("User registered successfully:", response);
  }
});

// send the new user object to the api endpoint
async function createUser(user) {
  try {
    const response = await fetch("http://127.0.0.1:8080/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}
