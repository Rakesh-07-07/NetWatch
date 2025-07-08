document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;
    const form = document.getElementById('scan-form');
    const results = document.getElementById('results');

    // Load saved mode from localStorage
    if (localStorage.getItem('mode') === 'dark') {
        body.classList.add('dark-mode');
        modeToggle.textContent = '☀️';
    }

    modeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            modeToggle.textContent = '☀️';
            localStorage.setItem('mode', 'dark');
        } else {
            modeToggle.textContent = '🌙';
            localStorage.setItem('mode', 'light');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        results.textContent = 'Scanning ports...\n';
        const ip = form['ip'].value.trim();
        const startPort = parseInt(form['start-port'].value, 10);
        const endPort = parseInt(form['end-port'].value, 10);

        if (!ip) {
            results.textContent = 'Please enter a valid IP address or hostname.';
            return;
        }
        if (startPort < 1 || endPort > 65535 || startPort > endPort) {
            results.textContent = 'Please enter a valid port range (1-65535).';
            return;
        }

        // Limit max ports scanned to 100 for performance
        const maxPorts = 100;
        const portCount = endPort - startPort + 1;
        if (portCount > maxPorts) {
            results.textContent = `Port range too large. Please scan up to ${maxPorts} ports at a time.`;
            return;
        }

        // Clear previous results
        results.textContent = '';

        // Perform port scanning simulation using fetch with timeout
        for (let port = startPort; port <= endPort; port++) {
            results.textContent += `Checking port ${port}... `;
            try {
                // We attempt to fetch from the IP and port with a timeout
                // Note: This is a simulation; real port scanning is not possible from browser due to CORS and security
                await fetchWithTimeout(`http://${ip}:${port}`, 1000);
                results.textContent += 'Open\n';
            } catch (err) {
                results.textContent += 'Closed\n';
            }
            // Scroll results to bottom
            results.scrollTop = results.scrollHeight;
        }
    });

    // Helper function to fetch with timeout
    function fetchWithTimeout(resource, timeout = 1000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('Timeout'));
            }, timeout);

            fetch(resource, { mode: 'no-cors' })
                .then(() => {
                    clearTimeout(timer);
                    resolve();
                })
                .catch(() => {
                    clearTimeout(timer);
                    reject(new Error('Fetch error'));
                });
        });
    }
});
