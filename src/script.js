// Import and inject Vercel Speed Insights
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights
injectSpeedInsights();

// OVA functionality
function entrarOva() {
    alert('Funcionalidad OVA - Por implementar');
}

// Make function globally available
window.entrarOva = entrarOva;
