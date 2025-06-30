const transactions = JSON.parse(localStorage.getItem("transactions")) || [
  {
    id: "1",
    itemName: "Laptop ASUS",
    quantity: 1,
    price: 8500000,
    category: "elektronik",
    total: 8500000,
    date: "28/06/2025",
  },
  {
    id: "2",
    itemName: "Mouse Wireless",
    quantity: 1,
    price: 150000,
    category: "elektronik",
    total: 150000,
    date: "28/06/2025",
  },
  {
    id: "3",
    itemName: "Keyboard Mechanical",
    quantity: 1,
    price: 750000,
    category: "elektronik",
    total: 750000,
    date: "27/06/2025",
  },
]

document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  setupMobileMenu()
  setupForms()
  updateDashboard()
  loadTransactionTable()
  addPageAnimations()
}

function setupMobileMenu() {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })

    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      }
    })
  }
}

function setupForms() {
  setupTransactionForm()
  setupLoginForm()
}


function setupTransactionForm() {
  const transactionForm = document.getElementById("transactionForm")
  if (transactionForm) {
    transactionForm.addEventListener("submit", handleTransactionSubmit)

    const inputs = transactionForm.querySelectorAll("input, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this)
      })

      input.addEventListener("input", function () {
        clearError(this)
      })
    })
  }
}

function handleTransactionSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const transaction = {
    itemName: formData.get("itemName").trim(),
    quantity: Number.parseInt(formData.get("quantity")),
    price: Number.parseInt(formData.get("price")),
    category: formData.get("category"),
  }

  if (validateTransactionForm(transaction)) {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      total: transaction.quantity * transaction.price,
      date: new Date().toLocaleDateString("id-ID"),
    }

    transactions.unshift(newTransaction)

    localStorage.setItem("transactions", JSON.stringify(transactions))

    loadTransactionTable()
    updateDashboard()

    e.target.reset()
    clearAllErrors()

    showSuccessMessage("Transaksi berhasil disimpan!")
  }
}

function validateTransactionForm(transaction) {
  let isValid = true
  clearAllErrors()

  if (!transaction.itemName) {
    showError("itemName", "Nama barang harus diisi")
    isValid = false
  }

  if (!transaction.quantity || transaction.quantity < 1) {
    showError("quantity", "Jumlah harus lebih dari 0")
    isValid = false
  }

  if (!transaction.price || transaction.price < 0) {
    showError("price", "Harga harus valid")
    isValid = false
  }

  if (!transaction.category) {
    showError("category", "Kategori harus dipilih")
    isValid = false
  }

  return isValid
}

function validateField(field) {
  const value = field.value.trim()
  const fieldName = field.name

  switch (fieldName) {
    case "itemName":
      if (!value) {
        showError(fieldName, "Nama barang harus diisi")
        return false
      }
      break
    case "quantity":
      if (!value || Number.parseInt(value) < 1) {
        showError(fieldName, "Jumlah harus lebih dari 0")
        return false
      }
      break
    case "price":
      if (!value || Number.parseInt(value) < 0) {
        showError(fieldName, "Harga harus valid")
        return false
      }
      break
    case "category":
      if (!value) {
        showError(fieldName, "Kategori harus dipilih")
        return false
      }
      break
  }

  clearError(field)
  return true
}

function setupLoginForm() {
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit)
  }
}

function handleLoginSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const username = formData.get("username").trim()
  const password = formData.get("password").trim()

  clearError(document.getElementById("username"))
  clearError(document.getElementById("password"))

  let isValid = true

  if (!username) {
    showError("username", "Username harus diisi")
    isValid = false
  }

  if (!password) {
    showError("password", "Password harus diisi")
    isValid = false
  }

  if (isValid) {
    if (username === "admin" && password === "admin123") {
      showSuccessMessage("Login berhasil! Mengalihkan ke beranda...")
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1500)
    } else {
      showErrorAlert("Username atau password salah!")
    }
  }
}

function loadTransactionTable() {
  const tableBody = document.getElementById("transactionTableBody")
  if (tableBody) {
    tableBody.innerHTML = ""

    transactions.forEach((transaction) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${transaction.itemName}</td>
                <td>${transaction.quantity}</td>
                <td>${formatCurrency(transaction.price)}</td>
                <td style="text-transform: capitalize">${transaction.category}</td>
                <td><strong>${formatCurrency(transaction.total)}</strong></td>
                <td>${transaction.date}</td>
            `
      tableBody.appendChild(row)
    })
  }
}

function updateDashboard() {
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0)
  const todayDate = new Date().toLocaleDateString("id-ID")
  const todayTransactions = transactions.filter((t) => t.date === todayDate).length
  const totalItems = transactions.reduce((sum, t) => sum + t.quantity, 0)

  const totalSalesElement = document.querySelector(".info-cards .card:nth-child(1) .number")
  const todayTransactionsElement = document.querySelector(".info-cards .card:nth-child(2) .number")
  const totalItemsElement = document.querySelector(".info-cards .card:nth-child(3) .number")

  if (totalSalesElement) {
    totalSalesElement.textContent = formatCurrency(totalSales)
  }

  if (todayTransactionsElement) {
    todayTransactionsElement.textContent = todayTransactions
  }

  if (totalItemsElement) {
    totalItemsElement.textContent = `${totalItems} Item`
  }

  updateRecentTransactions()
}

function updateRecentTransactions() {
  const transactionList = document.querySelector(".transaction-list")
  if (transactionList) {
    transactionList.innerHTML = ""

    transactions.slice(0, 3).forEach((transaction) => {
      const item = document.createElement("div")
      item.className = "transaction-item"
      item.innerHTML = `
                <span>${transaction.itemName} - ${formatCurrency(transaction.total)}</span>
                <span class="date">${transaction.date}</span>
            `
      transactionList.appendChild(item)
    })
  }
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function showError(fieldName, message) {
  const field = document.getElementById(fieldName)
  const errorElement = document.getElementById(fieldName + "Error")

  if (field) {
    field.classList.add("error")
  }

  if (errorElement) {
    errorElement.textContent = message
  }
}

function clearError(field) {
  if (field) {
    field.classList.remove("error")
    const errorElement = document.getElementById(field.name + "Error")
    if (errorElement) {
      errorElement.textContent = ""
    }
  }
}

function clearAllErrors() {
  document.querySelectorAll(".error").forEach((element) => {
    element.classList.remove("error")
  })

  document.querySelectorAll(".error-message").forEach((element) => {
    element.textContent = ""
  })
}

function showSuccessMessage(message) {
  removeMessages()

  const messageDiv = document.createElement("div")
  messageDiv.className = "success-message"
  messageDiv.textContent = message

  const container = document.querySelector(".container")
  if (container) {
    container.insertBefore(messageDiv, container.firstChild)

    setTimeout(() => {
      messageDiv.remove()
    }, 3000)
  }
}

function showErrorAlert(message) {
  removeMessages()

  const messageDiv = document.createElement("div")
  messageDiv.className = "error-alert"
  messageDiv.textContent = message

  const container = document.querySelector(".container")
  if (container) {
    container.insertBefore(messageDiv, container.firstChild)

    setTimeout(() => {
      messageDiv.remove()
    }, 3000)
  }
}

function removeMessages() {
  document.querySelectorAll(".success-message, .error-alert").forEach((msg) => {
    msg.remove()
  })
}

function addPageAnimations() {
  const mainContent = document.querySelector("main")
  if (mainContent) {
    mainContent.classList.add("fade-in")
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

window.addEventListener("resize", () => {
  const navMenu = document.querySelector(".nav-menu")
  const hamburger = document.querySelector(".hamburger")

  if (window.innerWidth > 768) {
    if (navMenu) navMenu.classList.remove("active")
    if (hamburger) hamburger.classList.remove("active")
  }
})

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatCurrency,
    validateTransactionForm,
    transactions,
  }
}
