
// Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5001'
    : 'https://whytrip-backend-production.up.railway.app';

function myFunction() {
    var x = document.getElementById("myInput");
    var y = document.getElementById("hide");
    var z = document.getElementById("hide2");

    if (x.type === 'password') {
        x.type = "text";
        y.style.display = "block";
        z.style.display = "none";
    }
    else {
        x.type = "text";
        y.style.display = "none";
        z.style.display = "block";
    }
}

if ($('.header-slider').length && typeof $.fn.owlCarousel === 'function') {
    $('.header-slider').owlCarousel({
        center: true,
        stagePadding: 50,
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });
}

const nextIcon = '<img src="assets/img/right-arrow.svg" alt="right" class="img-arrow">';
const prevIcon = '<img src="assets/img/left-arrow.svg" alt="left" class="img-arrow">';

// Function to initialize carousels
function initCarousels(selector) {
    if (!selector) selector = '.owl-carousel';
    if ($(selector).length && typeof $.fn.owlCarousel === 'function') {
        $(selector).owlCarousel({
            loop: false,
            margin: 15,
            dots: false,
            nav: true,
            navText: [
                prevIcon,
                nextIcon
            ],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 1
                },
                1000: {
                    items: 3
                }
            }
        });
    }
}

// Fetch destinations if we are on the page with popular destinations
const popularContainer = document.getElementById('popular-destinations-carousel');
if (popularContainer) {
    fetch(`${API_BASE_URL}/api/destinations`)
        .then(res => res.json())
        .then(data => {
            let htmlHTML = '';
            // Only show up to 5 destinations on homepage for layout
            const displayData = data.slice(0, 5);
            displayData.forEach(dest => {
                htmlHTML += `
                    <div class="items">
                        <a href="detail-page.html?id=${dest.id}">
                            <div class="card-travel d-flex flex-column"
                                style="background-image: url('${dest.image_url || 'assets/img/1.png'}');">
                                <div class="travel-content">
                                    <h3>${dest.name}</h3>
                                    <p>${dest.location}</p>
                                    <div class="rating d-flex flex-row">
                                        <img src="assets/img/star.png" alt=""> 
                                        <p>4.9 <span>(0 Review)</span> </p>
                                    </div>  
                                </div>
                            </div>
                        </a>
                    </div>
                `;
            });
            popularContainer.innerHTML = htmlHTML;
            // Initialize after data is added
            initCarousels('#popular-destinations-carousel');
        })
        .catch(err => {
            console.error('Error fetching destinations:', err);
            // Initialize anyway so other carousels don't break
            initCarousels('#popular-destinations-carousel');
        });
} else {
    // If we're on a page without the popular container, just init immediately
    initCarousels('.owl-carousel:not(.owl-loaded)');
}

// Fetch destination details if we are on the detail page
const urlParams = new URLSearchParams(window.location.search);
const destinationId = urlParams.get('id');

const detailTitle = document.getElementById('detail-title');
if (destinationId && detailTitle) {
    fetch(`${API_BASE_URL}/api/destinations/${destinationId}`)
        .then(res => res.json())
        .then(data => {
            if (data && !data.error) {
                detailTitle.innerText = data.name;

                const detailLocation = document.getElementById('detail-location');
                if (detailLocation) detailLocation.innerText = data.location;

                const detailDesc = document.getElementById('detail-description');
                if (detailDesc) detailDesc.innerText = data.description || 'Deskripsi belum tersedia.';

                // Set the images if data.image_url exists
                if (data.image_url) {
                    const img1 = document.getElementById('detail-img-1');
                    const img2 = document.getElementById('detail-img-2');
                    if (img1) img1.src = data.image_url;
                    if (img2) img2.src = data.image_url;
                }

                // Fetch and render reviews
                fetchReviews(destinationId);
            } else {
                detailTitle.innerText = 'Destinasi Tidak Ditemukan';
            }
        })
        .catch(err => {
            console.error('Error fetching destination details:', err);
            detailTitle.innerText = 'Gagal Memuat Destinasi';
        });
}

function fetchReviews(destId) {
    const reviewsContainer = document.getElementById('detail-reviews');
    if (!reviewsContainer) return;

    fetch(`${API_BASE_URL}/api/destinations/${destId}/reviews`)
        .then(res => res.json())
        .then(reviews => {
            if (reviews.error || !Array.isArray(reviews)) {
                reviewsContainer.innerHTML = '<p class="text-center text-muted">Gagal memuat ulasan.</p>';
                return;
            }

            if (reviews.length === 0) {
                reviewsContainer.innerHTML = '<p class="text-center text-muted">Belum ada ulasan untuk wisata ini. Jadilah yang pertama!</p>';
                return;
            }

            let html = '';
            let totalRating = 0;

            reviews.forEach(review => {
                totalRating += review.rating;
                const d = new Date(review.created_at);
                const dateStr = d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

                html += `
                    <div class="comment">
                        <div class="reviewer">
                            <div class="d-flex">
                                <div class="reviewer-images">
                                    <img src="assets/img/review.png" alt="User">
                                </div>
                                <div class="ml-3">
                                    <p class="title">${review.user_name}</p>
                                    <span class="text-warning font-weight-bold">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="reviewer-comment ml-5">
                            <p class="date">${dateStr}</p>
                            <p class="review">${review.comment}</p>
                            <hr class="hr-review">
                        </div>
                    </div>
                `;
            });

            reviewsContainer.innerHTML = html;

            // Update rating summary
            const ratingEl = document.getElementById('detail-rating');
            if (ratingEl) {
                const avgRating = (totalRating / reviews.length).toFixed(1);
                ratingEl.innerHTML = `${avgRating} <span id="detail-review-count">(${reviews.length} Review)</span>`;
            }
        })
        .catch(err => {
            console.error('Error fetching reviews:', err);
            reviewsContainer.innerHTML = '<p class="text-center text-muted">Gagal memuat ulasan.</p>';
        });
}

// Submit Review Handler
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('whytrip_token');
        const messageBox = document.getElementById('reviewMessage');
        const submitBtn = document.getElementById('btnSubmitReview');

        if (!token) {
            messageBox.style.color = 'red';
            messageBox.innerText = 'Anda harus login untuk mengirim ulasan.';
            return;
        }

        const comment = document.getElementById('reviewComment').value;
        const ratingInput = document.querySelector('input[name="reviewRating"]:checked');

        if (!ratingInput) {
            messageBox.style.color = 'red';
            messageBox.innerText = 'Harap berikan rating bintang.';
            return;
        }

        const rating = parseInt(ratingInput.value);

        submitBtn.innerText = 'Mengirim...';
        submitBtn.disabled = true;

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const destId = urlParams.get('id');

            const response = await fetch(`${API_BASE_URL}/api/destinations/${destId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });

            const data = await response.json();

            if (response.ok) {
                messageBox.style.color = 'green';
                messageBox.innerText = 'Ulasan berhasil dikirim!';

                // Reset form
                reviewForm.reset();

                // Refresh reviews
                fetchReviews(destId);

                // Hide modal after a short delay
                setTimeout(() => {
                    $('#modalReview').modal('hide');
                    messageBox.innerText = '';
                    submitBtn.innerText = 'OK';
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                messageBox.style.color = 'red';
                messageBox.innerText = data.error || 'Terjadi kesalahan saat mengirim ulasan.';
                submitBtn.innerText = 'OK';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            messageBox.style.color = 'red';
            messageBox.innerText = 'Gagal terhubung ke server.';
            submitBtn.innerText = 'OK';
            submitBtn.disabled = false;
        }
    });
}

// Fetch all destinations for list-wisata.html
const allDestinationsContainer = document.getElementById('all-destinations-container');
if (allDestinationsContainer) {
    fetch(`${API_BASE_URL}/api/destinations`)
        .then(res => res.json())
        .then(data => {
            const urlParams = new URLSearchParams(window.location.search);
            const provinceFilter = urlParams.get('province');

            let filteredData = data;
            if (provinceFilter) {
                filteredData = data.filter(dest => dest.province === provinceFilter);
            }

            const pageTitle = document.querySelector('.kategori .main-title h2');
            if (pageTitle && provinceFilter) {
                pageTitle.innerText = `List Destinasi Wisata di ${provinceFilter}`;
            }

            if (filteredData.length === 0) {
                allDestinationsContainer.innerHTML = '<p class="text-center text-muted col-12">Belum ada destinasi wisata.</p>';
                return;
            }

            let html = '';
            filteredData.forEach(dest => {
                html += `
                    <div class="col-sm-6 col-md-4 col-lg-4 mb-4">
                        <a href="detail-page.html?id=${dest.id}">
                            <div class="card-travel d-flex flex-column" style="background-image: url('${dest.image_url || 'assets/img/1.png'}');">
                                <div class="travel-content">
                                    <h3>${dest.name}</h3>
                                    <p>${dest.location}</p>
                                    <img src="assets/img/star.png" alt=""> 4.9 <span>(0 Review)</span>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
            });
            allDestinationsContainer.innerHTML = html;
        })
        .catch(err => {
            console.error('Error fetching destinations:', err);
            allDestinationsContainer.innerHTML = '<p class="text-center text-danger col-12">Gagal memuat destinasi wisata.</p>';
        });
}

// Fetch grouped regions for list-daerah.html
const regionsContainer = document.getElementById('regions-container');
if (regionsContainer) {
    fetch(`${API_BASE_URL}/api/destinations`)
        .then(res => res.json())
        .then(data => {
            const regionMaps = {};
            data.forEach(dest => {
                if (!regionMaps[dest.province]) {
                    regionMaps[dest.province] = {
                        count: 0,
                        image: dest.image_url || 'assets/img/1.png'
                    };
                }
                regionMaps[dest.province].count += 1;
            });

            const provinces = Object.entries(regionMaps);
            if (provinces.length === 0) {
                regionsContainer.innerHTML = '<p class="text-center text-muted col-12">Belum ada data daerah.</p>';
                return;
            }

            let html = '';
            for (const [province, info] of provinces) {
                html += `
                    <div class="col-sm-6 col-md-4 col-lg-4 mb-4">
                        <a href="list-wisata.html?province=${encodeURIComponent(province)}">
                            <div class="card-travel text-center d-flex flex-column" style="background-image: url('${info.image}');">
                                <div class="travel-text text-center">
                                    <h3>${province}</h3>
                                    <p>${info.count} Tempat Wisata</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
            }
            regionsContainer.innerHTML = html;
        })
        .catch(err => {
            console.error('Error fetching regions:', err);
            regionsContainer.innerHTML = '<p class="text-center text-danger col-12">Gagal memuat daerah.</p>';
        });
}
// Registration Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const messageBox = document.getElementById('registerMessage');
        const submitBtn = document.getElementById('btnSignUp');

        if (password !== confirmPassword) {
            messageBox.style.color = 'red';
            messageBox.innerText = 'Password dan Konfirmasi Password tidak cocok!';
            return;
        }

        submitBtn.innerText = 'Tunggu Sebentar...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                messageBox.style.color = 'green';
                messageBox.innerText = 'Registrasi berhasil! Mengalihkan ke halaman Login...';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                messageBox.style.color = 'red';
                messageBox.innerText = data.error || 'Terjadi kesalahan saat registrasi.';
                submitBtn.innerText = 'Sign Up';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            messageBox.style.color = 'red';
            messageBox.innerText = 'Gagal terhubung ke server.';
            submitBtn.innerText = 'Sign Up';
            submitBtn.disabled = false;
        }
    });
}

// Check Authentication Status and Update Navbar
function checkAuth() {
    const token = localStorage.getItem('whytrip_token');
    let userStr = localStorage.getItem('whytrip_user');

    if (token && !userStr) {
        userStr = JSON.stringify({ name: 'admin' });
        localStorage.setItem('whytrip_user', userStr);
    }

    // Elements to update
    const authDesktop = document.getElementById('auth-desktop');
    const authMobile = document.getElementById('auth-mobile');

    if (token && userStr) {
        const user = JSON.parse(userStr);
        // User is logged in
        const loggedInHTML = `
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="background-color: transparent; border: none; color: #FFFFFF; font-weight: bold;">
                    Halo, ${user.name}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" onclick="logout(event)">Logout</a>
                </div>
            </div>
        `;

        // Mobile specific logout button
        const mobileLoggedInHTML = `
            <div class="my-2 mb-4 text-center">
                <span style="font-weight: bold; color: #FFFFFF;">Halo, ${user.name}</span>
            </div>
            <button class="btn btn-login my-2 my-sm-0 px-4 w-100" onclick="logout(event)">
                Logout
            </button>
        `;

        if (authDesktop) authDesktop.innerHTML = loggedInHTML;
        if (authMobile) authMobile.innerHTML = mobileLoggedInHTML;
    }
}

// Global logout function
window.logout = function (e) {
    if (e) e.preventDefault();
    localStorage.removeItem('whytrip_token');
    localStorage.removeItem('whytrip_user');
    window.location.reload();
}

// Run auth check on load
document.addEventListener('DOMContentLoaded', checkAuth);

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const messageBox = document.getElementById('loginMessage');
        const submitBtn = document.getElementById('btnLogin');

        submitBtn.innerText = 'Tunggu Sebentar...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Store token and user data
                localStorage.setItem('whytrip_token', data.token);
                localStorage.setItem('whytrip_user', JSON.stringify(data.user));

                messageBox.style.color = 'green';
                messageBox.innerText = 'Login berhasil! Mengalihkan...';

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                messageBox.style.color = 'red';
                messageBox.innerText = data.error || 'Email atau Password salah.';
                submitBtn.innerText = 'Login';
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error:', error);
            messageBox.style.color = 'red';
            messageBox.innerText = 'Gagal terhubung ke server.';
            submitBtn.innerText = 'Login';
            submitBtn.disabled = false;
        }
    });
}

// Search Feature
const btnSearch = document.getElementById('btn-search');
if (btnSearch) {
    btnSearch.addEventListener('click', () => {
        const type = document.getElementById('search-type').value;
        const location = document.getElementById('search-location').value;
        window.location.href = `list-wisata.html?province=${encodeURIComponent(location)}&type=${encodeURIComponent(type)}`;
    });
}

// Fetch regions for index.html carousel
const regionsCarouselContainer = document.getElementById('regions-carousel-container');
if (regionsCarouselContainer) {
    fetch(`${API_BASE_URL}/api/destinations`)
        .then(res => res.json())
        .then(data => {
            const regionMaps = {};
            data.forEach(dest => {
                if (!regionMaps[dest.province]) {
                    regionMaps[dest.province] = { count: 0, image: dest.image_url || 'assets/img/1.png' };
                }
                regionMaps[dest.province].count += 1;
            });
            let html = '';
            for (const [province, info] of Object.entries(regionMaps)) {
                html += `
                    <div class="items">
                        <a href="list-wisata.html?province=${encodeURIComponent(province)}">
                            <div class="card-travel text-center d-flex flex-column" style="background-image: url('${info.image}');">
                                <div class="travel-text text-center">
                                    <h3>${province}</h3>
                                    <p>${info.count} Tempat Wisata</p>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
            }
            regionsCarouselContainer.innerHTML = html;
            initCarousels('#regions-carousel-container');
        })
        .catch(err => console.error(err));
}

// Fetch Testimonials for index.html carousel
const testimonialContainer = document.getElementById('testi-card');
if (testimonialContainer) {
    fetch(`${API_BASE_URL}/api/reviews`)
        .then(res => res.json())
        .then(data => {
            if (data.length === 0) {
                testimonialContainer.innerHTML = '<p class="text-center w-100">Belum ada testimoni.</p>';
                return;
            }
            let html = '';
            data.forEach(review => {
                html += `
                    <div class="items">
                        <div class="card card-testimonial" style="min-height: 250px;">
                            <div class="content mt-4 ml-4 mr-4">
                                <p class="testimonial">"${review.comment}"</p>
                                <div class="person mt-4 mb-4">
                                    <div class="testimonial-pict">
                                        <img src="assets/img/review.png" alt="User">
                                    </div>
                                    <div class="testimonial-content ml-2">
                                        <p class="name">${review.user_name}</p>
                                        <p class="job">Traveler</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            testimonialContainer.innerHTML = html;
            initCarousels('#testi-card');
        })
        .catch(err => console.error(err));
}
