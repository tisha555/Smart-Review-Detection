document.addEventListener('DOMContentLoaded', () => {
    const loadingDiv = document.getElementById('loading');
    const container = document.getElementById('reviews-container');

    // Query the active tab
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        const activeTab = tabs[0];
        
        if (!activeTab.url.includes('amazon.in')) {
            loadingDiv.style.display = 'none';
            container.innerHTML = '<div class="error">Please navigate to an Amazon product page.</div>';
            return;
        }

        try {
            // First inject the content script
            await chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                files: ['content.js']
            });

            // Wait a bit to ensure content script is initialized
            setTimeout(() => {
                // Now try to communicate with the content script
                chrome.tabs.sendMessage(
                    activeTab.id, 
                    {action: "getReviews"}, 
                    (response) => {
                        if (chrome.runtime.lastError) {
                            loadingDiv.style.display = 'none';
                            container.innerHTML = `<div class="error">Error: ${chrome.runtime.lastError.message}</div>`;
                            return;
                        }

                        loadingDiv.style.display = 'none';

                        if (!response) {
                            container.innerHTML = '<div class="error">No reviews found</div>';
                            return;
                        }

                        if (response.error) {
                            container.innerHTML = `<div class="error">${response.error}</div>`;
                            return;
                        }

                        displayResults(response.reviews);
                    }
                );
            }, 100); // Small delay to ensure content script is ready

        } catch (error) {
            loadingDiv.style.display = 'none';
            container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    });
});

function displayResults(reviews) {
    const container = document.getElementById('reviews-container');
    container.innerHTML = ''; // Clear previous results

    if (!reviews || reviews.length === 0) {
        container.innerHTML = '<div class="error">No reviews found on this page.</div>';
        return;
    }

    reviews.forEach((reviewItem) => {
        const prediction = reviewItem.prediction;
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-container';
        
        const labelClass = prediction.label === 'OR' ? 'label-or' : 'label-cg';
        const labelText = prediction.label === 'OR' ? 'Genuine' : 'Suspicious';
        
        reviewDiv.innerHTML = `
            <p class="review-text">${reviewItem.text}</p>
            <p class="rating">Rating: ${reviewItem.rating}</p>
            <p>Analysis: <span class="${labelClass}">${labelText}</span></p>
            <p class="confidence">Confidence: ${(prediction.confidence * 100).toFixed(1)}%</p>
        `;
        
        container.appendChild(reviewDiv);
    });
}