// Mock Clipboard History Data
let initialItems = [
    {
        id: "item-1",
        type: "text",
        content: "git clone https://github.com/Milanchetry21/CopyPaste.git",
        subtitle: "Git Command Snippet",
        time: "just now",
        icon: "terminal"
    },
    {
        id: "item-2",
        type: "color",
        content: "#6C5CE7",
        subtitle: "Hex Color Code",
        time: "5m ago",
        colorVal: "#6C5CE7"
    },
    {
        id: "item-3",
        type: "url",
        content: "https://github.com/Milanchetry21/CopyPaste",
        domain: "github.com",
        subtitle: "Milanchetry21/CopyPaste",
        time: "12m ago",
        icon: "link"
    },
    {
        id: "item-4",
        type: "image",
        content: "[Image Clipping: 420x280 PNG]",
        subtitle: "CopyPaste App Icon Mockup",
        time: "1h ago",
        bgGradient: "linear-gradient(135deg, #6a55fa, #25c4f2)",
        icon: "image"
    },
    {
        id: "item-5",
        type: "text",
        content: "import SwiftUI\n\nstruct CopyApp: App {\n    var body: some Scene {\n        Settings {\n            EmptyView()\n        }\n    }\n}",
        subtitle: "Swift App Delegate Code",
        time: "3h ago",
        icon: "code"
    }
];

let items = [...initialItems];
let maxLimit = 20;
let isPinned = false;

// DOM Elements
const listScreen = document.getElementById("listScreen");
const settingsScreen = document.getElementById("settingsScreen");
const panelList = document.getElementById("panelList");
const searchInput = document.getElementById("searchInput");
const searchClearBtn = document.getElementById("searchClearBtn");
const limitLabel = document.getElementById("limitLabel");
const pinBtn = document.getElementById("pinBtn");
const settingsBtn = document.getElementById("settingsBtn");
const settingsBackBtn = document.getElementById("settingsBackBtn");
const appPanel = document.getElementById("appPanel");

// Footer Elements
const clearBtn = document.getElementById("clearBtn");
const clearConfirmWrapper = document.getElementById("clearConfirmWrapper");
const confirmClearBtn = document.getElementById("confirmClearBtn");
const cancelClearBtn = document.getElementById("cancelClearBtn");
const quitBtn = document.getElementById("quitBtn");

// Settings Elements
const shortcutPicker = document.getElementById("shortcutPicker");
const limitPicker = document.getElementById("limitPicker");

// Browser Output Elements
const clipboardOutput = document.getElementById("clipboardOutput");
const clipLight = document.getElementById("clipLight");

// Initialize Application Simulator
function init() {
    renderList(items);
    setupEventListeners();
    updateLimitBadge();
}

// Render Clipboard List
function renderList(filteredList) {
    panelList.innerHTML = "";
    
    if (filteredList.length === 0) {
        // Render Empty State
        const isSearching = searchInput.value.trim().length > 0;
        
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "empty-state";
        
        const icon = isSearching ? "search" : "clipboard";
        const title = isSearching ? "No Matches Found" : "No Copy History";
        const desc = isSearching 
            ? "Try searching for a different keyword." 
            : "Your copied items will appear here.";
            
        emptyDiv.innerHTML = `
            <div class="empty-state-icon"><i data-lucide="${icon}"></i></div>
            <div class="empty-state-title">${title}</div>
            <div class="empty-state-desc">${desc}</div>
        `;
        panelList.appendChild(emptyDiv);
        lucide.createIcons();
        return;
    }
    
    filteredList.forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.className = "list-item";
        itemEl.id = item.id;
        
        // Inner Content HTML based on type
        let iconHTML = "";
        let detailsHTML = "";
        
        if (item.type === "color") {
            iconHTML = `<div class="item-color-dot" style="background-color: ${item.colorVal}"></div>`;
            detailsHTML = `
                <div class="item-meta-row">
                    <span class="item-mono-bold">${item.content}</span>
                    <span class="item-time">${item.time}</span>
                </div>
                <div class="item-subtext">${item.subtitle}</div>
            `;
        } else if (item.type === "url") {
            iconHTML = `
                <div class="item-icon-wrapper url">
                    <i data-lucide="${item.icon}"></i>
                </div>
            `;
            detailsHTML = `
                <div class="item-meta-row">
                    <span class="item-title-bold">${item.domain}</span>
                    <span class="item-time">${item.time}</span>
                </div>
                <div class="item-subtext">${item.subtitle}</div>
            `;
        } else if (item.type === "image") {
            iconHTML = `<div class="item-img-preview" style="background-image: ${item.bgGradient}"></div>`;
            detailsHTML = `
                <div class="item-meta-row">
                    <span class="item-content-preview font-semibold">Image Clipping</span>
                    <span class="item-time">${item.time}</span>
                </div>
                <div class="item-subtext">${item.subtitle}</div>
            `;
        } else {
            // Text or code
            iconHTML = `
                <div class="item-icon-wrapper text">
                    <i data-lucide="${item.icon}"></i>
                </div>
            `;
            detailsHTML = `
                <div class="item-details">
                    <span class="item-content-preview">${escapeHtml(item.content)}</span>
                    <span class="item-time">${item.time}</span>
                </div>
            `;
        }
        
        itemEl.innerHTML = `
            ${iconHTML}
            <div class="item-details">${detailsHTML}</div>
            <div class="item-action-area">
                <i data-lucide="check" class="checkmark-icon" style="display: none;"></i>
                <button class="trash-row-btn" data-id="${item.id}" title="Delete item">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        
        // Bind click on row to copy
        itemEl.addEventListener("click", (e) => {
            // If trash button clicked, do not copy
            if (e.target.closest(".trash-row-btn")) {
                return;
            }
            copyItem(item, itemEl);
        });
        
        // Bind trash button click
        const trashBtn = itemEl.querySelector(".trash-row-btn");
        trashBtn.addEventListener("click", () => {
            deleteItem(item.id);
        });
        
        panelList.appendChild(itemEl);
    });
    
    // Refresh lucide icons
    lucide.createIcons();
}

// Escape HTML utility
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Copy Action handler
function copyItem(item, element) {
    // Show visual click highlight in mockup
    element.classList.add("copied");
    const checkmark = element.querySelector(".checkmark-icon");
    const trashBtn = element.querySelector(".trash-row-btn");
    
    if (checkmark) checkmark.style.display = "block";
    if (trashBtn) trashBtn.style.display = "none";
    
    // Copy content to simulated OS clipboard
    clipboardOutput.textContent = item.content;
    
    // Trigger OS clipboard flash
    clipLight.classList.add("active");
    clipLight.classList.remove("animate-pulse");
    
    // Try copying to actual user clipboard
    if (navigator.clipboard) {
        navigator.clipboard.writeText(item.content).catch(err => {
            console.log("Clipboard write blocked or unsupported.", err);
        });
    }
    
    // Reset copy indicator state after delay
    setTimeout(() => {
        element.classList.remove("copied");
        if (checkmark) checkmark.style.display = "none";
        if (trashBtn) trashBtn.style.display = "";
    }, 1200);
    
    setTimeout(() => {
        clipLight.classList.remove("active");
        clipLight.classList.add("animate-pulse");
    }, 1500);
}

// Delete Item handler
function deleteItem(itemId) {
    items = items.filter(i => i.id !== itemId);
    const query = searchInput.value.toLowerCase().trim();
    const filtered = items.filter(i => 
        i.content.toLowerCase().includes(query) || 
        (i.subtitle && i.subtitle.toLowerCase().includes(query))
    );
    renderList(filtered);
    updateLimitBadge();
}

// Update limit status badge
function updateLimitBadge() {
    limitLabel.textContent = `${items.length}/${maxLimit}`;
}

// Setup Event Handlers
function setupEventListeners() {
    // Realtime Search Filtering
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length > 0) {
            searchClearBtn.style.display = "block";
        } else {
            searchClearBtn.style.display = "none";
        }
        
        const filtered = items.filter(i => 
            i.content.toLowerCase().includes(query) || 
            (i.subtitle && i.subtitle.toLowerCase().includes(query))
        );
        renderList(filtered);
    });
    
    // Search Clear Button
    searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchClearBtn.style.display = "none";
        renderList(items);
        searchInput.focus();
    });
    
    // Toggle Pin Mode
    pinBtn.addEventListener("click", () => {
        isPinned = !isPinned;
        if (isPinned) {
            pinBtn.classList.add("active");
            appPanel.classList.add("pinned");
        } else {
            pinBtn.classList.remove("active");
            appPanel.classList.remove("pinned");
        }
    });
    
    // Toggle Settings Screen
    settingsBtn.addEventListener("click", () => {
        listScreen.style.display = "none";
        settingsScreen.style.display = "flex";
    });
    
    settingsBackBtn.addEventListener("click", () => {
        settingsScreen.style.display = "none";
        listScreen.style.display = "flex";
    });
    
    // Storage Limit picker
    limitPicker.addEventListener("change", (e) => {
        maxLimit = parseInt(e.target.value, 10);
        updateLimitBadge();
    });
    
    // Clear list history states
    clearBtn.addEventListener("click", () => {
        clearBtn.style.display = "none";
        clearConfirmWrapper.style.display = "flex";
    });
    
    cancelClearBtn.addEventListener("click", () => {
        clearConfirmWrapper.style.display = "none";
        clearBtn.style.display = "flex";
    });
    
    confirmClearBtn.addEventListener("click", () => {
        items = [];
        renderList(items);
        updateLimitBadge();
        clearConfirmWrapper.style.display = "none";
        clearBtn.style.display = "flex";
    });
    
    // Quit application simulator
    quitBtn.addEventListener("click", () => {
        // Reset everything to initial
        items = [...initialItems];
        renderList(items);
        updateLimitBadge();
        searchInput.value = "";
        searchClearBtn.style.display = "none";
        clipboardOutput.textContent = "Empty. Try clicking an item in the app simulator above!";
        
        // Visual indicator that it was 'terminated' and rebooted
        appPanel.style.opacity = "0.2";
        setTimeout(() => {
            appPanel.style.opacity = "1";
        }, 600);
    });
}

// Boot application
init();
