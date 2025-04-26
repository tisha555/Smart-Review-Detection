// Only initialize if not already initialized
if (typeof window.reviewAnalyzerInitialized === 'undefined') {
    window.reviewAnalyzerInitialized = true;

    let analyzedData = null;

    function extractReviews() {
        const reviewElements = document.querySelectorAll('[data-hook="review"]');
        const reviews = [];
        
        reviewElements.forEach(review => {
            const content = review.querySelector('.review-text')?.innerText.trim();
            const ratingElement = review.querySelector('.review-rating');
            const ratingText = ratingElement ? ratingElement.innerText.trim() : 'N/A';
            
            if (content) {
                reviews.push({
                    text: content,
                    rating: ratingText
                });
            }
        });
        
        return reviews;
    }

    async function analyzeReviews(reviews) {
        try {
            console.log('Sending reviews:', reviews);
            const response = await fetch('http://127.0.0.1:5000/predict_batch', {
                method: 'POST',
                mode: 'cors', 
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ reviews: reviews.map(r => r.text) })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const predictions = await response.json();
            console.log('Received predictions:', predictions);
            return predictions;
        } catch (error) {
            console.error('Error analyzing reviews:', error);
            return null;
        }
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "getReviews") {
            if (analyzedData) {
                sendResponse(analyzedData);
            } else {
                const reviews = extractReviews();
                if (reviews.length > 0) {
                    analyzeReviews(reviews).then(predictions => {
                        if (predictions) {
                            // Match predictions with original reviews
                            const enrichedReviews = reviews.map((review, index) => ({
                                ...review,
                                prediction: predictions[index]
                            }));
                            analyzedData = { reviews: enrichedReviews, predictions };
                            sendResponse(analyzedData);
                        } else {
                            sendResponse({ error: "Failed to analyze reviews" });
                        }
                    });
                } else {
                    sendResponse({ error: "No reviews found" });
                }
            }
            return true; // Required for async sendResponse
        }
    });
}