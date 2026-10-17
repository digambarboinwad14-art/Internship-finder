// InternFlow - Core Application Logic

// State
let appState = {
  activeView: 'browse', // 'browse', 'saved', 'dashboard'
  internships: [...INITIAL_INTERNSHIPS],
  savedIds: JSON.parse(localStorage.getItem('internflow_saved_ids') || '[]'),
  applications: JSON.parse(localStorage.getItem('internflow_applications') || '[]'),
  filters: {
    search: '',
    domain: 'All Domains',
    workplaceType: 'All Types',
    duration: 'Any Duration',
    minStipend: 0,
    sortBy: 'newest'
  },
  selectedInternshipId: null,
  activeModal: null, // 'detail', 'apply', 'view-app'
  currentResumeFile: null
};

// Storage Helpers
function saveSavedIds() {
  localStorage.setItem('internflow_saved_ids', JSON.stringify(appState.savedIds));
  updateNavCounters();
}

function saveApplications() {
  localStorage.setItem('internflow_applications', JSON.stringify(appState.applications));
  updateNavCounters();
}

function updateNavCounters() {
  const savedCountEl = document.getElementById('nav-saved-count');
  const dashCountEl = document.getElementById('nav-applied-count');

  if (savedCountEl) {
    savedCountEl.textContent = appState.savedIds.length;
    savedCountEl.style.display = appState.savedIds.length > 0 ? 'inline-flex' : 'none';
  }
  if (dashCountEl) {
    dashCountEl.textContent = appState.applications.length;
    dashCountEl.style.display = appState.applications.length > 0 ? 'inline-flex' : 'none';
  }
}

// Toast Notifications
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 ${
    type === 'success'
      ? 'bg-slate-900 text-white border-slate-700'
      : type === 'info'
      ? 'bg-indigo-600 text-white border-indigo-500'
      : 'bg-rose-600 text-white border-rose-500'
  }`;

  const iconName = type === 'success' ? 'check-circle-2' : type === 'info' ? 'info' : 'alert-circle';
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 flex-shrink-0"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Navigation switcher
function switchView(viewName) {
  appState.activeView = viewName;
  document.querySelectorAll('.view-container').forEach(el => el.classList.add('hidden'));

  const activeContainer = document.getElementById(`view-${viewName}`);
  if (activeContainer) {
    activeContainer.classList.remove('hidden');
  }

  // Update tabs highlight
  document.querySelectorAll('.nav-link-btn').forEach(btn => {
    if (btn.dataset.view === viewName) {
      btn.classList.add('text-indigo-600', 'font-semibold', 'border-indigo-600');
      btn.classList.remove('text-slate-600', 'border-transparent');
    } else {
      btn.classList.remove('text-indigo-600', 'font-semibold', 'border-indigo-600');
      btn.classList.add('text-slate-600', 'border-transparent');
    }
  });

  if (viewName === 'browse') {
    renderInternshipList();
  } else if (viewName === 'saved') {
    renderSavedList();
  } else if (viewName === 'dashboard') {
    renderDashboard();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Filters & Search
function getFilteredInternships() {
  return appState.internships.filter(item => {
    // Search keyword
    if (appState.filters.search.trim()) {
      const q = appState.filters.search.toLowerCase();
      const inTitle = item.title.toLowerCase().includes(q);
      const inCompany = item.company.toLowerCase().includes(q);
      const inDesc = item.description.toLowerCase().includes(q);
      const inTags = item.tags.some(t => t.toLowerCase().includes(q));
      if (!inTitle && !inCompany && !inDesc && !inTags) {
        return false;
      }
    }

    // Domain
    if (appState.filters.domain !== 'All Domains' && item.domain !== appState.filters.domain) {
      return false;
    }

    // Workplace Type
    if (appState.filters.workplaceType !== 'All Types' && item.workplaceType !== appState.filters.workplaceType) {
      return false;
    }

    // Duration
    if (appState.filters.duration !== 'Any Duration' && item.duration !== appState.filters.duration) {
      return false;
    }

    // Min Stipend
    if (item.stipendAmount < appState.filters.minStipend) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (appState.filters.sortBy === 'newest') {
      return new Date(b.postedDate) - new Date(a.postedDate);
    } else if (appState.filters.sortBy === 'stipend-high') {
      return b.stipendAmount - a.stipendAmount;
    } else if (appState.filters.sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return 0;
  });
}

// Render Card Component
function createInternshipCardHtml(item) {
  const isSaved = appState.savedIds.includes(item.id);
  const isApplied = appState.applications.some(app => app.internshipId === item.id);

  let workplaceBadgeClass = 'badge-remote';
  if (item.workplaceType === 'Hybrid') workplaceBadgeClass = 'badge-hybrid';
  if (item.workplaceType === 'In-Office') workplaceBadgeClass = 'badge-in-office';

  return `
    <div class="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 relative">
      <div>
        <!-- Top bar: Logo, Company, Title, Bookmark -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="flex items-center gap-3">
            <img src="${item.logo}" alt="${item.company}" class="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm flex-shrink-0" onerror="this.src='https://placehold.co/80x80/indigo/white?text=${encodeURIComponent(item.company[0])}'">
            <div>
              <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">${item.domain}</p>
              <h3 class="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">${item.title}</h3>
              <p class="text-sm text-slate-500 font-medium">${item.company}</p>
            </div>
          </div>
          
          <button 
            onclick="toggleBookmark('${item.id}', event)" 
            title="${isSaved ? 'Remove from Saved' : 'Save for later'}"
            class="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex-shrink-0"
          >
            <i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-5 h-5 ${isSaved ? 'text-indigo-600 fill-indigo-600' : ''}"></i>
          </button>
        </div>

        <!-- Description -->
        <p class="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">${item.description}</p>

        <!-- Meta Pills -->
        <div class="flex flex-wrap gap-2 mb-4 text-xs">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium ${workplaceBadgeClass}">
            <i data-lucide="${item.workplaceType === 'Remote' ? 'laptop' : item.workplaceType === 'Hybrid' ? 'shuffle' : 'building-2'}" class="w-3.5 h-3.5"></i>
            ${item.workplaceType}
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
            <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i>
            ${item.location}
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
            ${item.duration}
          </span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1.5 mb-5">
          ${item.tags.slice(0, 3).map(tag => `
            <span class="text-[11px] font-medium bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200/60">${tag}</span>
          `).join('')}
          ${item.tags.length > 3 ? `<span class="text-[11px] font-medium text-slate-400 px-1 py-0.5">+${item.tags.length - 3}</span>` : ''}
        </div>
      </div>

      <!-- Card Footer -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span class="text-[11px] text-slate-400 block uppercase font-medium">Stipend</span>
          <span class="text-sm font-extrabold text-slate-900">${item.stipendFormatted}</span>
        </div>

        <div class="flex items-center gap-2">
          <button 
            onclick="openDetailsModal('${item.id}')"
            class="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Details
          </button>
          
          ${isApplied ? `
            <button 
              onclick="switchView('dashboard')"
              class="px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-1 hover:bg-emerald-100 transition-colors"
            >
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              Applied
            </button>
          ` : `
            <button 
              onclick="openApplicationModal('${item.id}')"
              class="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all active:scale-95 flex items-center gap-1"
            >
              Apply
              <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

// Render Browse list
function renderInternshipList() {
  const container = document.getElementById('internships-grid');
  const countEl = document.getElementById('results-count');
  if (!container) return;

  const filtered = getFilteredInternships();

  if (countEl) {
    countEl.innerHTML = `Showing <span class="font-bold text-slate-900">${filtered.length}</span> opportunit${filtered.length === 1 ? 'y' : 'ies'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <i data-lucide="search-x" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">No internships match your criteria</h3>
        <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">Try relaxing your search keywords, lowering the stipend threshold, or clearing domain filters.</p>
        <button onclick="resetFilters()" class="px-5 py-2.5 bg-indigo-50 text-indigo-600 font-semibold text-sm rounded-xl hover:bg-indigo-100 transition-colors">
          Reset all filters
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => createInternshipCardHtml(item)).join('');
  lucide.createIcons();
}

// Render Saved List
function renderSavedList() {
  const container = document.getElementById('saved-grid');
  const countEl = document.getElementById('saved-count-label');
  if (!container) return;

  const savedItems = appState.internships.filter(item => appState.savedIds.includes(item.id));

  if (countEl) {
    countEl.textContent = `${savedItems.length} saved item${savedItems.length === 1 ? '' : 's'}`;
  }

  if (savedItems.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div class="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <i data-lucide="bookmark" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">No saved internships yet</h3>
        <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">Click the bookmark icon on any internship listing while browsing to save it for easy review.</p>
        <button onclick="switchView('browse')" class="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
          Browse Internships
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = savedItems.map(item => createInternshipCardHtml(item)).join('');
  lucide.createIcons();
}

// Render Dashboard View
function renderDashboard() {
  const metricsTotal = document.getElementById('dash-metric-total');
  const metricsReview = document.getElementById('dash-metric-review');
  const metricsShortlisted = document.getElementById('dash-metric-shortlisted');
  const metricsSaved = document.getElementById('dash-metric-saved');
  const appList = document.getElementById('dashboard-applications-list');

  const total = appState.applications.length;
  const inReview = appState.applications.filter(a => a.status === 'Under Review' || a.status === 'Applied').length;
  const shortlisted = appState.applications.filter(a => a.status === 'Shortlisted').length;

  if (metricsTotal) metricsTotal.textContent = total;
  if (metricsReview) metricsReview.textContent = inReview;
  if (metricsShortlisted) metricsShortlisted.textContent = shortlisted;
  if (metricsSaved) metricsSaved.textContent = appState.savedIds.length;

  if (!appList) return;

  if (total === 0) {
    appList.innerHTML = `
      <div class="py-14 text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8">
        <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <i data-lucide="send" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">You haven't submitted any applications</h3>
        <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">Find great opportunities matching your passion and submit your profile in less than 2 minutes.</p>
        <button onclick="switchView('browse')" class="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200">
          Explore Opportunities
        </button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  appList.innerHTML = `
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/75 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <th class="py-3.5 px-6">Opportunity</th>
              <th class="py-3.5 px-6">Applied Date</th>
              <th class="py-3.5 px-6">Stipend</th>
              <th class="py-3.5 px-6">Status</th>
              <th class="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            ${appState.applications.map(app => {
              const intern = appState.internships.find(i => i.id === app.internshipId) || app.internshipSnapshot;
              let statusBadge = 'status-applied';
              if (app.status === 'Under Review') statusBadge = 'status-review';
              if (app.status === 'Shortlisted') statusBadge = 'status-shortlisted';

              return `
                <tr class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                      <img src="${intern.logo}" alt="${intern.company}" class="w-10 h-10 rounded-xl object-cover border border-slate-100 flex-shrink-0" onerror="this.src='https://placehold.co/80x80/indigo/white?text=${encodeURIComponent(intern.company[0])}'">
                      <div>
                        <div class="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer" onclick="openDetailsModal('${intern.id}')">${intern.title}</div>
                        <div class="text-xs text-slate-500">${intern.company} • ${intern.location}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-6 text-slate-600">
                    ${new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td class="py-4 px-6 font-semibold text-slate-800">
                    ${intern.stipendFormatted}
                  </td>
                  <td class="py-4 px-6">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusBadge}">
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      ${app.status}
                    </span>
                  </td>
                  <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button 
                        onclick="viewApplicationDetails('${app.id}')"
                        class="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-xs font-medium transition-colors"
                        title="View Submission"
                      >
                        <i data-lucide="file-text" class="w-4 h-4"></i>
                      </button>
                      <button 
                        onclick="withdrawApplication('${app.id}')"
                        class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium transition-colors"
                        title="Withdraw Application"
                      >
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  lucide.createIcons();
}

// Bookmark Toggle
function toggleBookmark(id, event) {
  if (event) event.stopPropagation();
  const index = appState.savedIds.indexOf(id);
  const intern = appState.internships.find(i => i.id === id);

  if (index > -1) {
    appState.savedIds.splice(index, 1);
    showToast(`Removed from saved internships`, 'info');
  } else {
    appState.savedIds.push(id);
    showToast(`Saved "${intern ? intern.title : 'Internship'}" for later!`, 'success');
  }

  saveSavedIds();
  if (appState.activeView === 'browse') {
    renderInternshipList();
  } else if (appState.activeView === 'saved') {
    renderSavedList();
  }

  // If detail modal is open for this item, update bookmark button inside modal
  const modalBookmarkBtn = document.getElementById('modal-bookmark-btn');
  if (modalBookmarkBtn && appState.selectedInternshipId === id) {
    const isSaved = appState.savedIds.includes(id);
    modalBookmarkBtn.innerHTML = `
      <i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-5 h-5 ${isSaved ? 'text-indigo-600 fill-indigo-600' : ''}"></i>
      <span>${isSaved ? 'Saved' : 'Save'}</span>
    `;
    lucide.createIcons();
  }
}

// Reset filters
function resetFilters() {
  appState.filters = {
    search: '',
    domain: 'All Domains',
    workplaceType: 'All Types',
    duration: 'Any Duration',
    minStipend: 0,
    sortBy: 'newest'
  };

  const searchInput = document.getElementById('search-input');
  const domainSelect = document.getElementById('filter-domain');
  const workplaceSelect = document.getElementById('filter-workplace');
  const durationSelect = document.getElementById('filter-duration');
  const stipendRange = document.getElementById('filter-stipend');
  const stipendVal = document.getElementById('stipend-value-display');
  const sortBySelect = document.getElementById('sort-by');

  if (searchInput) searchInput.value = '';
  if (domainSelect) domainSelect.value = 'All Domains';
  if (workplaceSelect) workplaceSelect.value = 'All Types';
  if (durationSelect) durationSelect.value = 'Any Duration';
  if (stipendRange) stipendRange.value = 0;
  if (stipendVal) stipendVal.textContent = '$0+';
  if (sortBySelect) sortBySelect.value = 'newest';

  renderInternshipList();
  showToast('Filters reset', 'info');
}

// Details Modal
function openDetailsModal(id) {
  const item = appState.internships.find(i => i.id === id);
  if (!item) return;

  appState.selectedInternshipId = id;
  const isSaved = appState.savedIds.includes(id);
  const isApplied = appState.applications.some(app => app.internshipId === id);

  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  let workplaceBadgeClass = 'badge-remote';
  if (item.workplaceType === 'Hybrid') workplaceBadgeClass = 'badge-hybrid';
  if (item.workplaceType === 'In-Office') workplaceBadgeClass = 'badge-in-office';

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop" onclick="closeModalOnBackdrop(event)">
      <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden modal-content-animated border border-slate-100">
        <!-- Banner Header -->
        <div class="relative h-44 sm:h-52 w-full bg-slate-900 flex-shrink-0">
          <img src="${item.banner}" alt="${item.title}" class="w-full h-full object-cover opacity-60">
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
          
          <button onclick="closeModal()" class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>

          <div class="absolute -bottom-7 left-6 sm:left-8 flex items-end gap-4">
            <img src="${item.logo}" alt="${item.company}" class="w-20 h-20 rounded-2xl object-cover bg-white p-1 shadow-xl border border-slate-100" onerror="this.src='https://placehold.co/120x120/indigo/white?text=${encodeURIComponent(item.company[0])}'">
          </div>
        </div>

        <!-- Scrollable Modal Body -->
        <div class="p-6 sm:p-8 pt-10 overflow-y-auto space-y-6 flex-1">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">${item.domain}</span>
                <span class="text-xs font-medium text-slate-500">• Posted ${new Date(item.postedDate).toLocaleDateString()}</span>
              </div>
              <h2 class="text-2xl font-extrabold text-slate-900">${item.title}</h2>
              <p class="text-base text-slate-600 font-medium">${item.company} — <span class="text-slate-500">${item.location}</span></p>
            </div>

            <!-- Action buttons in header -->
            <div class="flex items-center gap-2">
              <button 
                id="modal-bookmark-btn"
                onclick="toggleBookmark('${item.id}', event)"
                class="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 flex items-center gap-2 text-sm font-semibold transition-colors"
              >
                <i data-lucide="${isSaved ? 'bookmark-check' : 'bookmark'}" class="w-4 h-4 ${isSaved ? 'text-indigo-600 fill-indigo-600' : ''}"></i>
                <span>${isSaved ? 'Saved' : 'Save'}</span>
              </button>
              <button 
                onclick="copyInternshipLink('${item.id}')"
                class="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors"
                title="Share / Copy Link"
              >
                <i data-lucide="share-2" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

          <!-- Highlight stats bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div>
              <span class="text-xs text-slate-400 block font-medium">Stipend</span>
              <span class="text-sm font-bold text-slate-900">${item.stipendFormatted}</span>
            </div>
            <div>
              <span class="text-xs text-slate-400 block font-medium">Workplace</span>
              <span class="text-sm font-bold text-slate-900">${item.workplaceType}</span>
            </div>
            <div>
              <span class="text-xs text-slate-400 block font-medium">Duration</span>
              <span class="text-sm font-bold text-slate-900">${item.duration}</span>
            </div>
            <div>
              <span class="text-xs text-slate-400 block font-medium">Apply Before</span>
              <span class="text-sm font-bold text-rose-600">${new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <!-- About Role -->
          <div>
            <h4 class="text-base font-bold text-slate-900 mb-2">About the Role</h4>
            <p class="text-sm text-slate-600 leading-relaxed">${item.description}</p>
          </div>

          <!-- Responsibilities -->
          <div>
            <h4 class="text-base font-bold text-slate-900 mb-2">Key Responsibilities</h4>
            <ul class="space-y-2">
              ${item.responsibilities.map(r => `
                <li class="flex items-start gap-2.5 text-sm text-slate-600">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0"></i>
                  <span>${r}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Requirements -->
          <div>
            <h4 class="text-base font-bold text-slate-900 mb-2">Requirements & Qualifications</h4>
            <ul class="space-y-2">
              ${item.requirements.map(req => `
                <li class="flex items-start gap-2.5 text-sm text-slate-600">
                  <i data-lucide="arrow-right" class="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0"></i>
                  <span>${req}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Perks & Benefits -->
          <div>
            <h4 class="text-base font-bold text-slate-900 mb-2">Perks & Benefits</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${item.perks.map(p => `
                <div class="flex items-center gap-2 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs font-semibold text-slate-700">
                  <i data-lucide="sparkles" class="w-4 h-4 text-indigo-600 flex-shrink-0"></i>
                  <span>${p}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tags -->
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Relevant Skills & Technologies</h4>
            <div class="flex flex-wrap gap-2">
              ${item.tags.map(t => `<span class="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">${t}</span>`).join('')}
            </div>
          </div>
        </div>

        <!-- Sticky Modal Footer -->
        <div class="p-4 sm:px-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div class="text-xs text-slate-500 hidden sm:block">
            <span>${item.openings} opening${item.openings > 1 ? 's' : ''} available</span> • <span>Expected start: ${item.startDate}</span>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button onclick="closeModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors">
              Close
            </button>
            ${isApplied ? `
              <button 
                onclick="closeModal(); switchView('dashboard')" 
                class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                <i data-lucide="check-circle" class="w-4 h-4"></i>
                Already Applied (Track Status)
              </button>
            ` : `
              <button 
                onclick="closeModal(); openApplicationModal('${item.id}')" 
                class="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                Apply for this Role
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  lucide.createIcons();
}

// Application Modal
function openApplicationModal(id) {
  const item = appState.internships.find(i => i.id === id);
  if (!item) return;

  appState.selectedInternshipId = id;
  appState.currentResumeFile = null;

  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop" onclick="closeModalOnBackdrop(event)">
      <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden modal-content-animated border border-slate-100">
        <!-- Header -->
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div class="flex items-center gap-3">
            <img src="${item.logo}" alt="${item.company}" class="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" onerror="this.src='https://placehold.co/80x80/indigo/white?text=${encodeURIComponent(item.company[0])}'">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Apply for ${item.title}</h3>
              <p class="text-xs text-slate-500 font-medium">${item.company} • ${item.stipendFormatted}</p>
            </div>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form id="application-form" onsubmit="handleApplicationSubmit(event, '${item.id}')" class="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
          <!-- Full Name & Email -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="applicant-name">
                Full Name <span class="text-rose-500">*</span>
              </label>
              <input 
                type="text" 
                id="applicant-name" 
                required 
                placeholder="e.g. Alex Morgan"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="applicant-email">
                Email Address <span class="text-rose-500">*</span>
              </label>
              <input 
                type="email" 
                id="applicant-email" 
                required 
                placeholder="alex.morgan@university.edu"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <!-- Phone & Portfolio -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="applicant-phone">
                Phone Number <span class="text-rose-500">*</span>
              </label>
              <input 
                type="tel" 
                id="applicant-phone" 
                required 
                placeholder="+1 (555) 019-2834"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="applicant-portfolio">
                Portfolio / GitHub / LinkedIn <span class="text-rose-500">*</span>
              </label>
              <input 
                type="url" 
                id="applicant-portfolio" 
                required 
                placeholder="https://github.com/alexmorgan"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <!-- Earliest Start & Expected Duration -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="applicant-start">
                Earliest Start Date <span class="text-rose-500">*</span>
              </label>
              <input 
                type="date" 
                id="applicant-start" 
                required 
                value="${new Date().toISOString().split('T')[0]}"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="applicant-availability">
                Weekly Availability <span class="text-rose-500">*</span>
              </label>
              <select id="applicant-availability" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all">
                <option value="Full-time (40 hrs/wk)">Full-time (40 hrs/week)</option>
                <option value="Part-time (20-30 hrs/wk)">Part-time (20-30 hrs/week)</option>
                <option value="Flexible / Negotiable">Flexible / Project based</option>
              </select>
            </div>
          </div>

          <!-- Resume Upload Zone -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Resume / CV (PDF, DOCX) <span class="text-rose-500">*</span>
            </label>
            <div 
              id="resume-dropzone" 
              class="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-400 transition-all cursor-pointer"
              onclick="document.getElementById('resume-file-input').click()"
            >
              <input 
                type="file" 
                id="resume-file-input" 
                accept=".pdf,.doc,.docx" 
                class="hidden" 
                onchange="handleResumeFileChange(event)"
              />
              <div id="dropzone-empty-view">
                <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i data-lucide="upload-cloud" class="w-5 h-5"></i>
                </div>
                <p class="text-sm font-semibold text-slate-800 mb-0.5">Click to upload or drag & drop</p>
                <p class="text-xs text-slate-400">PDF or Word document up to 10MB</p>
              </div>
              <div id="dropzone-file-view" class="hidden flex items-center justify-between p-2 bg-white rounded-xl border border-indigo-200">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <i data-lucide="file-check" class="w-4 h-4"></i>
                  </div>
                  <div class="text-left">
                    <p id="resume-filename" class="text-xs font-bold text-slate-900 truncate max-w-[240px]"></p>
                    <p id="resume-filesize" class="text-[10px] text-slate-500"></p>
                  </div>
                </div>
                <button type="button" onclick="removeResumeFile(event)" class="text-rose-500 hover:text-rose-700 p-1">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
            <p id="resume-error" class="hidden text-xs text-rose-500 mt-1 font-medium">Please attach a valid resume before submitting.</p>
          </div>

          <!-- Cover Note -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="applicant-note">
              Why are you a great fit for this internship? <span class="text-slate-400 font-normal lowercase">(Optional)</span>
            </label>
            <textarea 
              id="applicant-note" 
              rows="3" 
              placeholder="Highlight any projects, relevant hackathons, coursework or achievements that align with this role..."
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
            ></textarea>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-2.5 pt-2">
            <input type="checkbox" id="terms-agree" required class="mt-1 rounded text-indigo-600 focus:ring-indigo-500">
            <label for="terms-agree" class="text-xs text-slate-500 leading-normal">
              I certify that all details and documents provided are accurate and authorize ${item.company} to contact me regarding this internship.
            </label>
          </div>

          <!-- Footer Actions -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              id="submit-app-btn"
              class="px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <i data-lucide="send" class="w-4 h-4"></i>
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  lucide.createIcons();
  setupDragAndDrop();
}

// Resume File Handler
function handleResumeFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  appState.currentResumeFile = {
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
  };

  const emptyView = document.getElementById('dropzone-empty-view');
  const fileView = document.getElementById('dropzone-file-view');
  const nameEl = document.getElementById('resume-filename');
  const sizeEl = document.getElementById('resume-filesize');
  const errorEl = document.getElementById('resume-error');

  if (emptyView && fileView && nameEl && sizeEl) {
    nameEl.textContent = appState.currentResumeFile.name;
    sizeEl.textContent = appState.currentResumeFile.size;
    emptyView.classList.add('hidden');
    fileView.classList.remove('hidden');
    if (errorEl) errorEl.classList.add('hidden');
  }
}

function removeResumeFile(event) {
  if (event) event.stopPropagation();
  appState.currentResumeFile = null;
  const fileInput = document.getElementById('resume-file-input');
  if (fileInput) fileInput.value = '';

  const emptyView = document.getElementById('dropzone-empty-view');
  const fileView = document.getElementById('dropzone-file-view');
  if (emptyView && fileView) {
    emptyView.classList.remove('hidden');
    fileView.classList.add('hidden');
  }
}

function setupDragAndDrop() {
  const dropzone = document.getElementById('resume-dropzone');
  if (!dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('dropzone-active');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, e => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('dropzone-active');
    }, false);
  });

  dropzone.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files && files.length > 0) {
      const fileInput = document.getElementById('resume-file-input');
      if (fileInput) {
        fileInput.files = files;
        handleResumeFileChange({ target: { files: [files[0]] } });
      }
    }
  });
}

// Handle Application Submit
function handleApplicationSubmit(event, internshipId) {
  event.preventDefault();

  const resumeError = document.getElementById('resume-error');
  if (!appState.currentResumeFile) {
    if (resumeError) resumeError.classList.remove('hidden');
    return;
  }

  const intern = appState.internships.find(i => i.id === internshipId);
  const name = document.getElementById('applicant-name').value;
  const email = document.getElementById('applicant-email').value;
  const phone = document.getElementById('applicant-phone').value;
  const portfolio = document.getElementById('applicant-portfolio').value;
  const startDate = document.getElementById('applicant-start').value;
  const availability = document.getElementById('applicant-availability').value;
  const note = document.getElementById('applicant-note').value;

  const newApplication = {
    id: 'app-' + Date.now(),
    internshipId: internshipId,
    internshipSnapshot: intern,
    applicant: {
      name,
      email,
      phone,
      portfolio,
      startDate,
      availability,
      note,
      resumeFileName: appState.currentResumeFile.name,
      resumeFileSize: appState.currentResumeFile.size
    },
    appliedAt: new Date().toISOString(),
    status: 'Under Review' // 'Under Review', 'Shortlisted', 'Interview'
  };

  // Prevent duplicate applications
  const existingIndex = appState.applications.findIndex(a => a.internshipId === internshipId);
  if (existingIndex > -1) {
    appState.applications[existingIndex] = newApplication;
  } else {
    appState.applications.unshift(newApplication);
  }

  saveApplications();
  closeModal();

  // Show celebration modal
  showApplicationSuccessModal(intern);
  
  if (appState.activeView === 'browse') {
    renderInternshipList();
  } else if (appState.activeView === 'dashboard') {
    renderDashboard();
  }
}

// Application Success Modal
function showApplicationSuccessModal(intern) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop" onclick="closeModalOnBackdrop(event)">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center modal-content-animated border border-slate-100">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md shadow-emerald-100">
          <i data-lucide="check-circle" class="w-9 h-9"></i>
        </div>

        <h3 class="text-xl font-black text-slate-900 mb-2">Application Submitted!</h3>
        <p class="text-sm text-slate-600 mb-6 leading-relaxed">
          Your application for <span class="font-bold text-slate-800">${intern.title}</span> at <span class="font-bold text-slate-800">${intern.company}</span> has been received. You can track status in your dashboard.
        </p>

        <div class="space-y-3">
          <button 
            onclick="closeModal(); switchView('dashboard')" 
            class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
            Go to Applications Dashboard
          </button>
          <button 
            onclick="closeModal()" 
            class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  lucide.createIcons();
}

// View Application Details Modal
function viewApplicationDetails(appId) {
  const application = appState.applications.find(a => a.id === appId);
  if (!application) return;

  const intern = appState.internships.find(i => i.id === application.internshipId) || application.internshipSnapshot;
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  modalContainer.innerHTML = `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm modal-backdrop" onclick="closeModalOnBackdrop(event)">
      <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden modal-content-animated border border-slate-100">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wider">Application Summary</span>
            <h3 class="text-lg font-bold text-slate-900">${intern.title}</h3>
            <p class="text-xs text-slate-500">${intern.company} • Submitted on ${new Date(application.appliedAt).toLocaleDateString()}</p>
          </div>
          <button onclick="closeModal()" class="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
          </button>
        </div>

        <div class="p-6 sm:p-8 overflow-y-auto space-y-5">
          <!-- Status callout -->
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <i data-lucide="hourglass" class="w-4 h-4"></i>
              </div>
              <div>
                <p class="text-xs text-amber-700 font-semibold uppercase">Current Status</p>
                <p class="text-sm font-bold text-amber-900">${application.status}</p>
              </div>
            </div>
            <span class="text-xs text-amber-700 font-medium">Updated recently</span>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="text-slate-400 block font-medium">Applicant Name</span>
              <span class="text-sm font-bold text-slate-800">${application.applicant.name}</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="text-slate-400 block font-medium">Email</span>
              <span class="text-sm font-bold text-slate-800 truncate block">${application.applicant.email}</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="text-slate-400 block font-medium">Phone</span>
              <span class="text-sm font-bold text-slate-800">${application.applicant.phone}</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="text-slate-400 block font-medium">Availability</span>
              <span class="text-sm font-bold text-slate-800">${application.applicant.availability}</span>
            </div>
          </div>

          <!-- Portfolio -->
          <div class="p-3 bg-slate-50 rounded-xl text-xs">
            <span class="text-slate-400 block font-medium mb-1">Portfolio / Profile Link</span>
            <a href="${application.applicant.portfolio}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 font-semibold hover:underline flex items-center gap-1.5">
              ${application.applicant.portfolio}
              <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            </a>
          </div>

          <!-- Resume Attachment -->
          <div class="p-3 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
            <div>
              <span class="text-slate-400 block font-medium mb-1">Attached Resume</span>
              <div class="flex items-center gap-2 text-slate-800 font-semibold">
                <i data-lucide="file-text" class="w-4 h-4 text-indigo-600"></i>
                <span>${application.applicant.resumeFileName || 'Resume.pdf'}</span>
                <span class="text-slate-400 font-normal">(${application.applicant.resumeFileSize || '1.2 MB'})</span>
              </div>
            </div>
            <button onclick="showToast('Resume downloaded from portal cache', 'info')" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">
              View
            </button>
          </div>

          ${application.applicant.note ? `
            <div>
              <span class="text-xs text-slate-400 block font-medium mb-1">Why you are a great fit</span>
              <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed italic border border-slate-100">
                "${application.applicant.note}"
              </div>
            </div>
          ` : ''}
        </div>

        <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onclick="closeModal()" class="px-5 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  `;

  modalContainer.classList.remove('hidden');
  lucide.createIcons();
}

// Withdraw application
function withdrawApplication(appId) {
  if (!confirm('Are you sure you want to withdraw this internship application?')) {
    return;
  }

  appState.applications = appState.applications.filter(a => a.id !== appId);
  saveApplications();
  renderDashboard();
  if (appState.activeView === 'browse') {
    renderInternshipList();
  }
  showToast('Application withdrawn successfully', 'info');
}

// Modal closing helpers
function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  if (modalContainer) {
    modalContainer.classList.add('hidden');
    modalContainer.innerHTML = '';
  }
}

function closeModalOnBackdrop(event) {
  if (event.target.classList.contains('modal-backdrop')) {
    closeModal();
  }
}

function copyInternshipLink(id) {
  const url = `${window.location.origin}${window.location.pathname}?internship=${id}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Shareable link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Link copied: ' + url, 'info');
    });
  } else {
    showToast('Link: ' + url, 'info');
  }
}

// Init Event Listeners
function setupEventListeners() {
  // Navigation tabs
  document.querySelectorAll('.nav-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.view);
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        appState.filters.search = e.target.value;
        renderInternshipList();
      }, 250);
    });
  }

  // Domain filter
  const domainFilter = document.getElementById('filter-domain');
  if (domainFilter) {
    DOMAINS.forEach(domain => {
      const opt = document.createElement('option');
      opt.value = domain;
      opt.textContent = domain;
      domainFilter.appendChild(opt);
    });
    domainFilter.addEventListener('change', e => {
      appState.filters.domain = e.target.value;
      renderInternshipList();
    });
  }

  // Workplace filter
  const workplaceFilter = document.getElementById('filter-workplace');
  if (workplaceFilter) {
    WORKPLACE_TYPES.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type;
      opt.textContent = type;
      workplaceFilter.appendChild(opt);
    });
    workplaceFilter.addEventListener('change', e => {
      appState.filters.workplaceType = e.target.value;
      renderInternshipList();
    });
  }

  // Duration filter
  const durationFilter = document.getElementById('filter-duration');
  if (durationFilter) {
    DURATIONS.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d;
      durationFilter.appendChild(opt);
    });
    durationFilter.addEventListener('change', e => {
      appState.filters.duration = e.target.value;
      renderInternshipList();
    });
  }

  // Stipend slider
  const stipendSlider = document.getElementById('filter-stipend');
  const stipendDisplay = document.getElementById('stipend-value-display');
  if (stipendSlider && stipendDisplay) {
    stipendSlider.addEventListener('input', e => {
      const val = parseInt(e.target.value, 10);
      appState.filters.minStipend = val;
      stipendDisplay.textContent = val === 0 ? '$0+' : `$${val.toLocaleString()}+`;
      renderInternshipList();
    });
  }

  // Sort By
  const sortBySelect = document.getElementById('sort-by');
  if (sortBySelect) {
    sortBySelect.addEventListener('change', e => {
      appState.filters.sortBy = e.target.value;
      renderInternshipList();
    });
  }

  // Escape key to close modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  updateNavCounters();
  renderInternshipList();

  // Check URL params for direct link: ?internship=int-001
  const urlParams = new URLSearchParams(window.location.search);
  const directId = urlParams.get('internship');
  if (directId) {
    const item = appState.internships.find(i => i.id === directId);
    if (item) {
      setTimeout(() => openDetailsModal(directId), 200);
    }
  }

  lucide.createIcons();
});
