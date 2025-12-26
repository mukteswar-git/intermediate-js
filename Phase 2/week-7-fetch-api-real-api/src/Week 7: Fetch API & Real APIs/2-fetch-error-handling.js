// Error Handling in Fetch

// Basic Error Handling
async function basicErrorHandling() {
  try {
    const response = await fetch('https://api.example.com/data');

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    // Handle network errors and thrown errors
    console.error('Fetch error:', error);
    throw error;
  }
}

// Comprehensive Error Handling
async function comprehensiveErrorHandling(url) {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000)
    });

    // Check responses status
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorBody}`);
    }

    // Try to parse JSON
    try {
      const data = await response.json();
      return data;
    } catch (jsonError) {
      throw new Error('Invalid JSON response')
    }
  } catch (error) {
    // Handle different error types
    if (error.name === 'AbortError') {
      console.log('Request timeout');
    } else if (error.name === 'TypeError') {
      console.log('Network error or CORS issue');
    } else {
      console.log('Error:', error.message);
    }

    throw error;
  }
}

// Request Timeout
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return await response.json();

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

// Retry Logic
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;

      if (isLastAttempt) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay)); 
    }
  }
}