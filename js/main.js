// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const saveBirthdayBtn = document.getElementById("save-birthday")
const celebration = document.getElementById("celebration")
const closeCelebrationBtn = document.getElementById("close-celebration")
const addFriendBtn = document.getElementById("add-friend")
const friendsContainer = document.getElementById("friends-container")

// Modal elements
const friendModal = document.getElementById("friend-modal")
const friendForm = document.getElementById("friend-form")
const friendNameInput = document.getElementById("friend-name")
const friendBirthdayInput = document.getElementById("friend-birthday")
const friendIdInput = document.getElementById("friend-id")
const modalTitle = document.getElementById("modal-title")
const closeModalBtn = document.getElementById("close-modal")
const cancelFriendBtn = document.getElementById("cancel-friend")

// Delete modal elements
const deleteModal = document.getElementById("delete-modal")
const closeDeleteModalBtn = document.getElementById("close-delete-modal")
const cancelDeleteBtn = document.getElementById("cancel-delete")
const confirmDeleteBtn = document.getElementById("confirm-delete")

// Countdown elements
const daysEl = document.getElementById("days")
const hoursEl = document.getElementById("hours")
const minutesEl = document.getElementById("minutes")
const secondsEl = document.getElementById("seconds")
const currentAgeEl = document.getElementById("current-age")
const upcomingAgeEl = document.getElementById("upcoming-age")
const progressFill = document.getElementById("progress-fill")
const progressPercent = document.getElementById("progress-percent")

// State
let friends = []
let friendToDelete = null

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode")
  const isDarkMode = document.body.classList.contains("dark-mode")
  themeToggle.innerHTML = isDarkMode
    ? '<i class="fas fa-sun"></i> Light Mode'
    : '<i class="fas fa-moon"></i> Dark Mode'

  // Save theme preference
  localStorage.setItem("theme", isDarkMode ? "dark" : "light")
})

// Save birthday
saveBirthdayBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value
  const birthday = document.getElementById("birthday").value

  if (!name || !birthday) {
    alert("Please enter your name and birthday")
    return
  }

  // Save to localStorage
  localStorage.setItem("birthdayData", JSON.stringify({ name, birthday }))

  // Show success message
  alert("Birthday saved successfully!")
  startCountdown()
})

// Close celebration
closeCelebrationBtn.addEventListener("click", () => {
  celebration.classList.remove("active")
})

// Add friend button
addFriendBtn.addEventListener("click", () => {
  openFriendModal()
})

// Open friend modal for adding
function openFriendModal(friend = null) {
  if (friend) {
    modalTitle.textContent = "Edit Friend"
    friendIdInput.value = friend.id
    friendNameInput.value = friend.name
    friendBirthdayInput.value = friend.birthday
  } else {
    modalTitle.textContent = "Add Friend"
    friendIdInput.value = ""
    friendNameInput.value = ""
    friendBirthdayInput.value = ""
  }
  friendModal.classList.add("active")
}

// Close friend modal
function closeFriendModal() {
  friendModal.classList.remove("active")
}

// Close modals
closeModalBtn.addEventListener("click", closeFriendModal)
cancelFriendBtn.addEventListener("click", closeFriendModal)
closeDeleteModalBtn.addEventListener("click", () =>
  deleteModal.classList.remove("active")
)
cancelDeleteBtn.addEventListener("click", () =>
  deleteModal.classList.remove("active")
)

// Handle friend form submission
friendForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const id = friendIdInput.value || Date.now().toString()
  const name = friendNameInput.value
  const birthday = friendBirthdayInput.value

  if (!name || !birthday) {
    alert("Please enter both name and birthday")
    return
  }

  // Update or add friend
  if (friendIdInput.value) {
    // Update existing friend
    const index = friends.findIndex((f) => f.id === friendIdInput.value)
    if (index !== -1) {
      friends[index] = { id, name, birthday }
    }
  } else {
    // Add new friend
    friends.push({ id, name, birthday })
  }

  // Save and refresh
  saveFriends()
  renderFriends()
  closeFriendModal()
})

// Initialize delete confirmation
function confirmDeleteFriend(friendId) {
  friendToDelete = friendId
  deleteModal.classList.add("active")
}

// Handle delete confirmation
confirmDeleteBtn.addEventListener("click", () => {
  if (friendToDelete) {
    friends = friends.filter((friend) => friend.id !== friendToDelete)
    saveFriends()
    renderFriends()
    friendToDelete = null
    deleteModal.classList.remove("active")
  }
})

// Initialize theme
function initTheme() {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode'
  }
}

// Calculate age
function calculateAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

// Calculate days until next birthday
function daysUntilBirthday(birthDate) {
  const today = new Date()
  const birthday = new Date(birthDate)
  const nextBirthday = new Date(
    today.getFullYear(),
    birthday.getMonth(),
    birthday.getDate()
  )

  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  }

  const diff = nextBirthday - today
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Save friends to localStorage
function saveFriends() {
  localStorage.setItem("friends", JSON.stringify(friends))
}

// Load friends from localStorage
function loadFriends() {
  const savedFriends = localStorage.getItem("friends")
  if (savedFriends) {
    friends = JSON.parse(savedFriends)
  }
}

// Render friends list
function renderFriends() {
  // Clear container except for add button
  friendsContainer.innerHTML = ""

  // Sort friends by days until birthday
  friends.sort(
    (a, b) => daysUntilBirthday(a.birthday) - daysUntilBirthday(b.birthday)
  )

  // Render each friend
  friends.forEach((friend) => {
    const age = calculateAge(friend.birthday)
    const days = daysUntilBirthday(friend.birthday)

    const friendCard = document.createElement("div")
    friendCard.className = "friend-card"
    friendCard.innerHTML = `
            <div class="friend-name">${friend.name}</div>
            <div class="friend-date">${formatDate(friend.birthday)}</div>
            <div class="friend-countdown">
                <span><i class="fas fa-birthday-cake"></i> ${days} ${
      days === 1 ? "day" : "days"
    }</span>
                <span>Turning ${age + 1}</span>
            </div>
            <div class="friend-actions">
                <button class="friend-btn edit-btn" data-id="${friend.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="friend-btn delete-btn" data-id="${friend.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `

    friendsContainer.appendChild(friendCard)
  })

  // Add the "Add Friend" button at the end
  friendsContainer.appendChild(addFriendBtn)

  // Add event listeners to edit and delete buttons
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const friendId = e.currentTarget.getAttribute("data-id")
      const friend = friends.find((f) => f.id === friendId)
      if (friend) openFriendModal(friend)
    })
  })

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const friendId = e.currentTarget.getAttribute("data-id")
      confirmDeleteFriend(friendId)
    })
  })
}

// Start countdown
function startCountdown() {
  // Get saved birthday
  let birthDate
  const savedData = localStorage.getItem("birthdayData")

  if (savedData) {
    const data = JSON.parse(savedData)
    birthDate = data.birthday
    document.getElementById("name").value = data.name
    document.getElementById("birthday").value = data.birthday
  } else {
    birthDate = "2004-05-03" // fallback
  }

  const birthday = new Date(birthDate)
  const today = new Date()

  // Calculate age
  const currentAge = calculateAge(birthDate)
  const upcomingAge = currentAge + 1
  currentAgeEl.textContent = currentAge
  upcomingAgeEl.textContent = upcomingAge

  // Calculate next birthday
  const nextBirthday = new Date(
    today.getFullYear(),
    birthday.getMonth(),
    birthday.getDate()
  )
  if (today > nextBirthday) {
    nextBirthday.setFullYear(today.getFullYear() + 1)
  }

  // Calculate last birthday
  const lastBirthday = new Date(nextBirthday)
  lastBirthday.setFullYear(nextBirthday.getFullYear() - 1)

  // Birthday progress (from last to next)
  const elapsed = today - lastBirthday
  const total = nextBirthday - lastBirthday
  const progressPercentValue = Math.round((elapsed / total) * 100)

  progressFill.style.width = `${progressPercentValue}%`
  progressFill.textContent = `${progressPercentValue}%`
  progressPercent.textContent = `${progressPercentValue}%`

  // Start countdown interval
  setInterval(() => {
    const now = new Date()
    const diff = nextBirthday - now

    if (diff <= 0) {
      celebration.classList.add("active")
      createConfetti()
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    daysEl.textContent = days
    hoursEl.textContent = hours.toString().padStart(2, "0")
    minutesEl.textContent = minutes.toString().padStart(2, "0")
    secondsEl.textContent = seconds.toString().padStart(2, "0")
  }, 1000)
}

// Create confetti for celebration
function createConfetti() {
  for (let i = 0; i < 150; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`
      celebration.appendChild(confetti)

      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove()
      }, 5000)
    }, i * 50)
  }
}

// Initialize
initTheme()
loadFriends()
renderFriends()
startCountdown()

// Animate countdown numbers on load
setTimeout(() => {
  document.querySelectorAll(".countdown-value").forEach((el) => {
    el.style.animation = "pulse 2s infinite"
  })
}, 1000)
