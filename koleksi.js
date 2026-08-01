"use strict";

const state = {
    config: null,
    activeCategory: "semua",
    activeSort: "terbaru",
    query: "",
    favorites: new Set()
};

const elements = {
    backLink: document.getElementById("backLink"),
    headerTitle: document.getElementById("headerTitle"),
    headerFavorite: document.getElementById("headerFavorite"),
    pageEyebrow: document.getElementById("pageEyebrow"),
    pageTitle: document.getElementById("pageTitle"),
    pageTitleAccent: document.getElementById("pageTitleAccent"),
    pageDescription: document.getElementById("pageDescription"),
    searchInput: document.getElementById("searchInput"),
    clearSearch: document.getElementById("clearSearch"),
    categoryTitle: document.getElementById("categoryTitle"),
    productCount: document.getElementById("productCount"),
    categoryChips: document.getElementById("categoryChips"),
    sortControl: document.getElementById("sortControl"),
    segmentIndicator: document.getElementById("segmentIndicator"),
    productGrid: document.getElementById("productGrid"),
    emptyState: document.getElementById("emptyState"),
    emptyTitle: document.getElementById("emptyTitle"),
    emptyDescription: document.getElementById("emptyDescription"),
    loadError: document.getElementById("loadError"),
    bottomNavigation: document.getElementById("bottomNavigation")
};

function normalizeText(value = "") {
    return String(value).toLocaleLowerCase("id-ID").trim();
}

function escapeHtml(value = "") {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatPrice(price) {
    const { currencyLocale, currency } = state.config.meta;

    return new Intl.NumberFormat(currencyLocale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(price);
}

function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem("lumiere-favorites") || "[]");
        state.favorites = new Set(Array.isArray(saved) ? saved : []);
    } catch {
        state.favorites = new Set();
    }
}

function saveFavorites() {
    localStorage.setItem(
        "lumiere-favorites",
        JSON.stringify([...state.favorites])
    );
}

function renderPageContent() {
    const { meta, page } = state.config;

    document.title = meta.title;
    document.documentElement.lang = meta.language;

    elements.backLink.setAttribute("aria-label", page.backLabel);
    elements.headerFavorite.setAttribute("aria-label", page.favoriteLabel);
    elements.headerTitle.textContent = page.headerTitle;
    elements.pageEyebrow.textContent = page.eyebrow;
    elements.pageTitle.textContent = `${page.title} `;
    elements.pageTitleAccent.textContent = page.titleAccent;
    elements.pageDescription.textContent = page.description;
    elements.searchInput.placeholder = page.searchPlaceholder;
    elements.clearSearch.setAttribute("aria-label", page.clearSearchLabel);
    elements.categoryTitle.textContent = page.categoryTitle;
    elements.emptyTitle.textContent = page.emptyTitle;
    elements.emptyDescription.textContent = page.emptyDescription;
}

function renderCategories() {
    elements.categoryChips.innerHTML = state.config.categories
        .map((category) => {
            const active = category.id === state.activeCategory;

            return `
                <button
                    type="button"
                    data-category="${escapeHtml(category.id)}"
                    class="category-chip ${active ? "is-active" : "text-[#6e5a60]"}
                           whitespace-nowrap rounded-full border border-white/70
                           bg-white/45 px-5 py-2.5 text-xs font-semibold
                           uppercase tracking-wider">
                    ${escapeHtml(category.label)}
                </button>
            `;
        })
        .join("");

    elements.categoryChips
        .querySelectorAll("[data-category]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                state.activeCategory = button.dataset.category;
                renderCategories();
                renderProducts();
            });
        });
}

function renderSortOptions() {
    const options = state.config.sortOptions;
    const columnCount = options.length;

    elements.sortControl.style.gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;
    elements.segmentIndicator.style.width = `calc(${100 / columnCount}% - 0.25rem)`;

    const buttons = options
        .map((option, index) => {
            const active = option.id === state.activeSort;

            return `
                <button
                    type="button"
                    data-sort="${escapeHtml(option.id)}"
                    data-index="${index}"
                    class="sort-button relative z-10 rounded-full py-2
                           text-[12px] font-medium
                           ${active ? "text-[#1b0e11]" : "text-[#8a7a80]"}">
                    ${escapeHtml(option.label)}
                </button>
            `;
        })
        .join("");

    elements.sortControl.insertAdjacentHTML("beforeend", buttons);
    moveSortIndicator();

    elements.sortControl
        .querySelectorAll("[data-sort]")
        .forEach((button) => {
            button.addEventListener("click", () => {
                state.activeSort = button.dataset.sort;
                renderSortOptionsFresh();
                renderProducts();
            });
        });
}

function renderSortOptionsFresh() {
    elements.sortControl
        .querySelectorAll("[data-sort]")
        .forEach((button) => button.remove());

    renderSortOptions();
}

function moveSortIndicator() {
    const index = state.config.sortOptions.findIndex(
        (option) => option.id === state.activeSort
    );

    elements.segmentIndicator.style.transform = `translateX(${Math.max(index, 0) * 100}%)`;
}

function getVisibleProducts() {
    const normalizedQuery = normalizeText(state.query);

    return state.config.products
        .filter((product) => {
            const categoryMatches =
                state.activeCategory === "semua" ||
                product.categories.includes(state.activeCategory);

            const searchableText = normalizeText([
                product.name,
                ...product.categories,
                ...(product.tags || [])
            ].join(" "));

            const searchMatches =
                normalizedQuery === "" ||
                searchableText.includes(normalizedQuery);

            return categoryMatches && searchMatches;
        })
        .sort((a, b) => {
            const scoreA = Number(a.sortScores?.[state.activeSort] || 0);
            const scoreB = Number(b.sortScores?.[state.activeSort] || 0);

            if (scoreA !== scoreB) {
                return scoreB - scoreA;
            }

            return a.name.localeCompare(b.name, "id-ID");
        });
}

function createProductCard(product) {
    const isFavorite = state.favorites.has(product.id) || product.favorite;
    const safeName = escapeHtml(product.name);

    return `
        <article class="product-card group" data-product-id="${escapeHtml(product.id)}">
            <a href="${escapeHtml(product.href || "#")}" class="block">
                <div class="relative aspect-[3/4] overflow-hidden rounded-[2rem]
                            bg-white/60 shadow-glass border border-white/70">
                    <img
                        class="product-image h-full w-full object-cover"
                        src="${escapeHtml(product.image.src)}"
                        alt="${escapeHtml(product.image.alt)}"
                        loading="lazy"
                    />

                    <button
                        type="button"
                        data-favorite-id="${escapeHtml(product.id)}"
                        aria-label="${isFavorite ? "Hapus" : "Tambahkan"} ${safeName} ${isFavorite ? "dari" : "ke"} favorit"
                        class="favorite-button absolute right-3 top-3 w-9 h-9 rounded-full
                               glass-panel flex items-center justify-center
                               ${isFavorite ? "text-primary" : "text-[#6e5a60]"}
                               hover:text-primary active:scale-90 transition-all">
                        <span
                            class="material-symbols-outlined text-[20px]"
                            style="font-variation-settings: 'FILL' ${isFavorite ? 1 : 0};">
                            favorite
                        </span>
                    </button>
                </div>

                <div class="mt-3 text-center">
                    <h3 class="font-serif text-lg font-medium">${safeName}</h3>
                    <p class="mt-1 text-sm text-[#7c686e]">${formatPrice(product.price)}</p>
                </div>
            </a>
        </article>
    `;
}

function renderProducts() {
    const products = getVisibleProducts();
    const suffix = state.config.page.productSuffix;

    elements.productCount.textContent = `${products.length} ${suffix}`;
    elements.productGrid.innerHTML = products.map(createProductCard).join("");
    elements.productGrid.classList.toggle("hidden", products.length === 0);
    elements.emptyState.classList.toggle("hidden", products.length !== 0);

    bindFavoriteButtons();
    bindProductCards();
}

function bindFavoriteButtons() {
    elements.productGrid
        .querySelectorAll("[data-favorite-id]")
        .forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                const productId = button.dataset.favoriteId;

                if (state.favorites.has(productId)) {
                    state.favorites.delete(productId);
                } else {
                    state.favorites.add(productId);
                }

                saveFavorites();
                renderProducts();
            });
        });
}

let currentQuickLookProductId = null;

function getQuickLookElements() {
    return {
        backdrop: document.getElementById("quickLookBackdrop"),
        sheet: document.getElementById("quickLookSheet"),
        categoryPill: document.getElementById("qlCategoryPill"),
        closeBtn: document.getElementById("qlCloseBtn"),
        image: document.getElementById("qlImage"),
        favoriteBtn: document.getElementById("qlFavoriteBtn"),
        favoriteIcon: document.getElementById("qlFavoriteIcon"),
        title: document.getElementById("qlTitle"),
        price: document.getElementById("qlPrice"),
        description: document.getElementById("qlDescription"),
        tags: document.getElementById("qlTags"),
        detailLink: document.getElementById("qlDetailLink"),
        dragHandle: document.getElementById("qlDragHandle")
    };
}

function openQuickLook(product) {
    const ql = getQuickLookElements();
    if (!ql.sheet || !ql.backdrop) return;

    currentQuickLookProductId = product.id;

    const categoryObj = state.config.categories.find(c => c.id === product.category);
    ql.categoryPill.textContent = categoryObj ? categoryObj.label : (product.category || "Koleksi");

    ql.image.src = product.image.src;
    ql.image.alt = product.image.alt || product.name;
    ql.title.textContent = product.name;
    ql.price.textContent = formatPrice(product.price);
    ql.description.textContent = product.description || "Desain nail art eksklusif buatan tangan dengan material premium untuk momen istimewa Anda.";
    ql.detailLink.href = product.href || "#";

    const tagList = product.tags || ["Handmade", "Premium", "Reusable"];
    ql.tags.innerHTML = tagList.map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join("");

    updateQuickLookFavoriteBtn();

    ql.backdrop.classList.add("is-active");
    ql.backdrop.setAttribute("aria-hidden", "false");
    ql.sheet.classList.add("is-active");
    ql.sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function updateQuickLookFavoriteBtn() {
    const ql = getQuickLookElements();
    if (!ql.favoriteBtn || !currentQuickLookProductId) return;

    const isFav = state.favorites.has(currentQuickLookProductId);
    ql.favoriteBtn.classList.toggle("text-primary", isFav);
    ql.favoriteBtn.classList.toggle("text-[#6e5a60]", !isFav);
    ql.favoriteIcon.style.fontVariationSettings = `'FILL' ${isFav ? 1 : 0}`;
}

function closeQuickLook() {
    const ql = getQuickLookElements();
    if (!ql.sheet || !ql.backdrop) return;

    ql.backdrop.classList.remove("is-active");
    ql.backdrop.setAttribute("aria-hidden", "true");
    ql.sheet.classList.remove("is-active");
    ql.sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    currentQuickLookProductId = null;
}

function bindQuickLookEvents() {
    const ql = getQuickLookElements();
    if (!ql.sheet) return;

    ql.closeBtn.addEventListener("click", closeQuickLook);
    ql.backdrop.addEventListener("click", closeQuickLook);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && ql.sheet.classList.contains("is-active")) {
            closeQuickLook();
        }
    });

    ql.favoriteBtn.addEventListener("click", () => {
        if (!currentQuickLookProductId) return;
        if (state.favorites.has(currentQuickLookProductId)) {
            state.favorites.delete(currentQuickLookProductId);
        } else {
            state.favorites.add(currentQuickLookProductId);
        }
        saveFavorites();
        updateQuickLookFavoriteBtn();
        renderProducts();
    });

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    ql.sheet.addEventListener("touchstart", (e) => {
        if (ql.sheet.scrollTop <= 0) {
            startY = e.touches[0].clientY;
            isDragging = true;
        }
    }, { passive: true });

    ql.sheet.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        if (diff > 0) {
            ql.sheet.style.transform = `translateX(-50%) translateY(${diff}px)`;
        }
    }, { passive: true });

    ql.sheet.addEventListener("touchend", () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentY - startY;
        if (diff > 80) {
            closeQuickLook();
        }
        ql.sheet.style.transform = "";
    });
}

function bindProductCards() {
    elements.productGrid.querySelectorAll("article.product-card").forEach((card) => {
        card.addEventListener("click", (event) => {
            if (event.target.closest("[data-favorite-id]")) return;

            event.preventDefault();
            event.stopPropagation();
            const productId = card.dataset.productId;
            const product = state.config.products.find((p) => p.id === productId);
            if (product) {
                openQuickLook(product);
            }
        });
    });
}

function renderNavigation() {
    const items = state.config.navigation
        .map((item) => {
            if (item.type === "primaryAction") {
                return `
                    <a
                        href="${escapeHtml(item.href)}"
                        aria-label="${escapeHtml(item.label)}"
                        class="relative -top-6 flex items-center justify-center
                               w-14 h-14 rounded-full glass-panel shadow-glass-hover
                               border-white/80 transition-all duration-300
                               hover:scale-110 active:scale-95"
                        style="background: rgba(255, 255, 255, 0.8);
                               backdrop-filter: blur(24px);">
                        <span class="material-symbols-outlined text-[32px] font-bold text-primary">
                            ${escapeHtml(item.icon)}
                        </span>
                    </a>
                `;
            }

            return `
                <a
                    href="${escapeHtml(item.href)}"
                    ${item.active ? 'aria-current="page"' : ""}
                    aria-label="${escapeHtml(item.label)}"
                    class="flex flex-col items-center gap-1 group relative">
                    <span class="material-symbols-outlined
                                 ${item.active ? "text-primary" : "text-[#8a7a80] group-hover:text-[#5e4a4f]"}
                                 text-[28px] transition-colors group-hover:scale-110">
                        ${escapeHtml(item.icon)}
                    </span>
                    ${item.badge ? `
                        <span class="absolute top-0 right-[-4px] w-2 h-2
                                     rounded-full bg-primary border border-white"></span>
                    ` : ""}
                    <span class="w-1 h-1 rounded-full mt-1
                                 ${item.active ? "bg-primary" : "bg-transparent"}"></span>
                </a>
            `;
        })
        .join("");

    elements.bottomNavigation.innerHTML = `
        <div class="glass-pill-nav rounded-full px-8 py-4 pointer-events-auto
                    flex items-center justify-around gap-6">
            ${items}
        </div>
    `;
}

function bindStaticEvents() {
    bindQuickLookEvents();

    elements.searchInput.addEventListener("input", (event) => {
        state.query = event.target.value.trim().toLowerCase();
        elements.clearSearch.classList.toggle("hidden", state.query.length === 0);
        elements.clearSearch.classList.toggle("flex", state.query.length > 0);
        renderProducts();
    });

    elements.clearSearch.addEventListener("click", () => {
        state.query = "";
        elements.searchInput.value = "";
        elements.searchInput.focus();
        elements.clearSearch.classList.add("hidden");
        elements.clearSearch.classList.remove("flex");
        renderProducts();
    });

    elements.headerFavorite.addEventListener("click", () => {
        state.activeCategory = "semua";
        state.query = "";
        elements.searchInput.value = "";
        renderCategories();

        const favoriteProducts = state.config.products.filter((product) =>
            state.favorites.has(product.id)
        );

        elements.productGrid.innerHTML = favoriteProducts.map(createProductCard).join("");
        elements.productCount.textContent =
            `${favoriteProducts.length} ${state.config.page.productSuffix}`;
        elements.productGrid.classList.toggle("hidden", favoriteProducts.length === 0);
        elements.emptyState.classList.toggle("hidden", favoriteProducts.length !== 0);
        bindFavoriteButtons();
        bindProductCards();
    });
}

async function initializeCollection() {
    const startTime = Date.now();
    const skeletonContainer = document.getElementById("skeletonContainer");

    try {
        const response = await fetch("./koleksi.json", { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        state.config = await response.json();
        loadFavorites();
        renderPageContent();
        renderCategories();
        renderSortOptions();
        renderProducts();
        renderNavigation();
        bindStaticEvents();

        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, 500 - elapsedTime);

        setTimeout(() => {
            if (skeletonContainer) {
                skeletonContainer.classList.add("skeleton-fade-out");

                setTimeout(() => {
                    skeletonContainer.style.display = "none";
                    skeletonContainer.remove();
                }, 280);
            }
        }, remainingDelay);
    } catch (error) {
        console.error("Gagal memuat koleksi.json:", error);
        if (skeletonContainer) {
            skeletonContainer.style.display = "none";
            skeletonContainer.remove();
        }
        elements.loadError.classList.remove("hidden");
        elements.productGrid.classList.add("hidden");
    }
}

document.addEventListener("DOMContentLoaded", initializeCollection);
