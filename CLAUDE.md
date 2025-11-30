# Claude Agent Project Configuration

## Project Overview
This project implements production-ready Claude AI coding agents following Anthropic's best practices for building effective AI agents.

## Build Commands
```bash
# Run the main agent demonstration
python claude_agent.py

# Run specific examples
python examples/research_plan_implement.py
python examples/tdd_workflow.py
python examples/code_review_agent.py

# Run tests
pytest tests/ -v --cov=. --cov-report=html

# Type checking
mypy claude_agent.py --strict

# Linting
pylint claude_agent.py
black claude_agent.py --check
```

## Code Style Guidelines

### Python Style
- Follow PEP 8 style guide
- Use type hints for all function signatures
- Maximum line length: 100 characters
- Use f-strings for string formatting (not %-formatting or .format())
- Prefer dataclasses over dictionaries for structured data
- Use descriptive variable names (no single-letter variables except loop counters)

### Documentation
- All public functions must have docstrings
- Use Google-style docstrings
- Include type information in docstrings
- Provide usage examples for complex functions

### Code Organization
```python
# Import order:
# 1. Standard library
# 2. Third-party packages
# 3. Local modules

# Example:
import json
import logging
from typing import Dict, List

from anthropic import Anthropic
import numpy as np

from .tools import FileTool
from .utils import validate_input
```

### Error Handling
- Always use specific exception types (not bare `except:`)
- Log errors with appropriate context
- Provide helpful error messages for users
- Use context managers for resource cleanup

```python
# Good
try:
    result = risky_operation()
except ValueError as e:
    logger.error(f"Invalid input: {e}")
    raise
finally:
    cleanup_resources()

# Bad
try:
    result = risky_operation()
except:
    pass
```

## Testing Requirements

### Coverage
- Minimum 80% code coverage required
- All new features must include tests
- Test edge cases explicitly
- Test error conditions

### Test Organization
```
tests/
├── unit/
│   ├── test_agent.py
│   ├── test_tools.py
│   └── test_orchestrator.py
├── integration/
│   ├── test_workflows.py
│   └── test_api_integration.py
└── fixtures/
    ├── sample_code.py
    └── test_data.json
```

### Test Patterns
```python
# Use pytest fixtures
@pytest.fixture
def sample_agent():
    return ClaudeAgent(model="claude-sonnet-4-5")

# Use parametrize for multiple cases
@pytest.mark.parametrize("input,expected", [
    ("valid@email.com", True),
    ("invalid-email", False),
])
def test_email_validation(input, expected):
    assert validate_email(input) == expected

# Mock external API calls
@patch('anthropic.Anthropic.messages.create')
def test_agent_execution(mock_create):
    mock_create.return_value = mock_response
    result = agent.execute(task)
    assert result.success
```

## Workflow Guidelines

### Git Workflow
1. Create feature branch from main: `git checkout -b feature/your-feature`
2. Make atomic commits with clear messages
3. Run tests before committing: `pytest`
4. Run linting: `black . && pylint claude_agent.py`
5. Push and create PR with description
6. Squash commits before merging

### Commit Message Format
```
type(scope): short description

Longer explanation if needed.

- Bullet points for details
- Reference issues with #123
```

Types: feat, fix, docs, test, refactor, style, chore

Examples:
- `feat(orchestrator): add worker pool management`
- `fix(tools): handle timeout in code execution`
- `docs(readme): add installation instructions`

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New code has tests
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Error handling in place

## Agent-Specific Guidelines

### Prompt Engineering
When creating prompts:
1. Be specific and unambiguous
2. Include 3-5 examples for complex tasks
3. Use thinking modes appropriately:
   - Simple tasks: normal thinking
   - Complex logic: "think hard"
   - Critical systems: "think harder" or "ultrathink"
4. Structure with XML tags for clarity when needed
5. Provide clear success criteria

### Tool Design
When creating new tools:
1. Clear, descriptive names (verb_noun format)
2. Comprehensive parameter descriptions with examples
3. Sensible defaults to minimize required parameters
4. Input validation with helpful error messages
5. Structured output formats (prefer JSON)
6. Consider safety and approval requirements

Example:
```python
Tool(
    name="search_codebase",
    description="Search for patterns in code. Returns file paths and line numbers.",
    parameters={
        "pattern": {
            "type": "string",
            "description": "Regex pattern. Example: 'def\\s+\\w+' for function definitions",
            "required": True
        },
        "max_results": {
            "type": "integer",
            "description": "Max results (1-100). Default: 20",
            "default": 20
        }
    },
    function=search_function
)
```

### Context Management
- Clear context between unrelated tasks: `agent.clear_context()`
- Use subagents for verification to preserve main context
- Keep tool count reasonable (10-20 well-designed tools)
- Use prompt chaining for multi-stage tasks

### Cost Optimization
- Use Haiku for simple execution tasks
- Use Sonnet for complex reasoning and orchestration
- Use Opus only for highest-quality critical tasks
- Monitor token usage and set budgets
- Clear context when switching tasks

Model selection guide:
```python
# Orchestrator (needs reasoning)
orchestrator = ClaudeAgent(model="claude-sonnet-4-5")

# Workers (straightforward execution)
workers = [ClaudeAgent(model="claude-haiku-4-5")]

# Quality evaluator (needs judgment)
evaluator = ClaudeAgent(model="claude-sonnet-4-5")
```

## Security Considerations

### API Keys
- NEVER commit API keys to git
- Use environment variables: `ANTHROPIC_API_KEY`
- Use .env files (and add to .gitignore)
- Rotate keys regularly

### Tool Safety
- Require approval for destructive operations
- Sandbox code execution
- Validate all inputs
- Implement rate limiting
- Log all agent actions
- Set appropriate timeouts

### Allowlists
Configure safe operations in `.claude/permissions.json`:
```json
{
  "bash": {
    "allowed": ["git", "pytest", "npm"],
    "blocked": ["rm -rf", "sudo", "curl"]
  },
  "file_write": {
    "allowed_paths": ["src/", "tests/"],
    "blocked_paths": [".env", "*.key", "credentials.json"]
  }
}
```

## Environment Variables

Required:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

Optional:
```bash
CLAUDE_MODEL=claude-sonnet-4-5
CLAUDE_MAX_TOKENS=4096
LOG_LEVEL=INFO
ENABLE_TELEMETRY=false
```

## MCP Servers

Available Model Context Protocol servers:
- `filesystem`: File operations with restricted access
- `github`: GitHub API integration
- `puppeteer`: Browser automation for visual testing

Configure in `.mcp.json` (see file for details)

## Helpful Commands

### Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run in development mode with debugging
PYTHONPATH=. python -m pdb claude_agent.py

# Run with specific log level
LOG_LEVEL=DEBUG python claude_agent.py

# Type checking
mypy . --install-types
```

### Production
```bash
# Run with production settings
CLAUDE_MODEL=claude-sonnet-4-5 python claude_agent.py

# Run as service (example)
gunicorn app:app --workers 4 --timeout 120
```

## Troubleshooting

### Common Issues

1. **Tool execution fails**
   - Check tool parameter types match schema
   - Verify function has proper error handling
   - Review logs for detailed error messages

2. **High token usage**
   - Clear context between tasks
   - Use appropriate model tiers
   - Reduce number of examples in prompts

3. **Poor output quality**
   - Increase thinking mode intensity
   - Provide more specific instructions
   - Add relevant examples
   - Use evaluator-optimizer pattern

4. **MCP server connection issues**
   - Run with `--mcp-debug` flag
   - Check server logs
   - Verify server is running and accessible

## Additional Resources

- [Anthropic Documentation](https://docs.anthropic.com)
- [Claude Best Practices Guide](./CLAUDE_BEST_PRACTICES.md)
- [Example Scripts](./examples/)
- [API Reference](https://docs.anthropic.com/en/api)
