let cart = [];
let totalPrice = 0;

// Function to add item to cart
function addToCart(foodItem) {
    const { image, name, price, category } = foodItem;
    cart.push({ image, name, price, category, quantity: 0 });
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
    updateCartDisplay();
}

// Function to delete item from cart
function deleteFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
    updateCartDisplay();
}

// Function to update quantity
function updateQuantity(index, quantity) {
    if (quantity >= 0) {
        cart[index].quantity = parseInt(quantity);
        updateCartDisplay();
    }
}

// Function to handle radio button change
function handleRadioChange(index, radio) {
    if (radio.checked) {
        const quantityInput = prompt("Enter the quantity:");
        
        // Check if the user clicked Cancel
        if (quantityInput === null) {
            radio.checked = false; // Uncheck the radio button if cancelled
            updateQuantity(index, 0); // Reset quantity
            return; // Exit the function
        }
        
        const quantity = parseInt(quantityInput); // Parse as integer

        if (quantity > 0) {
            updateQuantity(index, quantity);
        } else {
            alert("Please enter a valid quantity greater than 0."); // Feedback for invalid quantity
            radio.checked = false; // Uncheck the radio button if invalid
            updateQuantity(index, 0); // Reset quantity
        }
    } else {
        updateQuantity(index, 0);
    }
}

// Function to update cart display and calculate total price
function updateCartDisplay() {
    const cartTable = document.getElementById('cart-table-body');
    cartTable.innerHTML = ''; // Clear the existing table content
    
    totalPrice = 0;
    
    cart.forEach((item, index) => {
        if (item.quantity > 0) {
            totalPrice += item.price * item.quantity;
        }
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" style="width: 50px;"></td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <input type="radio" id="item-${index}" name="item-${index}" ${item.quantity > 0 ? 'checked' : ''} 
                    onchange="handleRadioChange(${index}, this)" class="cart-radio">
                <label for="item-${index}">Order</label>
            </td>
            <td><button class="delete-button" onclick="deleteFromCart(${index})">Delete</button></td>
        `;
        cartTable.appendChild(row);
    });

    document.getElementById('total-price').innerText = `Total: $${totalPrice.toFixed(2)}`;
}

// Function to check if items are selected before proceeding
function checkBeforeProceed() {
    const selectedItems = cart.filter(item => item.quantity > 0);
    if (selectedItems.length === 0) {
        alert("Please select items before proceeding to payment.");
    } else {
        showPaymentOptions();
    }
}

// Function to show payment options
function showPaymentOptions() {
    document.getElementById('payment-modal').style.display = 'flex';
}

// Function to close payment options modal
function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

// Function to handle cash on delivery
function handleCashOnDelivery() {
    alert('Order placed!');
    resetCartAfterPayment();
    closePaymentModal();
}

// Function to handle UPI Gateway
function handleUPIGateway() {
    const upiQrCodeImageUrl = "images/qr.jpeg"; // Use the actual image URL

    document.getElementById('upi-qr-image').src = upiQrCodeImageUrl;

    document.getElementById('upi-modal').style.display = 'flex';
    closePaymentModal();  // Close the payment options modal
}

// Function to handle UPI Payment
function handleUPIPayment() {
    alert("Thank you for payment!");
    resetCartAfterPayment();
    document.getElementById('upi-modal').style.display = 'none';
}

// Function to reset cart after payment
function resetCartAfterPayment() {
    cart.forEach(item => item.quantity = 0); // Reset quantities
    totalPrice = 0;
    updateCartDisplay(); // Update the display to reflect the reset
}

// Load cart from localStorage when page is loaded
document.addEventListener('DOMContentLoaded', function() {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
        cart = storedCart;
        updateCartDisplay();
    }
});
