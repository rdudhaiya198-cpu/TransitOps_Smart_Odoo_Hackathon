(function () {
    var toggleButtons = document.querySelectorAll('[data-auth-password-toggle]');

    toggleButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var targetSelector = button.getAttribute('data-target');
            var input = targetSelector ? document.querySelector(targetSelector) : null;
            var icon = button.querySelector('[data-auth-password-icon]');

            if (!input) {
                return;
            }

            var isPassword = input.getAttribute('type') === 'password';

            input.setAttribute('type', isPassword ? 'text' : 'password');

            if (icon) {
                icon.classList.toggle('bi-eye', !isPassword);
                icon.classList.toggle('bi-eye-slash', isPassword);
            }

            button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    });
})();