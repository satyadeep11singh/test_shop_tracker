const phoneNumberInput = document.getElementById('phoneNumber');
const emailAddressInput = document.getElementById('emailAddress');
const checkStatusButton = document.getElementById('checkStatus');
const orderStatusContainer = document.getElementById('orderStatus');

checkStatusButton.addEventListener('click', checkOrderStatus);

async function checkOrderStatus() {
  const phoneNumber = phoneNumberInput.value;
  const emailAddress = emailAddressInput.value;

  if (!phoneNumber && !emailAddress) {
    alert('Please enter your phone number or email address.');
    return;
  }

  try {
    const response = await fetch('/api/check-order-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, emailAddress }),
    });
    const orderStatus = await response.json();
    renderOrderStatus(orderStatus);
  } catch (error) {
    console.error('Error checking order status:', error);
    alert('An error occurred while checking your order status.');
  }
}

function renderOrderStatus(orderStatus) {
  orderStatusContainer.innerHTML = '';

  if (orderStatus.order) {
    const orderElement = document.createElement('div');
    orderElement.innerHTML = `
      <h3>Order #${orderStatus.order.id}</h3>
      <p>Status: ${orderStatus.order.status}</p>
      <p>Total: ${orderStatus.order.total_price}</p>
      <p>Created At: ${orderStatus.order.created_at}</p>
    `;
    orderStatusContainer.appendChild(orderElement);
  } else {
    const messageElement = document.createElement('p');
    messageElement.textContent = 'No order found matching the provided information.';
    orderStatusContainer.appendChild(messageElement);
  }
}
