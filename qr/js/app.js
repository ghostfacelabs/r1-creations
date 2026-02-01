/* global QRCodeStyling */

class QRCodeGenerator {
    constructor() {
        this.currentQRCode = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.parseURLParameters();
        this.updateJSONPreview();
    }

    bindEvents() {
        const form = document.getElementById('qrForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.generateQRCode();
        });

        const formInputs = form.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateJSONPreview();
                this.updateShareURL();
            });
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadQRCode();
        });

        document.getElementById('copyUrlBtn').addEventListener('click', () => {
            this.copyShareURL();
        });
    }

    parseURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);

        // Support direct URL parameter for quick QR generation
        const url = urlParams.get('url');
        if (url) {
            document.getElementById('url').value = url;
            const title = urlParams.get('title') || '';
            const description = urlParams.get('description') || '';
            if (title) document.getElementById('title').value = title;
            if (description) document.getElementById('description').value = description;

            setTimeout(() => this.generateQRCode(), 100);
            return;
        }

        // Support JSON data parameter
        const jsonData = urlParams.get('jsondata');
        if (jsonData) {
            try {
                const decodedData = atob(jsonData.replace(/-/g, '+').replace(/_/g, '/'));
                const parsedData = JSON.parse(decodedData);
                this.populateForm(parsedData);
                setTimeout(() => this.generateQRCode(), 100);
            } catch (error) {
                console.error('Error parsing URL parameters:', error);
            }
        }
    }

    populateForm(data) {
        const fields = ['title', 'url', 'description', 'iconUrl', 'themeColor'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element && data[field] !== undefined) {
                element.value = data[field];
            }
        });
        this.updateJSONPreview();
    }

    getFormData() {
        return {
            title: document.getElementById('title').value.trim(),
            url: document.getElementById('url').value.trim(),
            description: document.getElementById('description').value.trim(),
            iconUrl: document.getElementById('iconUrl').value.trim(),
            themeColor: document.getElementById('themeColor').value
        };
    }

    updateJSONPreview() {
        const data = this.getFormData();
        document.getElementById('jsonPreview').textContent = JSON.stringify(data, null, 2);
    }

    updateShareURL() {
        const data = this.getFormData();
        const hasData = Object.values(data).some(value => value && value !== '#00ff00');

        if (hasData) {
            try {
                const jsonString = JSON.stringify(data);
                const encodedData = btoa(jsonString)
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=/g, '');
                const shareUrl = `${window.location.origin}${window.location.pathname}?jsondata=${encodedData}`;
                document.getElementById('shareUrl').value = shareUrl;
            } catch (error) {
                document.getElementById('shareUrl').value = '';
            }
        } else {
            document.getElementById('shareUrl').value = '';
        }
    }

    async generateQRCode() {
        const data = this.getFormData();

        if (!data.title && !data.url && !data.description) {
            this.showNotification('Please fill in at least one field', 'warning');
            return;
        }

        try {
            const qrCodeContainer = document.getElementById('qrCode');
            qrCodeContainer.innerHTML = '';
            document.getElementById('qrPlaceholder').style.display = 'none';

            const qrData = JSON.stringify(data);

            const qrCodeOptions = {
                width: 300,
                height: 300,
                type: "canvas",
                data: qrData,
                margin: 10,
                qrOptions: {
                    typeNumber: 0,
                    mode: "Byte",
                    errorCorrectionLevel: "L"
                },
                dotsOptions: {
                    color: "#000000",
                    type: "rounded"
                },
                backgroundOptions: {
                    color: "#ffffff"
                },
                cornersSquareOptions: {
                    color: "#000000",
                    type: "extra-rounded"
                },
                cornersDotOptions: {
                    color: "#000000",
                    type: "dot"
                }
            };

            this.currentQRCode = new QRCodeStyling(qrCodeOptions);

            const wrapper = document.createElement('div');
            wrapper.className = 'qr-code-wrapper fade-in';
            this.currentQRCode.append(wrapper);
            qrCodeContainer.appendChild(wrapper);

            document.getElementById('downloadSection').classList.remove('hidden');
            this.updateShareURL();
            this.showNotification('QR Code generated!', 'success');

        } catch (error) {
            console.error('Error generating QR code:', error);
            document.getElementById('qrPlaceholder').style.display = 'flex';
        }
    }

    downloadQRCode() {
        if (!this.currentQRCode) return;

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 400;
            const padding = 30;

            canvas.width = size + (padding * 2);
            canvas.height = size + (padding * 2) + 30;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 4;
            ctx.lineJoin = 'round';

            const borderRadius = 15;
            const x = 2;
            const y = 2;
            const width = canvas.width - 4;
            const height = canvas.height - 34;

            ctx.beginPath();
            ctx.moveTo(x + borderRadius, y);
            ctx.lineTo(x + width - borderRadius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
            ctx.lineTo(x + width, y + height - borderRadius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
            ctx.lineTo(x + borderRadius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
            ctx.lineTo(x, y + borderRadius);
            ctx.quadraticCurveTo(x, y, x + borderRadius, y);
            ctx.closePath();
            ctx.stroke();

            const qrCanvas = document.querySelector('#qrCode canvas');
            if (qrCanvas) {
                ctx.drawImage(qrCanvas, padding, padding, size, size);
            }

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('r1 creations', canvas.width / 2, canvas.height - 10);

            const link = document.createElement('a');
            link.download = 'r1-creation-qr.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

        } catch (error) {
            if (this.currentQRCode) {
                this.currentQRCode.download({ name: "r1-creation-qr", extension: "png" });
            }
        }
    }

    copyShareURL() {
        const shareUrlInput = document.getElementById('shareUrl');
        const url = shareUrlInput.value;

        if (!url) {
            this.showNotification('No URL to copy', 'warning');
            return;
        }

        navigator.clipboard.writeText(url).then(() => {
            this.showNotification('URL copied!', 'success');
            const copyBtn = document.getElementById('copyUrlBtn');
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
        }).catch(() => {
            shareUrlInput.select();
            document.execCommand('copy');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.backgroundColor = colors[type] || colors.info;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});
