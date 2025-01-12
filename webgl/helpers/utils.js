export const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

export const bubbleToElement = (startingElement, type) => {
    let currentElement = startingElement;
    let currentSection;
    while (currentElement) {
        if (currentElement.tagName.toLowerCase() === type) {
            currentSection = currentElement;
            break;
        }
        currentElement = currentElement.parentElement;
    }
    return currentSection;
}

export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Load Image Async
export function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
    });
}