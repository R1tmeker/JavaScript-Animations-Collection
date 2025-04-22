/**
 * TabManager - Handles tab switching functionality
 */
export default class TabManager {
  constructor() {
    this.tabs = document.querySelectorAll('.tab-btn');
    this.containers = document.querySelectorAll('.animation-container');
    this.activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    this.tabChangeListeners = [];
    
    this.initTabs();
  }
  
  /**
   * Initialize tab functionality
   */
  initTabs() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.dataset.tab;
        this.switchTab(tabId);
      });
    });
  }
  
  /**
   * Switch to a specific tab
   * @param {string} tabId - The ID of the tab to switch to
   */
  switchTab(tabId) {
    // Don't do anything if it's already the active tab
    if (tabId === this.activeTab) return;
    
    // Update active tab
    this.activeTab = tabId;
    
    // Update tab buttons
    this.tabs.forEach(tab => {
      if (tab.dataset.tab === tabId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // Update containers
    this.containers.forEach(container => {
      if (container.id === tabId) {
        container.classList.add('active');
      } else {
        container.classList.remove('active');
      }
    });
    
    // Notify listeners
    this.tabChangeListeners.forEach(listener => listener(tabId));
  }
  
  /**
   * Register a callback for tab change events
   * @param {Function} callback - Function to call when tab changes
   */
  onTabChange(callback) {
    this.tabChangeListeners.push(callback);
  }
}