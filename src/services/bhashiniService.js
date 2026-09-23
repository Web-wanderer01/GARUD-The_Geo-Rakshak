/**
 * Service to interface with the Bhashini API (National Language Translation Mission)
 */

export const translateWithBhashini = async (text, sourceLang = 'en', targetLang) => {
  // If english to english, just return
  if (sourceLang === targetLang) return text;
  
  const API_KEY = import.meta.env.VITE_BHASHINI_API_KEY;
  const USER_ID = import.meta.env.VITE_BHASHINI_USER_ID;
  
  // If API keys are not provided in .env, fall back to local mock translations
  if (!API_KEY || API_KEY === 'your_bhashini_api_key_here') {
    return null; // Signals the UI to use the fallback `alert.translations` mock
  }

  try {
    // Note: Bhashini requires a complex pipeline token generation first.
    // This is a simplified fetch based on their ULCA spec inference endpoint.
    // You will need to replace the PIPELINE_ID and URL with the exact ones provided in your Bhashini Dashboard.
    const PIPELINE_ID = import.meta.env.VITE_BHASHINI_PIPELINE_ID || 'dummy-pipeline-id';
    
    const response = await fetch('https://dhruva-api.bhashini.gov.in/services/inference/pipeline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY,
        'userID': USER_ID
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: "translation",
            config: {
              language: {
                sourceLanguage: sourceLang,
                targetLanguage: targetLang
              },
              serviceId: PIPELINE_ID
            }
          }
        ],
        inputData: {
          input: [
            {
              source: text
            }
          ]
        }
      })
    });

    if (!response.ok) {
      throw new Error('Bhashini API connection failed');
    }

    const data = await response.json();
    // Parse Bhashini response structure
    return data.pipelineResponse[0].output[0].target;

  } catch (error) {
    console.error("Bhashini Translation Error:", error);
    return null;
  }
};
