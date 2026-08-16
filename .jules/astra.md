## 2023-10-10 - Silent Failures in JSON Output Handling
**Learning:** Returning truncated raw model text instead of parsing JSON requests masks AI output parsing failures. By just slicing the response text when a JSON array is requested, we completely fail to leverage structured data and break downstream frontend dependencies silently.
**Action:** Always use `response_mime_type="application/json"` with Gemini, validate the structure of `json.loads` output, and provide a graceful structured fallback instead of returning a mock structure containing raw string text.

## 2023-10-10 - Bypassing AI Output Entirely
**Learning:** Returning a hardcoded response structure while ignoring the actual AI model's output constitutes a major silent failure and defeats the purpose of the integration.
**Action:** Always parse the actual AI response text (`resp.text`), validate it, and return the parsed data instead of returning mock data with a slice of raw text injected.
