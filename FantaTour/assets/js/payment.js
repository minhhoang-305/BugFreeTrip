document.querySelector('.pay-btn').addEventListener('click', function() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const departureDate = document.getElementById('departureDate').value;
    const guests = parseInt(document.getElementById('participants').value);
    const pricePerGuest = 2500000; // Giả sử giá mỗi khách

    if (!name || !email || !phone) {
        alert("Vui lòng điền đầy đủ thông tin.");
    } else {
        // Lưu thông tin vào localStorage
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
        localStorage.setItem('departureDate', departureDate);
        localStorage.setItem('guests', guests);
        
        // Tính tổng tiền
        const total = pricePerGuest * guests;
        localStorage.setItem('total', total); // Lưu tổng tiền

        // Chuyển đến trang thanh toán
        window.location.href = 'thanhtoann.html';
    }
});
 // Lấy thông tin từ localStorage
const name = localStorage.getItem('name');
const email = localStorage.getItem('email');
const phone = localStorage.getItem('phone');
const departureDate = localStorage.getItem('departureDate');
const guests = localStorage.getItem('guests');
const total = localStorage.getItem('total');

// Cập nhật thông tin vào khung thanh toán
document.getElementById('payment-departure').textContent = departureDate;
document.getElementById('payment-guests').textContent = guests + ' khách';
document.getElementById('payment-price').textContent = formatCurrency(pricePerGuest) + ' VNĐ';
document.getElementById('payment-total').textContent = formatCurrency(total) + ' VNĐ';

// Hàm định dạng tiền tệ
function formatCurrency(number) {
    return number.toLocaleString('vi-VN');
}