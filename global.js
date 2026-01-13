const checkboxes = document.querySelectorAll('.filter-sidebar input');
const cards = document.querySelectorAll('.card');

checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    const activeCategories = Array.from(checkboxes)
      .filter(c => c.checked)
      .map(c => c.value);

    cards.forEach(card => {
      const category = card.dataset.category;
      // Using 'flex' instead of 'block' to keep your card styling intact
      card.style.display = activeCategories.includes(category) ? 'flex' : 'none';
    });
  });
});

// Footer Subscribe Alert
document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevents page from reloading
        alert("Thank you for subscribing.");
        this.reset(); // Clears the email input
    });
});

let cartItems = 0; // Tracks if the cart is empty or not

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. MODAL ELEMENTS ---
    const modal = document.getElementById("cartModal");
    const viewCartBtn = document.querySelector(".view-cart-nav");
    const closeBtn = document.querySelector(".close-modal");

    // --- 2. MODAL OPEN/CLOSE LOGIC ---
    if (viewCartBtn) {
        viewCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            displayCartItems(); // Function to load items from sessionStorage
            modal.style.display = "block";
        });
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
    }

    // Close if user clicks the dark background
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // --- 3. SESSION STORAGE: DISPLAY ITEMS ---
    function displayCartItems() {
        const list = document.getElementById('cartItemsList');
        // Read data from sessionStorage
        const cart = JSON.parse(sessionStorage.getItem('nurseryCart')) || [];
        
        if (cart.length === 0) {
            list.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            list.innerHTML = cart.map(item => `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px dashed #ccc; padding-bottom:5px;">
                    <span>${item.name}</span>
                    <strong>${item.price}</strong>
                </div>
            `).join('');
        }
    }

    // --- 4. SESSION STORAGE: ADD TO CART ---
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const plantName = card.querySelector('h3').innerText;
            const plantPrice = card.querySelector('.price').innerText;

            let cart = JSON.parse(sessionStorage.getItem('nurseryCart')) || [];
            cart.push({ name: plantName, price: plantPrice });
            
            sessionStorage.setItem('nurseryCart', JSON.stringify(cart));
            alert("Item added to the cart");
        });
    });

    // --- 5. CLEAR & PROCESS (Wipe SessionStorage) ---
    // Note: Since these buttons are now in the modal, 
    // we use a generic listener for all buttons with these classes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('clear-cart-btn')) {
            if (sessionStorage.getItem('nurseryCart')) {
                sessionStorage.removeItem('nurseryCart');
                displayCartItems(); // Update the modal view
                alert("Cart cleared");
            } else {
                alert("No items to clear.");
            }
        }

        if (e.target.classList.contains('process-order-btn')) {
            if (sessionStorage.getItem('nurseryCart')) {
                sessionStorage.removeItem('nurseryCart');
                displayCartItems(); // Update the modal view
                alert("Thank you for your order");
                modal.style.display = "none"; // Close modal after order
            } else {
                alert("Cart is empty.");
            }
        }
    });

    // --- 6. LOCAL STORAGE: CONTACT FORM ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const customerData = {
                email: document.getElementById('email').value,
                message: document.getElementById('comment').value
            };
            // Save permanently
            localStorage.setItem('customerProfile', JSON.stringify(customerData));
            alert("Thank you for your message");
            this.reset();
        });
    }
});

// Contact Form Alert
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Collect form data
        const customerData = {
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            option: document.getElementById('custom-option').value,
            message: document.getElementById('comment').value
        };

        // Save to localStorage (Permanent)
        localStorage.setItem('customerProfile', JSON.stringify(customerData));

        alert("Thank you for your message. Your info has been saved!");
        this.reset();
    });
}

//CALENDAR

let year = 2026;
let month = 4; // 0 = Jan, 1 = Feb...

// 🌼 Define events by YYYY-MM-DD
const events = {
  "2026-05-03": "Community compost day – 2pm",
  "2026-05-06": "Weeding party – 9am",
  "2026-05-10": "Children's planting workshop – 11am",
  "2026-05-21": "Spring seed swap – 1pm",
  "2026-05-28": "Harvest & potluck – 5pm"
};

const calendar = document.getElementById("calendar");
const title = document.getElementById("calendar-title");

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function renderCalendar() {
  calendar.innerHTML = "";
  title.textContent = `${monthNames[month]} ${year}`;

  // Day names
  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => {
    const el = document.createElement("div");
    el.className = "day-name";
    el.textContent = d;
    calendar.appendChild(el);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const el = document.createElement("div");
    el.className = "day";
    el.textContent = day;

    const key = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    if (events[key]) {
      el.classList.add("event");
      el.setAttribute("data-event", events[key]);
    }

    calendar.appendChild(el);
  }
}

document.getElementById("prev").onclick = () => {
  month--;
  if (month < 0) { month = 11; year--; }
  renderCalendar();
};

document.getElementById("next").onclick = () => {
  month++;
  if (month > 11) { month = 0; year++; }
  renderCalendar();
};

renderCalendar();
