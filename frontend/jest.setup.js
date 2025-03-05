import '@testing-library/jest-dom';

if (typeof window.TextEncoder === 'undefined') {
    const { TextEncoder } = require('util');
    global.TextEncoder = TextEncoder;
}

if (typeof window.TextDecoder === 'undefined') {
    const { TextDecoder } = require('util');
    global.TextDecoder = TextDecoder;
}
