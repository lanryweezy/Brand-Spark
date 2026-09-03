## 2025-02-24 - Handle AI JSON Array Generation Parsing Gracefully
**Learning:** Returning a single truncated string instead of parsing an explicitly requested JSON array can silently lead to malformed data for the UI if the AI hallucinates formatting (like markdown wrapping), resulting in silent failures. When requesting JSON from an LLM, the raw string needs to be cleaned (stripping out markdown artifacts like ```json) and strictly parsed.
**Action:** When creating a prompt that requires structured JSON output, explicitly instruct the model NOT to include markdown or preamble. Use try/except blocks to wrap `json.loads`, validate the resulting schema (e.g., verifying it's a list with required keys), and provide a graceful fallback that matches the expected data shape in the UI if parsing or validation fails.
## 2023-10-10 - Silent Failures in JSON Output Handling
**Learning:** Returning truncated raw model text instead of parsing JSON requests masks AI output parsing failures. By just slicing the response text when a JSON array is requested, we completely fail to leverage structured data and break downstream frontend dependencies silently.
**Action:** Always use `response_mime_type="application/json"` with Gemini, validate the structure of `json.loads` output, and provide a graceful structured fallback instead of returning a mock structure containing raw string text.

## 2023-10-27 - Preserving Schema Compatibility in AI Fallbacks
**Learning:** When enforcing JSON schema outputs for AI generation, it's crucial to explicitly ask the model to generate all expected fields (like `note`) to ensure the response matches the shape required by the frontend client. Fallback mechanisms should also return a mock structure containing these identical fields.
**Action:** Always verify the full expected structure from the client before modifying the AI prompt or fallbacks to avoid schema-related regressions.
## 2023-10-10 - Bypassing AI Output Entirely
**Learning:** Returning a hardcoded response structure while ignoring the actual AI model's output constitutes a major silent failure and defeats the purpose of the integration.
**Action:** Always parse the actual AI response text (`resp.text`), validate it, and return the parsed data instead of returning mock data with a slice of raw text injected.

## 2025-02-25 - Multi-part text generation silent failures
**Learning:** Requesting multi-part text (like an email subject and body) in a single plain text response often leads to parsing issues, causing developers to silently hardcode fields (e.g., hardcoding the "subject" while only returning the "body" from the model).
**Action:** For any text generation task that requires multiple distinct fields, explicitly require a JSON object output using `response_mime_type="application/json"`. Parse and validate the response, ensuring all required fields are present, and fall back gracefully if missing.

## 2024-05-24 - [Graceful Fallbacks and Prompt Formatting for Raw Text Generation]
**Learning:** For endpoints generating plain string output (like ad copy or social posts), failing to explicitly instruct the model to exclude markdown formatting or preamble often results in corrupt string generation. When the AI fails, catching the exception and returning a generated fallback (like a generic on-brand template) is critical to prevent surfacing generic 500 errors to users and breaking the frontend formatting.
**Action:** Always add "Do not include markdown, preamble, or commentary" to simple text generation prompts. Always wrap AI call in a try/catch, logging the exact AI failure but catching the exception and returning a simple baseline template fallback that fulfills the endpoint's contract format (e.g. a plain text string representation) instead of raw 500 errors.

## 2026-08-20 - Prevent Silent 500 Errors in Plain Text Generation
**Learning:** For endpoints generating plain string output (like social posts or generic text), failing to explicitly instruct the model to exclude markdown formatting or preamble often results in corrupt string generation. If an exception happens, simply throwing a raw 500 error causes silent application/UI failures and bad UX.
**Action:** Always add "Do not include markdown, preamble, or commentary." to simple text generation prompts. Always wrap the AI call in a try/catch, log the exception, and return a clean, on-brand generic string fallback that strictly fulfills the endpoint's string contract format instead of letting raw 500 errors reach the user.

## 2025-02-25 - Output Validation for Nested AI Structures
**Learning:** Checking that `json.loads` returns an array using `isinstance(parsed, list)` is insufficient if the array contains incorrectly formatted items (e.g., missing keys or hallucinated structures). If you pass `parsed` directly to `jsonify` in this state, the frontend client will often silently crash or display broken UI when attempting to access expected keys like `keyword`, `volume`, or `difficulty`. Additionally, catching generic `Exception` blocks in AI endpoints and surfacing 500 errors causes sudden application breakages when the model service goes down or experiences a transient error.
**Action:** Always validate the structure of items *inside* generated JSON arrays and filter out invalid items before returning them. When catching generic exceptions outside of the JSON parsing block, always return a graceful fallback that matches the schema expected by the frontend rather than an HTTP 500 error.
## 2026-08-21 - Enforcing JSON Structure and Graceful Fallbacks
**Learning:** Manual markdown parsing/stripping for AI JSON output is brittle and can lead to silent data corruption when models hallucinate unexpected formatting. Furthermore, catching only specific parse errors while leaving network/API exceptions unhandled surfaces raw 500 errors and breaks the client.
**Action:** Always enforce JSON outputs using `response_mime_type="application/json"`. Use a single robust `except Exception` block to catch both parsing failures and generative model errors, returning a unified, clean fallback structure that satisfies the client UI.
## 2023-11-09 - Validate array item elements during JSON parsing
**Learning:** Checking that `json.loads` returns a list is necessary but not sufficient. AI models occasionally return lists of arbitrary elements (e.g., list of strings instead of dicts) when complex JSON schemas are requested.
**Action:** When validating AI-generated JSON arrays, iterate through the parsed list and explicitly verify that the inner items have the expected type (e.g. `dict`) and contain the minimum required structural keys before accepting the response.
## 2024-08-24 - Unified AI Error Handling for Graceful Fallbacks
**Learning:** For AI integrations where multiple potential failures exist (e.g., model 500 exceptions and structured JSON parse exceptions), nested `try/catch` blocks often inadvertently leak raw generative model exceptions up to generic 500 endpoint handlers, breaking UI flows that rely on deterministic data shapes.
**Action:** Replace nested error handling with a single broad `except Exception` block that catches both the generative model errors and the parsing errors. Use this unified block to return a single, cleanly formatted fallback response that strictly adheres to the client's expected schema shape.
## 2026-08-25 - Prevent Silent AI Hangs
**Learning:** Unguarded calls to `model.generate_content()` without a timeout can block the server indefinitely if the AI provider hangs, leading to a degraded user experience or 504 timeouts at the load balancer.
**Action:** Always include a timeout configuration, such as `request_options={'timeout': 10.0}`, to ensure requests fail loudly and can be handled gracefully by existing fallback logic.

## 2025-02-25 - Prevent Silent Server Hangs on AI Generation
**Learning:** Calling `model.generate_content()` without an explicit timeout can lead to the server thread blocking indefinitely if the LLM provider experiences network issues or severe latency, causing silent cascading failures in the API.
**Action:** Always include an explicit timeout when making generative API calls (e.g., `request_options={'timeout': 10.0}`) so the application can fail fast, catch the resulting exception, and return a graceful fallback response to the user.

## 2024-05-18 - Prompt Injection Mitigation and Context Efficiency
**Learning:** Raw user input in prompts presents an injection risk. Furthermore, including irrelevant UI details like brand color schemes wastes tokens in text-generation tasks.
**Action:** When handling untrusted user input, wrap it in explicit XML tags (like `<user_input>`) and instruct the model to treat the contents strictly as data, not commands. Additionally, improve context efficiency by systematically omitting low-signal context fields that are irrelevant to the specific task.
## 2024-03-27 - Mitigating Prompt Injection and Improving Context Efficiency
**Learning:** Raw user input embedded directly in prompts creates severe prompt injection vulnerabilities where users can bypass system instructions. Additionally, passing visual context (like colors) to text generation tasks wastes tokens without improving output quality.
**Action:** Always wrap untrusted user input in explicit XML tags (like `<user_input>`) and instruct the model to treat the contents strictly as data, not commands. Audit prompts to remove low-signal context fields that are irrelevant to the specific task.

## 2024-10-24 - Transient API Error Handling
**Learning:** Google Generative AI API calls can frequently fail with transient HTTP errors (e.g., 429 TooManyRequests or 500 InternalServerError). Simply wrapping the call in a try/catch and returning a graceful fallback is insufficient, as it leads to spurious failures for the user.
**Action:** Always wrap `model.generate_content` calls in a retry loop using exponential backoff (e.g., `call_ai_with_retry`) to handle `ResourceExhausted` and `InternalServerError` gracefully, ensuring a more resilient AI integration.
## 2024-10-25 - Apply Exponential Backoff Consistently
**Learning:** Adding retry logic to a single helper function (`call_ai_with_retry`) is only effective if all AI generation endpoints consistently use that helper. Failing to replace direct `model.generate_content` calls with the retry wrapper leaves several endpoints vulnerable to transient API failures, leading to spurious fallbacks.
**Action:** Ensure that all direct API calls to the generative model across the codebase are refactored to use the central retry wrapper (e.g., `call_ai_with_retry`) so that failure resilience with exponential backoff is applied uniformly.
## 2026-09-03 - Mitigating Prompt Injection in Concatenated Prompts
**Learning:** Embedding raw user inputs directly into prompt templates for generative text tasks (like social media posts) exposes the application to prompt injection, where a user can include commands (e.g., 'ignore previous instructions') that hijack the model's behavior.
**Action:** When constructing prompts from untrusted user data, always wrap the variables in explicit XML tags (e.g., `<tone>`, `<audience>`) and prepend instructions directing the model to treat the contents strictly as data to be processed, ignoring any commands contained within.
