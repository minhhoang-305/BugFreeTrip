// Cấu hình Firebase (thay bằng của bạn)
const firebaseConfig = {
    apiKey: "AIzaSyAfS9qjdI-zZ5a8z9IlfuA83ilukZrDcFY",
    authDomain: "nhi06-c8375.firebaseapp.com",
    projectId: "nhi06-c8375",
    storageBucket: "nhi06-c8375.appspot.com",
    messagingSenderId: "620088727553",
    appId: "1:620088727553:web:36d5768da11677bf338800"
};

src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"
src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"
src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();


// Xử lý hiệu ứng chuyển form
const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const container = document.getElementById("container");
const forgot = document.getElementById("forgot");
// const emailforgot = document.getElementById("emailforgot"); // Element này không tồn tại trong HTML bạn cung cấp

registerButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
});

loginButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");
});

// Xử lý đăng ký
const nButton = document.getElementById("n");
nButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.querySelector(".register-container input[type='text']").value;
    const email = document.querySelector(".register-container input[type='email']").value;
    const password = document.querySelector(".register-container input[type='password']").value;

    if (!name || !email || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Please fill in all fields!'
        });
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });

        await db.collection("users").doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userType: 0 // 0 = user, 1 = admin (tuỳ bạn gán role)
        });

        Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            text: 'Bạn có thể đăng nhập ngay.',
            confirmButtonText: 'OK'
        }).then(() => {
            container.classList.remove("right-panel-active");
        });
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Lỗi đăng ký', text: error.message });
    }
});


// Xử lý đăng nhập
const mButton = document.getElementById("m");
mButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = document.querySelector(".login-container input[type='email']").value;
    const password = document.querySelector(".login-container input[type='password']").value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        const doc = await db.collection("users").doc(user.uid).get();
        const data = doc.data();

        Swal.fire({
            icon: 'success',
            title: 'Đăng nhập thành công!',
            text: 'Đang chuyển hướng...',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = "/index.html";
        });
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Đăng nhập thất bại!', text: error.message });
    }
});

// Quên mật khẩu
function forgotPassword() {
    Swal.fire({
        title: "Quên mật khẩu?",
        input: "email",
        inputLabel: "Nhập email của bạn",
        inputPlaceholder: "you@example.com",
        showCancelButton: true,
        confirmButtonText: "Gửi link khôi phục"
    }).then((result) => {
        if (result.isConfirmed) {
            auth.sendPasswordResetEmail(result.value)
                .then(() => {
                    Swal.fire({ icon: "success", title: "Đã gửi email", text: "Hãy kiểm tra hộp thư." });
                })
                .catch((error) => {
                    Swal.fire({ icon: "error", title: "Lỗi", text: error.message });
                });
        }
    });
}

// Đăng nhập bằng Google
const googleLoginButton = document.getElementById('google-login');
googleLoginButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();

    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Kiểm tra xem user đã có trong Firestore chưa
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (!userDoc.exists) {
            // Nếu lần đầu đăng nhập, lưu vào Firestore
            await db.collection("users").doc(user.uid).set({
                name: user.displayName,
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                userType: 0
            });
        }

        Swal.fire({
            icon: 'success',
            title: `Xin chào ${user.displayName || 'bạn'}!`,
            text: 'Đăng nhập Google thành công',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = "/index.html";
        });
    } catch (error) {
        Swal.fire({ icon: 'error', title: 'Lỗi Google Sign-In', text: error.message });
    }
});


// Hiển thị thông tin tài khoản nếu đã đăng nhập
function kiemtradangnhap() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const doc = await db.collection("users").doc(user.uid).get();
            const data = doc.data();
            const authContainer = document.querySelector('.auth-container');
            if (authContainer) {
                authContainer.innerHTML = `
                    <div class="navbar__item navbar__user-menu">
                        <a href="javascript:;" class="navbar__item-link">
                            ${user.displayName || data.name} <i class="fas fa-caret-down"></i>
                        </a>
                        <ul class="navbar__subnav user-dropdown">
                            <li class="subnav__item"><a href="javascript:;" onclick="myAccount()">Tài khoản của tôi</a></li>
                            <li class="subnav__item"><a href="javascript:;" id="logout">Đăng xuất</a></li>
                        </ul>
                    </div>
                `;
                document.getElementById('logout').addEventListener('click', logOut);

                if (data.userType == 1) {
                    let node = document.createElement(`li`);
                    node.innerHTML = `<a href="./admin.html"><i class="fa-light fa-gear"></i> Quản lý cửa hàng</a>`;
                    document.querySelector('.header-middle-right-menu')?.prepend(node);
                }
            } else {
                console.error('Không tìm thấy .auth-container');
            }
        }
    });
}





function logOut() {
    auth.signOut().then(() => {
        window.location.reload();
    });
}

function myAccount() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('trangchu')?.classList.add('hide');
    document.getElementById('account-user')?.classList.add('open');
    userInfo();

    
    window.location.href = "/FantaTour/account.html";

}

function userInfo() {
    // Placeholder nếu bạn muốn hiển thị chi tiết tài khoản người dùng
}

