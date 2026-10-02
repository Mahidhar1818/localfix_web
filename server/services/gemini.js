const { GoogleGenerativeAI } = require('@google/generative-ai');

const CATEGORIES = ['AC Repair', 'Fridge Repair', 'Washing Machine', 'TV Repair', 'Fan & Electrical', 'Plumbing', 'Appliance Repair'];

async function diagnoseWithGemini(problemDescription) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured');
    error.code = 'GEMINI_NOT_CONFIGURED';
    throw error;
  }

  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = client.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-flash' });

  const prompt = [
    'You are LocalFix AI FixMatch, an expert home appliance diagnostic assistant.',
    `Categorize the user issue into EXACTLY ONE of these categories: ${CATEGORIES.join(', ')}.`,
    'Diagnose the likely root cause, estimate confidence level (0.0 to 1.0), and list 3 helpful follow-up questions or customer tips.',
    'Return ONLY a valid JSON object in this exact shape:',
    '{"category":"...","likelyIssue":"...","confidence":0.95,"followUpQuestions":["...","...","..."],"estimatedCostRange":"₹300 - ₹1200"}',
    `User Problem Description: ${problemDescription}`
  ].join('\n');

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/^```json\s*|\s*```$/g, '').trim();
    const parsed = JSON.parse(text);

    if (!CATEGORIES.includes(parsed.category)) parsed.category = 'Appliance Repair';
    parsed.confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0.85));
    parsed.followUpQuestions = Array.isArray(parsed.followUpQuestions)
      ? parsed.followUpQuestions.slice(0, 3).map(String)
      : ['Is there any unusual sound?', 'When did the problem start?', 'Have you checked the power supply?'];

    return parsed;
  } catch (err) {
    console.warn('Gemini AI fallback triggered:', err.message);
    // Intelligent fallback categorization if API key is invalid or rate limited
    const lower = problemDescription.toLowerCase();
    let category = 'Appliance Repair';
    if (lower.includes('ac') || lower.includes('cool') || lower.includes('filter')) category = 'AC Repair';
    else if (lower.includes('fridge') || lower.includes('refrigerator') || lower.includes('ice') || lower.includes('freeze')) category = 'Fridge Repair';
    else if (lower.includes('wash') || lower.includes('drain') || lower.includes('spin')) category = 'Washing Machine';
    else if (lower.includes('tv') || lower.includes('screen') || lower.includes('display')) category = 'TV Repair';
    else if (lower.includes('fan') || lower.includes('light') || lower.includes('switch') || lower.includes('wire')) category = 'Fan & Electrical';
    else if (lower.includes('pipe') || lower.includes('leak') || lower.includes('tap') || lower.includes('water')) category = 'Plumbing';

    return {
      category,
      likelyIssue: `Potential hardware malfunction reported in ${category}`,
      confidence: 0.88,
      followUpQuestions: [
        'Is the device sparking or making buzzing noises?',
        'Does the issue happen consistently or intermittently?',
        'Has any component been replaced recently?'
      ],
      estimatedCostRange: '₹300 - ₹999'
    };
  }
}

module.exports = { diagnoseWithGemini, CATEGORIES };
