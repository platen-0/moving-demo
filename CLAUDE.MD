# CLAUDE.MD

## Project Overview

We are building an engaging, gamified, value-first tooling lead generation funnel.
 
## About the Prompter
Prompter is **non-technical**. Consider advanced technical considerations, don't assume the user has considered every option. Surface such considerations when you think they are relevant, but do not implement without user permission.

## Code Conventions

- **Imports**: Use `.js` extensions for local imports (ESM)
- **Validation**: Use Zod for all input validation
- **Error Responses**: `{ success: false, error: { code, message } }`
- **Success Responses**: `{ success: true, data, pagination? }`
- **Database**: snake_case columns, Drizzle handles conversion
- **No workarounds** - Fix root causes, don't suppress errors. No fallback/legacy modes without explicit permission.
- **Fail Loudly** - Issues should be surfaced, and errors encoded for proper debugging. Don't patch issues improperly, fix the fundamentals.  
- **Question bad approaches** - Don't blindly agree. Suggest better alternatives. Point out mistakes immediately.
- **Verify before completing** - Run the code and confirm it works before marking a task done.
- **Ask when unsure** - User can check UI, console logs, or clarify requirements.
- **Avoid duplicate code** - Create helper functions.

## Documentation

- `docs/PRD.md` - Product requirements
- `docs/ARCHITECTURE.md` - Technical architecture
- `docs/context-management.md` - LLM token optimization

## Health Endpoints

- `GET /health` - Basic status
- `GET /health/detailed` - DB + Redis status
- `GET /health/config` - Environment configuration status
