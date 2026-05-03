// Password Generator JavaScript
class PasswordGenerator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        this.generatePassword();
    }

    initializeElements() {
        this.passwordDisplay = document.getElementById('passwordDisplay');
        this.copyBtn = document.getElementById('copyBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        
        // Character options
        this.uppercaseCheck = document.getElementById('uppercase');
        this.lowercaseCheck = document.getElementById('lowercase');
        this.numbersCheck = document.getElementById('numbers');
        this.symbolsCheck = document.getElementById('symbols');
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.lengthSlider.addEventListener('input', () => this.updateLength());
        
        // Update password when options change
        [this.uppercaseCheck, this.lowercaseCheck, this.numbersCheck, this.symbolsCheck].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.generatePassword());
        });
    }

    updateLength() {
        this.lengthValue.textContent = this.lengthSlider.value;
        this.generatePassword();
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        const options = {
            uppercase: this.uppercaseCheck.checked,
            lowercase: this.lowercaseCheck.checked,
            numbers: this.numbersCheck.checked,
            symbols: this.symbolsCheck.checked
        };

        // Ensure at least one option is selected
        if (!options.uppercase && !options.lowercase && !options.numbers && !options.symbols) {
            this.passwordDisplay.value = 'Select at least one option';
            this.updateStrength(0);
            return;
        }

        const password = this.createPassword(length, options);
        this.passwordDisplay.value = password;
        this.updateStrength(this.calculateStrength(password));
    }

    createPassword(length, options) {
        let charset = '';
        let guaranteedChars = [];

        if (options.uppercase) {
            charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            guaranteedChars.push(this.getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
        }
        if (options.lowercase) {
            charset += 'abcdefghijklmnopqrstuvwxyz';
            guaranteedChars.push(this.getRandomChar('abcdefghijklmnopqrstuvwxyz'));
        }
        if (options.numbers) {
            charset += '0123456789';
            guaranteedChars.push(this.getRandomChar('0123456789'));
        }
        if (options.symbols) {
            charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            guaranteedChars.push(this.getRandomChar('!@#$%^&*()_+-=[]{}|;:,.<>?'));
        }

        // Generate remaining characters
        let password = guaranteedChars.join('');
        for (let i = guaranteedChars.length; i < length; i++) {
            password += this.getRandomChar(charset);
        }

        // Shuffle the password to avoid predictable patterns
        return this.shuffleString(password);
    }

    getRandomChar(charset) {
        return charset.charAt(Math.floor(Math.random() * charset.length));
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    calculateStrength(password) {
        if (!password || password === 'Select at least one option') return 0;

        let score = 0;
        const length = password.length;

        // Length scoring
        if (length >= 8) score += 20;
        if (length >= 12) score += 20;
        if (length >= 16) score += 20;
        if (length >= 20) score += 20;

        // Character variety scoring
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 10;
        if (/[0-9]/.test(password)) score += 10;
        if (/[^a-zA-Z0-9]/.test(password)) score += 10;

        return Math.min(score, 100);
    }

    updateStrength(strength) {
        this.strengthBar.style.width = `${strength}%`;

        // Update strength text and color
        if (strength === 0) {
            this.strengthText.textContent = 'No Password';
            this.strengthText.className = 'text-sm font-semibold text-gray-400';
            this.strengthBar.className = 'h-full bg-gradient-to-r from-gray-500 to-gray-500 transition-all duration-300';
        } else if (strength < 40) {
            this.strengthText.textContent = 'Weak';
            this.strengthText.className = 'text-sm font-semibold text-red-400';
            this.strengthBar.className = 'h-full strength-weak transition-all duration-300';
        } else if (strength < 70) {
            this.strengthText.textContent = 'Medium';
            this.strengthText.className = 'text-sm font-semibold text-yellow-400';
            this.strengthBar.className = 'h-full strength-medium transition-all duration-300';
        } else {
            this.strengthText.textContent = 'Strong';
            this.strengthText.className = 'text-sm font-semibold text-green-400';
            this.strengthBar.className = 'h-full strength-strong transition-all duration-300';
        }
    }

    async copyToClipboard() {
        const password = this.passwordDisplay.value;
        
        if (!password || password === 'Select at least one option') {
            this.showCopyFeedback('No password to copy', false);
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            this.showCopyFeedback('Copied!', true);
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(password);
            this.showCopyFeedback('Copied!', true);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    showCopyFeedback(message, success) {
        const originalIcon = this.copyBtn.innerHTML;
        this.copyBtn.innerHTML = `<i class="fas fa-${success ? 'check' : 'exclamation'}"></i>`;
        
        if (success) {
            this.copyBtn.classList.add('copied');
            setTimeout(() => {
                this.copyBtn.classList.remove('copied');
                this.copyBtn.innerHTML = originalIcon;
            }, 1000);
        } else {
            setTimeout(() => {
                this.copyBtn.innerHTML = originalIcon;
            }, 1000);
        }
    }
}

// Initialize the password generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGenerator();
});
