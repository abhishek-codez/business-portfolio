const API_BASE_URL = "http://localhost:3000/api";

let currentUser = null;
let authToken = null;

document.addEventListener("DOMContentLoaded", function () {
  initializeMockData();
  checkAuth();
  setupEventListeners();
  initializeDatePicker();
  setupServiceCards();
  setupAuthAnimation();
  setupFormValidation();
  setupFooterLinks();
  setupRealTimeValidation();
});

function setupFormValidation() {
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const phone = document.getElementById("signup-phone").value;
      const address = document.getElementById("signup-address").value;
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById(
        "signup-confirm-password",
      ).value;

      let isValid = true;
      let errorMessage = "";
      let errorField = null;

      if (!validateName(name)) {
        isValid = false;
        errorMessage = "Please enter a valid full name (minimum 3 characters)";
        errorField = document.getElementById("signup-name");
        errorField.style.borderBottomColor = "#ff3860";
      } else {
        document.getElementById("signup-name").style.borderBottomColor = "";
      }

      if (!validateEmail(email)) {
        isValid = false;
        errorMessage =
          "Please enter a valid email address (e.g., name@gmail.com)";
        errorField = document.getElementById("signup-email");
        errorField.style.borderBottomColor = "#ff3860";
      } else {
        document.getElementById("signup-email").style.borderBottomColor = "";
      }

      if (!validatePhone(phone)) {
        isValid = false;
        errorMessage = "Please enter a valid 10-digit phone number";
        errorField = document.getElementById("signup-phone");
        errorField.style.borderBottomColor = "#ff3860";
      } else {
        document.getElementById("signup-phone").style.borderBottomColor = "";
      }

      if (!validateAddress(address)) {
        isValid = false;
        errorMessage = "Please enter a valid address (minimum 10 characters)";
        errorField = document.getElementById("signup-address");
        errorField.style.borderBottomColor = "#ff3860";
      } else {
        document.getElementById("signup-address").style.borderBottomColor = "";
      }

      if (password !== confirmPassword) {
        isValid = false;
        errorMessage = "Passwords do not match";
        document.getElementById("signup-password").style.borderBottomColor =
          "#ff3860";
        document.getElementById(
          "signup-confirm-password",
        ).style.borderBottomColor = "#ff3860";
      } else {
        document.getElementById("signup-password").style.borderBottomColor = "";
        document.getElementById(
          "signup-confirm-password",
        ).style.borderBottomColor = "";
      }

      if (!validatePassword(password)) {
        isValid = false;
        errorMessage = "Password must be at least 6 characters long";
        document.getElementById("signup-password").style.borderBottomColor =
          "#ff3860";
        document.getElementById(
          "signup-confirm-password",
        ).style.borderBottomColor = "#ff3860";
      }

      if (!isValid) {
        showNotification(errorMessage, "error");

        if (errorField) {
          errorField.style.animation = "shake 0.5s ease-in-out";
          setTimeout(() => {
            errorField.style.animation = "";
          }, 500);
        }

        return false;
      }

      handleSignup(e);
      return true;
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      let isValid = true;
      let errorMessage = "";

      if (!validateEmail(email)) {
        isValid = false;
        errorMessage =
          "Please enter a valid email address (e.g., name@gmail.com)";
        document.getElementById("login-email").style.borderBottomColor =
          "#ff3860";
        document.getElementById("login-email").style.animation =
          "shake 0.5s ease-in-out";
        setTimeout(() => {
          document.getElementById("login-email").style.animation = "";
        }, 500);
      } else {
        document.getElementById("login-email").style.borderBottomColor = "";
      }

      if (!password) {
        isValid = false;
        errorMessage = "Please enter your password";
        document.getElementById("login-password").style.borderBottomColor =
          "#ff3860";
        document.getElementById("login-password").style.animation =
          "shake 0.5s ease-in-out";
        setTimeout(() => {
          document.getElementById("login-password").style.animation = "";
        }, 500);
      } else {
        document.getElementById("login-password").style.borderBottomColor = "";
      }

      if (!isValid) {
        showNotification(errorMessage, "error");
        return false;
      }

      handleLogin(e);
      return true;
    });
  }

  const editProfileForm = document.getElementById("edit-profile-form");
  if (editProfileForm) {
    editProfileForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("edit-name").value;
      const phone = document.getElementById("edit-phone").value;
      const address = document.getElementById("edit-address").value;
      const password = document.getElementById("edit-password").value;
      const confirmPassword = document.getElementById(
        "edit-confirm-password",
      ).value;

      let isValid = true;
      let errorMessage = "";

      if (!validateName(name)) {
        isValid = false;
        errorMessage = "Please enter a valid full name (minimum 3 characters)";
        document.getElementById("edit-name").style.borderBottomColor =
          "#ff3860";
      } else {
        document.getElementById("edit-name").style.borderBottomColor = "";
      }

      if (!validatePhone(phone)) {
        isValid = false;
        errorMessage = "Please enter a valid 10-digit phone number";
        document.getElementById("edit-phone").style.borderBottomColor =
          "#ff3860";
      } else {
        document.getElementById("edit-phone").style.borderBottomColor = "";
      }

      if (!validateAddress(address)) {
        isValid = false;
        errorMessage = "Please enter a valid address (minimum 10 characters)";
        document.getElementById("edit-address").style.borderBottomColor =
          "#ff3860";
      } else {
        document.getElementById("edit-address").style.borderBottomColor = "";
      }

      if (password && password !== confirmPassword) {
        isValid = false;
        errorMessage = "Passwords do not match";
        document.getElementById("edit-password").style.borderBottomColor =
          "#ff3860";
        document.getElementById(
          "edit-confirm-password",
        ).style.borderBottomColor = "#ff3860";
      } else {
        document.getElementById("edit-password").style.borderBottomColor = "";
        document.getElementById(
          "edit-confirm-password",
        ).style.borderBottomColor = "";
      }

      if (password && !validatePassword(password)) {
        isValid = false;
        errorMessage = "Password must be at least 6 characters long";
        document.getElementById("edit-password").style.borderBottomColor =
          "#ff3860";
        document.getElementById(
          "edit-confirm-password",
        ).style.borderBottomColor = "#ff3860";
      }

      if (!isValid) {
        showNotification(errorMessage, "error");
        return false;
      }

      handleEditProfile(e);
      return true;
    });
  }
}

function validateName(name) {
  return name && name.trim().length >= 3;
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  if (email.includes("..")) {
    return false;
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return false;
  }

  const domain = parts[1];
  if (domain.length < 4 || domain.length > 255) {
    return false;
  }

  return true;
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  return /^[0-9]{10}$/.test(cleaned);
}

function validateAddress(address) {
  return address && address.trim().length >= 10;
}

function validatePassword(password) {
  return password.length >= 6;
}

function setupAuthAnimation() {
  const container = document.querySelector("#auth-forms .container");
  const LoginLink = document.querySelector(".SignInLink");
  const RegisterLink = document.querySelector(".SignUpLink");

  if (RegisterLink) {
    RegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      container.classList.add("active");
      resetFormStyles();
    });
  }

  if (LoginLink) {
    LoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      container.classList.remove("active");
      resetFormStyles();
    });
  }
}

function setupFooterLinks() {
  document.querySelectorAll(".footer-section a[data-page]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentUser) {
        const page = e.target.getAttribute("data-page");
        switchPage(page);
      } else {
        showNotification("Please login first", "error");
      }
    });
  });
}

function resetFormStyles() {
  document
    .querySelectorAll("#auth-forms input, #auth-forms textarea")
    .forEach((input) => {
      input.style.borderBottomColor = "";
      input.style.animation = "";
    });
}

function initializeMockData() {
  if (window.location.hash === "#mock") {
    currentUser = {
      id: "mock-user-123",
      name: "Test User",
      email: "test@example.com",
      phone: "9876543210",
      address: "123 Test Street, Test City",
      walletBalance: 1500,
      createdAt: new Date().toISOString(),
    };

    authToken = "mock-jwt-token-12345";

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(currentUser));

    showMainApp();
    loadUserData();

    showNotification("Using mock data for testing", "success");

    window.mockDataEnabled = true;

    if (typeof fetch !== "function") return;

    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      if (url.includes("/api/")) {
        console.log("Mocking API call:", url);

        if (url.includes("/api/auth/login") && options?.method === "POST") {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                token: "mock-jwt-token-12345",
                user: currentUser,
              }),
          });
        }

        if (url.includes("/api/auth/signup") && options?.method === "POST") {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                token: "mock-jwt-token-12345",
                user: currentUser,
              }),
          });
        }

        if (url.includes("/api/orders") && options?.method !== "POST") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockOrdersForTesting()),
          });
        }

        if (url.includes("/api/feedback") && options?.method === "GET") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockFeedbackForTesting()),
          });
        }

        if (url.includes("/api/users/profile")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(currentUser),
          });
        }

        if (url.includes("/api/users/transactions")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }

        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: "Backend not connected" }),
        });
      }

      return originalFetch.apply(this, arguments);
    };
  }
}

function mockOrdersForTesting() {
  if (!currentUser) return [];

  return [
    {
      _id: "order-mock-001",
      serviceType: "wash-fold",
      weight: 5,
      totalAmount: 750,
      pickupDate: new Date(),
      pickupTime: "9am-11am",
      address: "123 Test Street",
      createdAt: new Date(),
      express: false,
      status: "completed",
    },
    {
      _id: "order-mock-002",
      serviceType: "dry-clean",
      weight: 3,
      totalAmount: 750,
      pickupDate: new Date(Date.now() + 86400000),
      pickupTime: "3pm-5pm",
      address: "123 Test Street",
      createdAt: new Date(Date.now() - 86400000),
      express: true,
      status: "processing",
    },
  ];
}

function mockFeedbackForTesting() {
  if (!currentUser) return [];

  return [
    {
      _id: "feedback-mock-001",
      orderDetails: "Order #mock-001 - Wash & Fold - ₹750",
      rating: 5,
      comments: "Excellent service!",
      serviceQuality: 5,
      recommend: "yes",
      createdAt: new Date(Date.now() - 172800000),
    },
    {
      _id: "feedback-mock-002",
      orderDetails: "Order #mock-002 - Dry Cleaning - ₹750",
      rating: 4,
      comments: "Good service overall",
      serviceQuality: 4,
      recommend: "yes",
      createdAt: new Date(Date.now() - 86400000),
    },
  ];
}

async function handleLogin(e) {
  if (e && e.preventDefault) e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    showNotification("Please enter email and password", "error");
    return;
  }

  if (!validateEmail(email)) {
    showNotification(
      "Please enter a valid email address (e.g., name@gmail.com)",
      "error",
    );
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (window.mockDataEnabled || window.location.hash === "#mock") {
        authToken = "mock-jwt-token-12345";
        currentUser = {
          id: "mock-user-123",
          name: "Test User",
          email: email,
          phone: "9876543210",
          address: "123 Test Street, Test City",
          walletBalance: 1500,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("authToken", authToken);
        localStorage.setItem("user", JSON.stringify(currentUser));

        showMainApp();
        loadUserData();
        showNotification("Login successful (using mock data)!", "success");
        return;
      }
      throw new Error(data.message || "Login failed");
    }

    authToken = data.token;
    currentUser = data.user;

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(currentUser));

    showMainApp();
    loadUserData();
    showNotification("Login successful!", "success");
  } catch (error) {
    console.error("Login error:", error);
    showNotification(
      error.message || "Login failed. Please try again.",
      "error",
    );
  }
}

async function handleSignup(e) {
  if (e && e.preventDefault) e.preventDefault();

  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const phone = document.getElementById("signup-phone").value;
  const address = document.getElementById("signup-address").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById(
    "signup-confirm-password",
  ).value;

  if (!validateName(name)) {
    showNotification(
      "Please enter a valid full name (minimum 3 characters)",
      "error",
    );
    return;
  }

  if (!validateEmail(email)) {
    showNotification(
      "Please enter a valid email address (e.g., name@gmail.com)",
      "error",
    );
    return;
  }

  if (!validatePhone(phone)) {
    showNotification("Please enter a valid 10-digit phone number", "error");
    return;
  }

  if (!validateAddress(address)) {
    showNotification(
      "Please enter a valid address (minimum 10 characters)",
      "error",
    );
    return;
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error");
    return;
  }

  if (!validatePassword(password)) {
    showNotification("Password must be at least 6 characters long", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        address,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (window.mockDataEnabled || window.location.hash === "#mock") {
        authToken = "mock-jwt-token-12345";
        currentUser = {
          id: "mock-user-" + Date.now(),
          name: name,
          email: email,
          phone: phone,
          address: address,
          walletBalance: 500,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("authToken", authToken);
        localStorage.setItem("user", JSON.stringify(currentUser));

        showMainApp();
        loadUserData();
        showNotification(
          "Account created successfully (using mock data)!",
          "success",
        );
        return;
      }
      throw new Error(data.message || "Signup failed");
    }

    authToken = data.token;
    currentUser = data.user;

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("user", JSON.stringify(currentUser));

    showMainApp();
    loadUserData();
    showNotification("Account created successfully!", "success");
  } catch (error) {
    console.error("Signup error:", error);
    showNotification(
      error.message || "Signup failed. Please try again.",
      "error",
    );
  }
}

function checkAuth() {
  const token = localStorage.getItem("authToken");
  const user = localStorage.getItem("user");

  if (token && user) {
    authToken = token;
    currentUser = JSON.parse(user);
    showMainApp();
    loadUserData();
  } else {
    showAuthForms();
  }
}

function showAuthForms() {
  document.getElementById("auth-forms").classList.remove("hidden");
  document.getElementById("main-app").classList.add("hidden");
}

function showMainApp() {
  document.getElementById("auth-forms").classList.add("hidden");
  document.getElementById("main-app").classList.remove("hidden");
}

function setupEventListeners() {
  setupAuthListeners();
  setupAppListeners();
}

function setupAuthListeners() {}

function setupAppListeners() {
  const logoutBtnProfile = document.getElementById("logout-btn-profile");
  if (logoutBtnProfile) {
    logoutBtnProfile.addEventListener("click", handleLogout);
  }

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = e.target.getAttribute("data-page");
      switchPage(page);
    });
  });

  const bookNowHero = document.getElementById("book-now-hero");
  if (bookNowHero) {
    bookNowHero.addEventListener("click", () => switchPage("book"));
  }

  const bookFirstOrder = document.getElementById("book-first-order");
  if (bookFirstOrder) {
    bookFirstOrder.addEventListener("click", () => switchPage("book"));
  }

  const addMoneyProfile = document.getElementById("add-money-profile");
  if (addMoneyProfile) {
    addMoneyProfile.addEventListener("click", openWalletModal);
  }

  const editProfileBtn = document.getElementById("edit-profile-btn");
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", openEditProfileModal);
  }

  setupWalletModal();
  setupBookingForm();
  setupEditProfileModal();
  setupServicePage();
}

function setupServicePage() {
  const categories = document.querySelectorAll(".category");
  const serviceItems = document.querySelectorAll(".service-item");
  const selectButtons = document.querySelectorAll(".select-service");

  categories.forEach((category) => {
    category.addEventListener("click", function () {
      const categoryType = this.getAttribute("data-category");

      categories.forEach((cat) => cat.classList.remove("active"));
      this.classList.add("active");

      if (categoryType === "all") {
        serviceItems.forEach((item) => (item.style.display = "flex"));
      } else {
        serviceItems.forEach((item) => {
          if (item.getAttribute("data-category") === categoryType) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      }
    });
  });

  selectButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const serviceType = this.getAttribute("data-service");

      if (!currentUser) {
        showNotification("Please login to book services", "error");
        return;
      }

      switchPage("book");

      setTimeout(() => {
        if (serviceType === "dry-clean") {
          document.getElementById("dry-clean").checked = true;
        } else if (serviceType === "wash-fold") {
          document.getElementById("wash-fold").checked = true;
        } else if (serviceType === "express") {
          const expressBtn = document.getElementById("express-btn");
          if (expressBtn) {
            expressBtn.classList.add("active");
            expressBtn.setAttribute("data-active", "true");
            document.getElementById("express").value = "true";
          }
        } else if (serviceType === "hand-wash") {
          showNotification(
            "Hand Wash service selected. Please note price is ₹300/kg",
            "success",
          );
          document.getElementById("dry-clean").checked = true;
        } else if (serviceType === "premium") {
          showNotification(
            "Premium Laundry selected. Please note price is ₹400/kg",
            "success",
          );
          document.getElementById("dry-clean").checked = true;
        } else if (serviceType === "stain-removal") {
          showNotification("Stain Removal service added as extra", "success");
        }

        calculatePrice();
      }, 300);
    });
  });
}

function handleLogout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  authToken = null;
  currentUser = null;
  showAuthForms();
  showNotification("Logged out successfully", "success");
}

function switchPage(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-links a")
    .forEach((link) => link.classList.remove("active"));

  const pageElement = document.getElementById(`${page}-page`);
  if (pageElement) {
    pageElement.classList.add("active");
  }

  const navLink = document.querySelector(`[data-page="${page}"]`);
  if (navLink) {
    navLink.classList.add("active");
  }

  if (page === "orders") {
    loadOrders();
  } else if (page === "profile") {
    loadProfile();
  } else if (page === "book") {
    prefillBookingForm();
    calculatePrice();
  } else if (page === "feedback") {
    setTimeout(() => {
      initializeFeedbackPage();
      loadFeedbackPage();
    }, 100);
  } else if (page === "service") {
    initializeServicePage();
  }
}

function loadUserData() {
  if (!currentUser) return;

  document.getElementById("profile-wallet-balance").textContent =
    `₹${currentUser.walletBalance.toFixed(2)}`;

  document.getElementById("profile-fullname").textContent = currentUser.name;
  document.getElementById("profile-email").textContent = currentUser.email;

  switchPage("home");
}

async function loadProfile() {
  if (!currentUser) return;

  try {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      updateProfileDisplay(userData);
      loadTransactions();
    }
  } catch (error) {
    showNotification("Error loading profile", "error");
  }
}

function updateProfileDisplay(userData) {
  document.getElementById("detail-name").textContent = userData.name;
  document.getElementById("detail-email").textContent = userData.email;
  document.getElementById("detail-phone").textContent = userData.phone;
  document.getElementById("detail-address").textContent = userData.address;
  document.getElementById("detail-join-date").textContent = new Date(
    userData.createdAt,
  ).toLocaleDateString("en-IN");

  document.getElementById("profile-wallet-balance").textContent =
    `₹${userData.walletBalance.toFixed(2)}`;

  if (currentUser) {
    currentUser.walletBalance = userData.walletBalance;
    localStorage.setItem("user", JSON.stringify(currentUser));
  }
}

async function loadTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/transactions`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const transactionsList = document.getElementById("transactions-list");
    transactionsList.innerHTML = "";

    if (response.ok) {
      const transactions = await response.json();

      if (transactions.length === 0) {
        transactionsList.innerHTML =
          '<p class="no-transactions">No transactions yet</p>';
        return;
      }

      transactions.forEach((transaction) => {
        const transactionItem = document.createElement("div");
        transactionItem.className = "transaction-item";

        const amountClass =
          transaction.type === "credit" ? "positive" : "negative";
        const amountSign = transaction.type === "credit" ? "+" : "-";

        transactionItem.innerHTML = `
                    <div>
                        <strong>${transaction.description}</strong>
                        <p style="font-size: 0.95rem; color: #666;">${new Date(transaction.createdAt).toLocaleDateString("en-IN")}</p>
                    </div>
                    <div class="transaction-amount ${amountClass}">${amountSign}₹${transaction.amount.toFixed(2)}</div>
                `;

        transactionsList.appendChild(transactionItem);
      });
    }
  } catch (error) {
    console.error("Error loading transactions:", error);
  }
}

async function loadOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const ordersList = document.getElementById("orders-list");

    if (response.ok) {
      const orders = await response.json();
      displayOrders(orders);
    } else {
      displayOrders([]);
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    displayOrders([]);
  }
}

function displayOrders(orders) {
  const ordersList = document.getElementById("orders-list");
  ordersList.innerHTML = "";

  if (!orders || orders.length === 0) {
    ordersList.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-box-open"></i>
                <h3>No Orders Yet</h3>
                <p>Book your first laundry service to get started!</p>
                <button class="btn-primary" id="book-first-order">Book Now</button>
            </div>
        `;
    document
      .getElementById("book-first-order")
      .addEventListener("click", () => switchPage("book"));
    return;
  }

  orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .forEach((order) => {
      const orderItem = document.createElement("div");
      orderItem.className = "order-item";

      const serviceName =
        order.serviceType === "dry-clean"
          ? "Dry Cleaning"
          : order.serviceType === "wash-fold"
            ? "Wash & Fold"
            : "Laundry Service";
      const expressText = order.express ? " (Express)" : "";
      const statusClass = `status-${order.status ? order.status.toLowerCase() : "scheduled"}`;
      const statusText = order.status || "Scheduled";

      orderItem.innerHTML = `
            <h4>Order #${order._id ? order._id.slice(-6) : "N/A"}
                <span class="order-status ${statusClass}">${statusText}</span>
            </h4>
            <div class="order-details">
                <div class="detail-column">
                    <p><strong>Service:</strong> ${serviceName}${expressText}</p>
                    <p><strong>Weight:</strong> ${order.weight} kg</p>
                    <p><strong>Amount:</strong> ₹${order.totalAmount || "0"}</p>
                </div>
                <div class="detail-column">
                    <p><strong>Pickup:</strong> ${order.pickupDate ? new Date(order.pickupDate).toLocaleDateString("en-IN") : "N/A"} at ${order.pickupTime || "N/A"}</p>
                    <p><strong>Address:</strong> ${order.address ? order.address.substring(0, 50) : ""}${order.address && order.address.length > 50 ? "..." : ""}</p>
                    <p><strong>Placed on:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "N/A"}</p>
                </div>
            </div>
        `;

      ordersList.appendChild(orderItem);
    });
}

function setupWalletModal() {
  const modal = document.getElementById("wallet-modal");
  const closeBtn = document.querySelector(".close");
  const addMoneyBtn = document.getElementById("add-to-wallet");
  const amountOptions = document.querySelectorAll(".amount-option");
  const customAmountInput = document.getElementById("custom-amount");
  const paymentMethods = document.querySelectorAll(
    'input[name="payment-method"]',
  );

  document.getElementById("add-money-profile").addEventListener("click", () => {
    document.getElementById("modal-balance").textContent =
      `₹${currentUser.walletBalance.toFixed(2)}`;
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    resetWalletModal();
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      resetWalletModal();
    }
  });

  amountOptions.forEach((option) => {
    option.addEventListener("click", function () {
      amountOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");
      customAmountInput.value = "";
    });
  });

  customAmountInput.addEventListener("input", function () {
    amountOptions.forEach((opt) => opt.classList.remove("active"));
  });

  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      const methodValue = this.value;

      document.querySelectorAll(".payment-details").forEach((detail) => {
        detail.classList.add("hidden");
      });

      if (methodValue === "card") {
        document
          .getElementById("card-payment-details")
          .classList.remove("hidden");
      } else if (methodValue === "upi") {
        document
          .getElementById("upi-payment-details")
          .classList.remove("hidden");
      } else if (methodValue === "netbanking") {
        document
          .getElementById("netbanking-payment-details")
          .classList.remove("hidden");
      }
    });
  });

  addMoneyBtn.addEventListener("click", async function () {
    let amount = 0;

    const activeOption = document.querySelector(".amount-option.active");
    if (activeOption) {
      amount = parseFloat(activeOption.getAttribute("data-amount"));
    } else if (customAmountInput.value) {
      amount = parseFloat(customAmountInput.value);
    }

    if (!amount || amount < 100) {
      showNotification("Minimum amount to add is ₹100", "error");
      return;
    }

    if (amount > 10000) {
      showNotification("Maximum amount to add is ₹10,000", "error");
      return;
    }

    const paymentMethod = document.querySelector(
      'input[name="payment-method"]:checked',
    ).value;

    try {
      const response = await fetch(`${API_BASE_URL}/users/add-money`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          amount,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add money");
      }

      if (currentUser) {
        currentUser.walletBalance = data.newBalance;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }

      updateWalletDisplay();
      loadTransactions();

      showNotification(
        `Successfully added ₹${amount.toFixed(2)} to your wallet!`,
        "success",
      );

      modal.style.display = "none";
      resetWalletModal();
    } catch (error) {
      showNotification(error.message, "error");
    }
  });
}

function resetWalletModal() {
  document
    .querySelectorAll(".amount-option")
    .forEach((opt) => opt.classList.remove("active"));
  document.getElementById("custom-amount").value = "";
  document.getElementById("modal-card-number").value = "";
  document.getElementById("modal-card-expiry").value = "";
  document.getElementById("modal-card-cvv").value = "";
  document.getElementById("modal-upi-id").value = "";
  document.getElementById("bank-select").value = "";
}

function updateWalletDisplay() {
  if (currentUser) {
    document.getElementById("profile-wallet-balance").textContent =
      `₹${currentUser.walletBalance.toFixed(2)}`;
    document.getElementById("modal-balance").textContent =
      `₹${currentUser.walletBalance.toFixed(2)}`;
  }
}

function setupBookingForm() {
  const serviceTypeRadios = document.querySelectorAll('input[name="service"]');
  const weightInput = document.getElementById("weight");
  const paymentOptions = document.querySelectorAll('input[name="payment"]');

  const steps = document.querySelectorAll(".wizard-step");
  const stepButtons = document.querySelectorAll(".step[data-step]");
  const nextButtons = document.querySelectorAll(".btn-next");
  const prevButtons = document.querySelectorAll(".btn-prev");
  let currentStep = 1;

  function initWizard() {
    updateWizardProgress();
    updateSidebar();

    document.querySelectorAll(".service-card-select").forEach((card) => {
      card.addEventListener("click", function () {
        const serviceType = this.getAttribute("data-service");
        const radioInput = this.querySelector('input[type="radio"]');

        document.querySelectorAll(".service-card-select").forEach((c) => {
          c.classList.remove("active");
        });

        this.classList.add("active");

        if (radioInput) {
          radioInput.checked = true;
          calculatePrice();
          updateSidebar();
        }
      });
    });

    const expressBtn = document.getElementById("express-btn");
    const expressHidden = document.getElementById("express");

    if (expressBtn) {
      expressBtn.addEventListener("click", function () {
        const isActive = this.getAttribute("data-active") === "true";

        if (isActive) {
          this.classList.remove("active");
          this.setAttribute("data-active", "false");
          expressHidden.value = "false";
        } else {
          this.classList.add("active");
          this.setAttribute("data-active", "true");
          expressHidden.value = "true";
        }

        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 200);

        calculatePrice();
        updateSidebar();
      });
    }

    document.querySelectorAll(".time-slot").forEach((slot) => {
      slot.addEventListener("click", function () {
        const time = this.getAttribute("data-time");

        document.querySelectorAll(".time-slot").forEach((s) => {
          s.classList.remove("active");
        });

        this.classList.add("active");

        document.getElementById("pickup-time").value = time;
        updateSidebar();
      });
    });

    document.querySelectorAll(".weight-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const action = this.getAttribute("data-action");
        let currentWeight = parseInt(weightInput.value);

        if (action === "increase" && currentWeight < 20) {
          weightInput.value = currentWeight + 1;
        } else if (action === "decrease" && currentWeight > 1) {
          weightInput.value = currentWeight - 1;
        }

        calculatePrice();
        updateSidebar();
      });
    });

    document.querySelectorAll(".payment-option-card").forEach((card) => {
      card.addEventListener("click", function () {
        const paymentMethod = this.getAttribute("data-payment");
        const radioInput = this.querySelector('input[type="radio"]');

        if (radioInput) {
          radioInput.checked = true;

          document
            .querySelectorAll(".payment-details-section")
            .forEach((section) => {
              section.classList.add("hidden");
            });

          if (paymentMethod === "card") {
            document.getElementById("card-details").classList.remove("hidden");
          } else if (paymentMethod === "upi") {
            document.getElementById("upi-details").classList.remove("hidden");
          }

          if (paymentMethod === "wallet" && currentUser) {
            document.getElementById("wallet-balance-display").textContent =
              `₹${currentUser.walletBalance.toFixed(2)}`;
          }
        }
      });
    });
  }

  function updateWizardProgress() {
    stepButtons.forEach((step) => {
      const stepNum = parseInt(step.getAttribute("data-step"));
      if (stepNum <= currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });

    document.querySelectorAll(".step-line").forEach((line, index) => {
      if (index < currentStep - 1) {
        line.style.width = "100%";
      } else {
        line.style.width = "0%";
      }
    });

    steps.forEach((step) => {
      const stepNum = parseInt(step.getAttribute("data-step"));
      if (stepNum === currentStep) {
        step.classList.add("active");
      } else {
        step.classList.remove("active");
      }
    });
  }

  function updateSidebar() {
    const selectedService = document.querySelector(
      'input[name="service"]:checked',
    );
    const serviceName = selectedService
      ? selectedService.value === "dry-clean"
        ? "Dry Cleaning"
        : "Wash & Fold"
      : "--";
    document.getElementById("sidebar-service").textContent = serviceName;

    const weight = weightInput.value;
    document.getElementById("sidebar-weight").textContent = `${weight} kg`;

    const isExpress = document.getElementById("express").value === "true";
    document.getElementById("sidebar-express").textContent = isExpress
      ? "Yes"
      : "No";

    const pickupDate = document.getElementById("pickup-date").value;
    if (pickupDate) {
      const date = new Date(pickupDate);
      document.getElementById("sidebar-date").textContent =
        date.toLocaleDateString("en-IN");
    }

    const pickupTime = document.getElementById("pickup-time").value;
    if (pickupTime) {
      document.getElementById("sidebar-time").textContent = pickupTime
        .replace("am", " AM")
        .replace("pm", " PM");
    }

    const totalAmount = document.getElementById("total-amount").textContent;
    document.getElementById("sidebar-total").textContent = totalAmount;
  }

  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentStepElement = document.querySelector(
        `.wizard-step[data-step="${currentStep}"]`,
      );
      const isValid = validateStep(currentStep);

      if (isValid) {
        if (currentStep < 4) {
          currentStep++;
          updateWizardProgress();
          updateSidebar();
        }
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (currentStep > 1) {
        currentStep--;
        updateWizardProgress();
        updateSidebar();
      }
    });
  });

  function validateStep(step) {
    let isValid = true;

    switch (step) {
      case 1:
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;

        if (!name || !validateName(name)) {
          showNotification(
            "Please enter a valid name (minimum 3 characters)",
            "error",
          );
          isValid = false;
        }
        if (!phone || !validatePhone(phone)) {
          showNotification(
            "Please enter a valid 10-digit phone number",
            "error",
          );
          isValid = false;
        }
        if (!address || !validateAddress(address)) {
          showNotification(
            "Please enter a valid address (minimum 10 characters)",
            "error",
          );
          isValid = false;
        }
        break;

      case 3:
        const pickupDate = document.getElementById("pickup-date").value;
        const pickupTime = document.getElementById("pickup-time").value;

        if (!pickupDate) {
          showNotification("Please select a pickup date", "error");
          isValid = false;
        }
        if (!pickupTime) {
          showNotification("Please select a pickup time slot", "error");
          isValid = false;
        }
        break;
    }

    return isValid;
  }

  serviceTypeRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      calculatePrice();
      updateSidebar();
    });
  });

  weightInput.addEventListener("input", calculatePrice);

  paymentOptions.forEach((option) => {
    option.addEventListener("change", function () {
      document
        .querySelectorAll(".payment-details-section")
        .forEach((detail) => {
          detail.classList.add("hidden");
        });

      if (this.value === "card") {
        document.getElementById("card-details").classList.remove("hidden");
      } else if (this.value === "upi") {
        document.getElementById("upi-details").classList.remove("hidden");
      }

      if (this.value === "wallet" && currentUser) {
        document.getElementById("wallet-balance-display").textContent =
          `₹${currentUser.walletBalance.toFixed(2)}`;
      }
    });
  });

  document
    .getElementById("booking-form")
    .addEventListener("submit", handleBookingSubmit);

  initWizard();
  calculatePrice();
  initializeDatePicker();

  const defaultTimeSlot = document.querySelector(".time-slot");
  if (defaultTimeSlot) {
    defaultTimeSlot.click();
  }
}

function prefillBookingForm() {
  if (!currentUser) return;

  document.getElementById("name").value = currentUser.name;
  document.getElementById("phone").value = currentUser.phone;
  document.getElementById("address").value = currentUser.address;

  const expressBtn = document.getElementById("express-btn");
  if (expressBtn) {
    expressBtn.classList.remove("active");
    expressBtn.setAttribute("data-active", "false");
  }
  document.getElementById("express").value = "false";

  initializeDatePicker();
}

function calculatePrice() {
  try {
    const selectedService = document.querySelector(
      'input[name="service"]:checked',
    ).value;
    const weight = parseInt(document.getElementById("weight").value) || 1;
    const expressSelected = document.getElementById("express").value === "true";

    const servicePrices = {
      "dry-clean": 250,
      "wash-fold": 150,
    };

    let serviceCost = 0;
    let expressCharge = 0;

    if (selectedService === "dry-clean") {
      serviceCost = servicePrices["dry-clean"] * weight;
    } else if (selectedService === "wash-fold") {
      serviceCost = servicePrices["wash-fold"] * weight;
    }

    if (expressSelected) {
      expressCharge = 200;
    }

    const totalAmount = serviceCost + expressCharge;

    document.getElementById("service-cost").textContent = `₹${serviceCost}`;
    document.getElementById("express-charge").textContent = `₹${expressCharge}`;
    document.getElementById("total-amount").textContent = `₹${totalAmount}`;
    document.getElementById("confirm-amount").textContent = totalAmount;
    document.getElementById("final-amount").textContent = totalAmount;
  } catch (error) {
    console.error("Error calculating price:", error);
  }
}

async function handleBookingSubmit(e) {
  e.preventDefault();

  if (!currentUser) {
    showNotification("Please login to book a service", "error");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const pickupDate = document.getElementById("pickup-date").value;
  const pickupTime = document.getElementById("pickup-time").value;
  const weight = document.getElementById("weight").value;
  const serviceType = document.querySelector(
    'input[name="service"]:checked',
  ).value;
  const express = document.getElementById("express").value === "true";
  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked',
  ).value;

  if (!name || !phone || !address) {
    showNotification("Please fill in all required fields", "error");
    return;
  }

  if (!validateName(name)) {
    showNotification("Please enter a valid name", "error");
    return;
  }

  if (!validatePhone(phone)) {
    showNotification("Please enter a valid 10-digit phone number", "error");
    return;
  }

  if (!validateAddress(address)) {
    showNotification("Please enter a valid address", "error");
    return;
  }

  if (!pickupTime) {
    showNotification("Please select a pickup time", "error");
    return;
  }

  const weightNum = parseInt(weight);
  const servicePrices = {
    "dry-clean": 250,
    "wash-fold": 150,
  };

  let serviceCost = 0;
  let expressCharge = 0;

  if (serviceType === "dry-clean") {
    serviceCost = servicePrices["dry-clean"] * weightNum;
  } else if (serviceType === "wash-fold") {
    serviceCost = servicePrices["wash-fold"] * weightNum;
  }

  if (express) {
    expressCharge = 200;
  }

  const totalAmount = serviceCost + expressCharge;

  if (paymentMethod === "wallet" && currentUser.walletBalance < totalAmount) {
    showNotification(
      `Insufficient wallet balance. Required: ₹${totalAmount}, Available: ₹${currentUser.walletBalance.toFixed(2)}`,
      "error",
    );
    openWalletModal();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name,
        phone,
        address,
        pickupDate,
        pickupTime,
        serviceType,
        weight: weightNum,
        express,
        totalAmount,
        paymentMethod,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Booking failed");
    }

    if (paymentMethod === "wallet" && data.newBalance !== undefined) {
      currentUser.walletBalance = data.newBalance;
      localStorage.setItem("user", JSON.stringify(currentUser));
      updateWalletDisplay();
    }

    showNotification("Booking confirmed successfully!", "success");

    document.getElementById("booking-form").reset();
    prefillBookingForm();
    calculatePrice();

    setTimeout(() => {
      loadOrders();
      switchPage("orders");
    }, 1000);
  } catch (error) {
    showNotification(
      error.message || "Server error. Please try again.",
      "error",
    );
  }
}

function openWalletModal() {
  const modal = document.getElementById("wallet-modal");
  document.getElementById("modal-balance").textContent =
    `₹${currentUser.walletBalance.toFixed(2)}`;
  modal.style.display = "block";
}

function openEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  if (!currentUser) return;

  document.getElementById("edit-name").value = currentUser.name;
  document.getElementById("edit-phone").value = currentUser.phone;
  document.getElementById("edit-address").value = currentUser.address;
  modal.style.display = "block";
}

function setupEditProfileModal() {
  const modal = document.getElementById("edit-profile-modal");
  const closeBtn = document.querySelector(".close-edit");

  document
    .getElementById("edit-profile-btn")
    .addEventListener("click", openEditProfileModal);

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

async function handleEditProfile(e) {
  if (e && e.preventDefault) e.preventDefault();

  const name = document.getElementById("edit-name").value;
  const phone = document.getElementById("edit-phone").value;
  const address = document.getElementById("edit-address").value;
  const password = document.getElementById("edit-password").value;
  const confirmPassword = document.getElementById(
    "edit-confirm-password",
  ).value;

  if (!validateName(name)) {
    showNotification(
      "Please enter a valid full name (minimum 3 characters)",
      "error",
    );
    return;
  }

  if (!validatePhone(phone)) {
    showNotification("Please enter a valid 10-digit phone number", "error");
    return;
  }

  if (!validateAddress(address)) {
    showNotification(
      "Please enter a valid address (minimum 10 characters)",
      "error",
    );
    return;
  }

  if (password && password !== confirmPassword) {
    showNotification("Passwords do not match", "error");
    return;
  }

  if (password && !validatePassword(password)) {
    showNotification("Password must be at least 6 characters long", "error");
    return;
  }

  try {
    const updateData = { name, phone, address };
    if (password) {
      updateData.password = password;
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Update failed");
    }

    currentUser = { ...currentUser, ...data.user };
    localStorage.setItem("user", JSON.stringify(currentUser));

    updateProfileDisplay(currentUser);
    prefillBookingForm();

    showNotification("Profile updated successfully!", "success");
    document.getElementById("edit-profile-modal").style.display = "none";
  } catch (error) {
    showNotification(error.message, "error");
  }
}

function setupFeedbackStars() {
  const stars = document.querySelectorAll(".stars i");
  const ratingValue = document.getElementById("rating-value");
  const ratingText = document.querySelector(".rating-text");

  if (!stars.length || !ratingValue) {
    return;
  }

  stars.forEach((star, index) => {
    star.setAttribute("data-rating", (index + 1).toString());

    star.addEventListener("click", function () {
      const rating = parseInt(this.getAttribute("data-rating"));
      ratingValue.value = rating.toString();

      stars.forEach((s) => s.classList.remove("active"));

      for (let i = 0; i < rating; i++) {
        stars[i].classList.add("active");
      }

      const ratings = [
        "Select rating",
        "Poor",
        "Fair",
        "Good",
        "Very Good",
        "Excellent",
      ];
      ratingText.textContent = ratings[rating] || "Select rating";
    });

    star.addEventListener("mouseover", function () {
      const rating = parseInt(this.getAttribute("data-rating"));
      stars.forEach((s, idx) => {
        if (idx < rating) {
          s.classList.add("hover");
        } else {
          s.classList.remove("hover");
        }
      });
    });

    star.addEventListener("mouseout", function () {
      stars.forEach((s) => s.classList.remove("hover"));
    });
  });

  ratingValue.value = "0";
}

async function handleFeedbackSubmit(e) {
  e.preventDefault();

  if (!currentUser) {
    showNotification("Please login to submit feedback", "error");
    return;
  }

  const orderId = document.getElementById("feedback-order").value;
  const ratingValue = document.getElementById("rating-value").value;
  const comments = document.getElementById("feedback-comments").value;
  const serviceQuality = document.querySelector(
    'input[name="quality"]:checked',
  )?.value;
  const recommend = document.querySelector(
    'input[name="recommend"]:checked',
  )?.value;

  let rating = parseInt(ratingValue) || 0;
  const feedbackComments = comments || "";

  let serviceQualityValue = null;
  if (serviceQuality) {
    serviceQualityValue = parseInt(serviceQuality);
  }

  const feedbackData = {
    orderId: orderId || null,
    rating: rating,
    comments: feedbackComments,
    serviceQuality: serviceQualityValue,
    recommend: recommend || "yes",
    submittedAt: new Date().toISOString(),
  };

  const submitButton = document.querySelector(
    '#feedback-form button[type="submit"]',
  );
  const originalText = submitButton.textContent;
  submitButton.textContent = "Submitting...";
  submitButton.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(feedbackData),
    });

    if (response.ok) {
      showNotification("Feedback submitted successfully!", "success");
      resetFeedbackForm();
      await loadFeedbackHistory();
    } else {
      const savedFeedback = saveFeedbackLocally(feedbackData);
      showNotification("Feedback saved locally!", "success");
      resetFeedbackForm();
      await loadFeedbackHistory();
    }
  } catch (error) {
    const savedFeedback = saveFeedbackLocally(feedbackData);
    showNotification("Feedback saved locally!", "success");
    resetFeedbackForm();
    await loadFeedbackHistory();
  } finally {
    submitButton.textContent = originalText;
    submitButton.disabled = false;
  }
}

function resetFeedbackForm() {
  document.getElementById("feedback-form").reset();
  document
    .querySelectorAll(".stars i")
    .forEach((star) => star.classList.remove("active"));
  document.getElementById("rating-value").value = "0";
  const ratingText = document.querySelector(".rating-text");
  if (ratingText) {
    ratingText.textContent = "Select rating";
  }
  document
    .querySelectorAll('input[name="quality"]')
    .forEach((radio) => (radio.checked = false));
  document.getElementById("recommend-yes").checked = true;
  document.getElementById("char-count").textContent = "0";
}

function saveFeedbackLocally(feedbackData) {
  try {
    const existingFeedback = JSON.parse(
      localStorage.getItem("localFeedback") || "[]",
    );

    const newFeedback = {
      ...feedbackData,
      id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      orderDetails: feedbackData.orderId
        ? `Order #${feedbackData.orderId.slice(-6)}`
        : "General Feedback",
    };

    existingFeedback.push(newFeedback);
    localStorage.setItem("localFeedback", JSON.stringify(existingFeedback));

    return newFeedback;
  } catch (error) {
    return { success: true };
  }
}

async function loadFeedbackHistory() {
  try {
    const feedbackList = document.getElementById("feedback-list");

    let feedbacks = [];

    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        feedbacks = await response.json();
      }
    } catch (apiError) {
      console.log("Using local feedback");
    }

    try {
      const localFeedback = JSON.parse(
        localStorage.getItem("localFeedback") || "[]",
      );
      feedbacks = [...feedbacks, ...localFeedback];
    } catch (localError) {
      console.log("No local feedback found");
    }

    displayFeedbackHistory(feedbacks);
  } catch (error) {
    displayFeedbackHistory([]);
  }
}

function displayFeedbackHistory(feedbacks) {
  const feedbackList = document.getElementById("feedback-list");
  if (!feedbackList) {
    return;
  }

  feedbackList.innerHTML = "";

  if (!feedbacks || feedbacks.length === 0) {
    feedbackList.innerHTML = `
            <div class="no-feedback">
                <i class="fas fa-comment-dots"></i>
                <h4>No Feedback Yet</h4>
                <p>Share your first feedback to help us improve!</p>
            </div>
        `;
    return;
  }

  feedbacks.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA;
  });

  feedbacks.forEach((feedback) => {
    const feedbackItem = document.createElement("div");
    feedbackItem.className = "feedback-item";

    let stars = "";
    const rating = parseInt(feedback.rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars +=
        i <= rating
          ? '<i class="fas fa-star"></i>'
          : '<i class="far fa-star"></i>';
    }

    const serviceQuality = feedback.serviceQuality
      ? `${parseInt(feedback.serviceQuality)}/5`
      : "Not rated";

    const recommendText =
      feedback.recommend === "yes"
        ? "Would recommend"
        : feedback.recommend === "no"
          ? "Would not recommend"
          : "Not specified";

    let formattedDate = "Date not available";
    try {
      if (feedback.createdAt) {
        const date = new Date(feedback.createdAt);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
      }
    } catch (dateError) {}

    const comments = feedback.comments || "No comments provided";

    feedbackItem.innerHTML = `
            <div class="feedback-item-header">
                <h4>${feedback.orderDetails || "General Feedback"}</h4>
                <div class="feedback-rating">${stars}</div>
            </div>
            <p class="feedback-comments">${comments}</p>
            <div class="feedback-meta">
                <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                <span><i class="fas fa-star-half-alt"></i> Service Quality: ${serviceQuality}</span>
                <span><i class="fas fa-user-check"></i> ${recommendText}</span>
            </div>
        `;

    if (feedback.id && feedback.id.startsWith("local-")) {
      const localIndicator = document.createElement("div");
      localIndicator.className = "local-indicator";
      localIndicator.innerHTML = '<i class="fas fa-save"></i> Saved Locally';
      feedbackItem.appendChild(localIndicator);
    }

    feedbackList.appendChild(feedbackItem);
  });
}

function setupCommentCounter() {
  const commentsTextarea = document.getElementById("feedback-comments");
  if (!commentsTextarea) return;

  const charCountSpan = document.getElementById("char-count");
  if (!charCountSpan) return;

  function updateCounter() {
    const length = commentsTextarea.value.length;
    charCountSpan.textContent = length;

    if (length > 1000) {
      charCountSpan.style.color = "#e74c3c";
    } else if (length > 800) {
      charCountSpan.style.color = "#f39c12";
    } else {
      charCountSpan.style.color = "#2a9d8f";
    }
  }

  updateCounter();

  commentsTextarea.addEventListener("input", updateCounter);
}

function initializeFeedbackPage() {
  setupFeedbackStars();
  setupCommentCounter();

  const commentsTextarea = document.getElementById("feedback-comments");
  if (commentsTextarea) {
    commentsTextarea.placeholder =
      "Enter your feedback here... (maximum 1000 characters)";
  }

  const feedbackForm = document.getElementById("feedback-form");
  if (feedbackForm) {
    feedbackForm.removeEventListener("submit", handleFeedbackSubmit);
    feedbackForm.addEventListener("submit", handleFeedbackSubmit);
  }

  document.querySelectorAll('input[name="quality"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".scale-number").forEach((label) => {
        label.style.backgroundColor = "#e0e0e0";
        label.style.color = "#555";
        label.style.transform = "scale(1)";
      });

      const label = this.nextElementSibling;
      if (label && label.classList.contains("scale-number")) {
        label.style.backgroundColor = "#2a9d8f";
        label.style.color = "white";
        label.style.transform = "scale(1.1)";
        label.style.boxShadow = "0 4px 12px rgba(42, 157, 143, 0.3)";
      }
    });
  });
}

async function loadFeedbackPage() {
  if (!currentUser) return;

  try {
    await loadOrdersForFeedback();
    await loadFeedbackHistory();
  } catch (error) {
    displayFeedbackHistory([]);
  }
}

async function loadOrdersForFeedback() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const feedbackSelect = document.getElementById("feedback-order");
    feedbackSelect.innerHTML =
      '<option value="">Select an order (optional)</option>';

    if (response.ok) {
      const orders = await response.json();

      orders.forEach((order) => {
        const option = document.createElement("option");
        option.value = order._id || "";
        const serviceName =
          order.serviceType === "dry-clean" ? "Dry Cleaning" : "Wash & Fold";
        option.textContent = `Order #${order._id ? order._id.slice(-6) : ""} - ${serviceName}`;
        feedbackSelect.appendChild(option);
      });
    }
  } catch (error) {}
}

function showNotification(message, type) {
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  const messageText = document.createElement("span");
  messageText.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.className = "notification-close";
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", () => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  });

  notification.appendChild(messageText);
  notification.appendChild(closeButton);

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 5000);
}

function initializeDatePicker() {
  const today = new Date().toISOString().split("T")[0];
  const pickupDateInput = document.getElementById("pickup-date");
  if (pickupDateInput) {
    pickupDateInput.min = today;
    if (!pickupDateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      pickupDateInput.value = tomorrow.toISOString().split("T")[0];
    }
  }
}

function setupServiceCards() {
  const serviceCards = document.querySelectorAll(".service-card");
  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      const serviceTitle = this.querySelector("h3").textContent;
      showServiceDetails(serviceTitle);
    });
  });
}

function showServiceDetails(serviceName) {
  const serviceInfo = {
    "Dry Cleaning": {
      description:
        "Professional dry cleaning for suits, dresses, and delicate fabrics using eco-friendly solvents.",
      price: "₹250/kg",
      time: "48 hours",
      includes: [
        "Stain removal",
        "Steam pressing",
        "Packaging",
        "Quality check",
      ],
    },
    "Wash & Fold": {
      description:
        "Everyday laundry washed, dried, and neatly folded for your convenience.",
      price: "₹150/kg",
      time: "24 hours",
      includes: ["Washing", "Drying", "Folding", "Packaging"],
    },
    "Special Care": {
      description:
        "Special treatment for stains, delicate items, and special fabrics.",
      price: "₹300/kg",
      time: "72 hours",
      includes: [
        "Hand wash",
        "Special detergents",
        "Air drying",
        "Careful handling",
      ],
    },
    "Express Service": {
      description: "Get your clothes cleaned and delivered within 24 hours.",
      price: "+₹200",
      time: "24 hours",
      includes: [
        "Priority processing",
        "Fast pickup",
        "Quick delivery",
        "Same day service",
      ],
    },
  };

  const service = serviceInfo[serviceName];
  if (!service) return;

  const modal = document.createElement("div");
  modal.className = "service-modal";
  modal.innerHTML = `
        <div class="service-modal-content">
            <div class="service-modal-header">
                <h2>${serviceName}</h2>
                <span class="close-service-modal">&times;</span>
            </div>
            <div class="service-modal-body">
                <div class="service-detail">
                    <p class="service-description">${service.description}</p>
                    <div class="service-stats">
                        <div class="stat">
                            <i class="fas fa-tag"></i>
                            <div>
                                <span class="stat-label">Price</span>
                                <span class="stat-value">${service.price}</span>
                            </div>
                        </div>
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <div>
                                <span class="stat-label">Turnaround Time</span>
                                <span class="stat-value">${service.time}</span>
                            </div>
                        </div>
                    </div>
                    <div class="service-includes">
                        <h4>Service Includes:</h4>
                        <ul>
                            ${service.includes.map((item) => `<li><i class="fas fa-check-circle"></i> ${item}</li>`).join("")}
                        </ul>
                    </div>
                </div>
                <div class="service-actions">
                    <button class="btn-secondary close-service-btn">Close</button>
                    <button class="btn-primary book-this-service" data-service="${serviceName}">Book This Service</button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);
  modal.style.display = "block";

  modal.querySelector(".close-service-modal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.querySelector(".close-service-btn").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.querySelector(".book-this-service").addEventListener("click", () => {
    document.body.removeChild(modal);
    switchPage("book");

    setTimeout(() => {
      let serviceType = "wash-fold";
      if (serviceName === "Dry Cleaning") serviceType = "dry-clean";
      if (serviceName === "Express Service") {
        const expressBtn = document.getElementById("express-btn");
        if (expressBtn) {
          expressBtn.classList.add("active");
          expressBtn.setAttribute("data-active", "true");
          document.getElementById("express").value = "true";
        }
      }

      document.querySelector(`input[value="${serviceType}"]`).checked = true;
      calculatePrice();
    }, 300);
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function initializeServicePage() {
  const categories = document.querySelectorAll(".category");
  const serviceItems = document.querySelectorAll(".service-item");
  const selectButtons = document.querySelectorAll(".select-service");

  categories.forEach((category) => {
    category.addEventListener("click", function () {
      const categoryType = this.getAttribute("data-category");

      categories.forEach((cat) => cat.classList.remove("active"));
      this.classList.add("active");

      if (categoryType === "all") {
        serviceItems.forEach((item) => (item.style.display = "flex"));
      } else {
        serviceItems.forEach((item) => {
          if (item.getAttribute("data-category") === categoryType) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      }
    });
  });

  selectButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const serviceType = this.getAttribute("data-service");

      if (!currentUser) {
        showNotification("Please login to book services", "error");
        return;
      }

      switchPage("book");

      setTimeout(() => {
        if (serviceType === "dry-clean") {
          document.getElementById("dry-clean").checked = true;
        } else if (serviceType === "wash-fold") {
          document.getElementById("wash-fold").checked = true;
        } else if (serviceType === "express") {
          const expressBtn = document.getElementById("express-btn");
          if (expressBtn) {
            expressBtn.classList.add("active");
            expressBtn.setAttribute("data-active", "true");
            document.getElementById("express").value = "true";
          }
        } else if (serviceType === "hand-wash") {
          showNotification(
            "Hand Wash service selected. Please note price is ₹300/kg",
            "success",
          );
          document.getElementById("dry-clean").checked = true;
        } else if (serviceType === "premium") {
          showNotification(
            "Premium Laundry selected. Please note price is ₹400/kg",
            "success",
          );
          document.getElementById("dry-clean").checked = true;
        } else if (serviceType === "stain-removal") {
          showNotification("Stain Removal service added as extra", "success");
        }

        calculatePrice();
      }, 300);
    });
  });
}

function setupRealTimeValidation() {
  const emailInput = document.getElementById("signup-email");
  const loginEmailInput = document.getElementById("login-email");

  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      if (this.value && !validateEmail(this.value)) {
        this.style.borderBottomColor = "#ff3860";
        this.style.animation = "shake 0.5s ease-in-out";

        const tooltip = document.createElement("div");
        tooltip.className = "validation-tooltip";
        tooltip.textContent =
          "Please enter a valid email address (e.g., name@gmail.com)";
        tooltip.style.cssText = `
                    position: absolute;
                    background: #e74c3c;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    z-index: 1000;
                    margin-top: 5px;
                    box-shadow: 0 3px 15px rgba(0,0,0,0.2);
                `;

        const existingTooltip = this.parentNode.querySelector(
          ".validation-tooltip",
        );
        if (existingTooltip) {
          existingTooltip.remove();
        }

        this.parentNode.appendChild(tooltip);

        setTimeout(() => {
          if (tooltip.parentNode) {
            tooltip.remove();
          }
        }, 3000);

        setTimeout(() => {
          this.style.animation = "";
        }, 500);
      } else {
        this.style.borderBottomColor = "";
        const existingTooltip = this.parentNode.querySelector(
          ".validation-tooltip",
        );
        if (existingTooltip) {
          existingTooltip.remove();
        }
      }
    });
  }

  if (loginEmailInput) {
    loginEmailInput.addEventListener("blur", function () {
      if (this.value && !validateEmail(this.value)) {
        this.style.borderBottomColor = "#ff3860";
        this.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
          this.style.animation = "";
        }, 500);
      } else {
        this.style.borderBottomColor = "";
      }
    });
  }
}
