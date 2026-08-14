## 2023-10-10 - Silent Failures in JSON Output Handling
**Learning:** Returning truncated raw model text instead of parsing JSON requests masks AI output parsing failures. By just slicing the response text when a JSON array is requested, we completely fail to leverage structured data and break downstream frontend dependencies silently.
**Action:** Always use `response_mime_type="application/json"` with Gemini, validate the structure of `json.loads` output, and provide a graceful structured fallback instead of returning a mock structure containing raw string text.
