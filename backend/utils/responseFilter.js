/**
 * Filter out internal monologue/thinking from AI responses
 * Some models (especially Qwen) include their reasoning process in the output
 */

function filterResponse(response, model) {
  if (!response || typeof response !== 'string') return response;
  
  // Only apply filtering to models that tend to include internal monologue
  if (model === 'groq-qwen') {
    let filtered = response;
    
    // More aggressive patterns to remove thinking/reasoning
    const thinkingPatterns = [
      // Remove everything before "I can't" or "Here's" or similar response starters
      /^[\s\S]*?(?=I can't|Here's|Let me|I'll|I'm|The|This|That|It's|There's|You can)/m,
      // Remove common thinking starters
      /^(Okay|Alright|Let me think|I need to|First,|The user wants|Hmm|Well|So|Now)[\s\S]*?(?=\n)/m,
      // Remove lines that start with thinking words
      /^(Okay|Alright|Let me think|I need to|First,|The user wants|Hmm|Well|So|Now)[^\n]*\n/gm,
      // Remove multiple consecutive thinking lines
      /^(Okay|Alright|Let me think|I need to|First,|The user wants|Hmm|Well|So|Now)[\s\S]*?(?=[A-Z][a-z])/m,
    ];
    
    thinkingPatterns.forEach(pattern => {
      filtered = filtered.replace(pattern, '');
    });
    
    // Clean up extra whitespace and empty lines
    filtered = filtered.replace(/^\n+|\n+$/g, '').replace(/\n{3,}/g, '\n\n').trim();
    
    return filtered;
  }
  
  return response;
}

module.exports = { filterResponse };
