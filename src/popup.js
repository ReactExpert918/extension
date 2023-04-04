class SecretManager {
    constructor() {
      this.initializeForm = document.getElementById('initialize');
      this.loginForm = document.getElementById('login');
      this.secretView = document.getElementById('secret-view');
      this.secretElement = document.getElementById('secret');
  
      this.initializeBtn = document.getElementById('initialize-btn');
      this.loginBtn = document.getElementById('login-btn');
      this.regenerateBtn = document.getElementById('regenerate-btn');
      this.logoutBtn = document.getElementById('logout-btn');
  
      this.addEventListeners();
    }
  
    addEventListeners() {
      this.initializeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.initialize();
      });
  
      this.loginBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.login();
      });
  
      this.regenerateBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.regenerateSecret();
      });
  
      this.logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();
        this.logout();
      });
    }
  
    generateSecret() {
      const length = 16;
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
  
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
  
      return result;
    }
  
    async initialize() {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
  
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
  
      const secret = this.generateSecret();
      const encryptedSecret = btoa(secret); // Simple encryption using base64 encoding
  
      await chrome.storage.local.set({ encryptedSecret, password });
  
      this.initializeForm.style.display = 'none';
      this.loginForm.style.display = 'block';
    }
  
    async login() {
      const storedData = await new Promise((resolve) =>
        chrome.storage.local.get(['encryptedSecret', 'password'], resolve)
      );
  
      const enteredPassword = document.getElementById('login-password').value;
  
      if (enteredPassword !== storedData.password) {
        alert('Incorrect password');
        return;
      }
  
      const decryptedSecret = atob(storedData.encryptedSecret);
  
      this.secretElement.textContent = decryptedSecret;
      this.loginForm.style.display = 'none';
      this.secretView.style.display = 'block';
    }
  
    async regenerateSecret() {
      const newSecret = this.generateSecret();
      const encryptedSecret = btoa(newSecret);
  
      await chrome.storage.local.set({ encryptedSecret });
  
      this.secretElement.textContent = newSecret;
    }
  
    logout() {
      this.secretView.style.display = 'none';
      this.loginForm.style.display = 'block';
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const manager = new SecretManager();
  });