# Claude AI Best Practices & Coding Agent Guide

## Table of Contents
1. [Prompt Engineering Fundamentals](#prompt-engineering-fundamentals)
2. [Agent Architecture Patterns](#agent-architecture-patterns)
3. [Coding Agent Best Practices](#coding-agent-best-practices)
4. [Tool Design & Integration](#tool-design--integration)
5. [Production Considerations](#production-considerations)

---

## Prompt Engineering Fundamentals

### Core Principles

1. **Be Clear and Direct**
   - Communicate requirements explicitly and unambiguously
   - Avoid vague instructions; specify exactly what you want
   - Example: ❌ "Make this better" → ✅ "Refactor this function to use async/await and add error handling for network timeouts"

2. **Use Examples (Multishot Prompting)**
   - Provide 3-5 input-output examples to guide behavior
   - Examples are more effective than lengthy explanations
   - Show edge cases and expected handling

3. **Chain of Thought Prompting**
   - Encourage step-by-step reasoning with "think step-by-step"
   - For complex problems, use extended thinking: "think" < "think hard" < "think harder" < "ultrathink"
   - Claude performs better when allowed to show its reasoning

4. **XML Tags for Structure**
   - Use XML tags to organize complex prompts: `<instructions>`, `<examples>`, `<context>`
   - Modern models understand structure without XML too—use clear headings and whitespace
   - XML is most useful for minimizing ambiguity in complex prompts

5. **System Prompts for Role Assignment**
   - Use system messages to set Claude's role and behavior
   - System prompts are immutable—neither users nor tools can override them
   - Example: "You are an expert Python developer specializing in data processing pipelines"

6. **Prefilling Responses**
   - Start Claude's response to guide output direction
   - Useful for enforcing formats: `{"analysis": "`
   - Helps with consistency in multi-turn conversations

### Optimization Techniques

- **Specificity Wins**: "Add tests for foo.py" → "Write pytest test cases for foo.py covering edge cases when users are logged out; use fixtures instead of mocks"
- **Visual Context**: Include screenshots, diagrams, or design mocks—images significantly improve output quality
- **Context Management**: Use `/clear` between unrelated tasks to reset focus
- **Iterative Refinement**: Make plans before coding, interrupt with Escape, edit previous prompts with double-tap Escape

---

## Agent Architecture Patterns

### Workflow vs. Agent

- **Workflows**: LLMs and tools orchestrated through predefined code paths (deterministic)
- **Agents**: LLMs dynamically direct their own processes and tool usage (autonomous)

### Six Scalable Production Patterns

#### 1. Augmented LLM (Foundation Layer)
```
User Input → LLM + [Retrieval + Tools + Memory] → Output
```
**When to use**: Single-turn tasks with external knowledge or actions
**Components**:
- Retrieval: Access to knowledge bases, documents, APIs
- Tools: Capacity to interact with external services
- Memory: Retain information across interactions

#### 2. Prompt Chaining
```
Input → LLM₁ → Intermediate → LLM₂ → Intermediate → LLM₃ → Final Output
```
**When to use**: Tasks decomposable into fixed sequential steps
**Example**: Document processing → Extract data → Transform → Validate → Format

#### 3. Routing
```
Input → Classifier LLM → Route to Specialized Handler → Output
```
**When to use**: Multiple specialized workflows for different input types
**Example**: Customer query → Route to [Billing | Technical | Sales] agent

#### 4. Parallelization
```
Input → Split → [LLM₁, LLM₂, LLM₃] → Aggregate/Vote → Output
```
**When to use**: Independent subtasks or consensus needed
**Strategies**: Sectioning (split work), voting (majority wins)

#### 5. Orchestrator-Workers (Recommended for Coding)
```
Input → Orchestrator LLM → [Worker₁, Worker₂, ...] → Synthesis → Output
```
**When to use**: Complex, unpredictable tasks requiring dynamic delegation
**Key principle**: Orchestrator plans, delegates, and synthesizes; workers execute specific subtasks

#### 6. Evaluator-Optimizer
```
Input → Generator LLM → Output → Evaluator LLM → [Refine or Accept]
```
**When to use**: Quality-critical outputs requiring iteration
**Pattern**: Generate → Evaluate → Refine loop until criteria met

---

## Coding Agent Best Practices

### Research-Plan-Implement Workflow

```
1. EXPLORE: Read relevant files without writing code
   - Use subagents to investigate codebase
   - Gather full context before planning

2. PLAN: Create explicit implementation plan
   - Use extended thinking modes for complex tasks
   - Break down into manageable sub-tasks
   - Have Claude create markdown checklists for migrations

3. IMPLEMENT: Write code with verification
   - Implement incrementally
   - Verify each step before proceeding
   - Use subagents to check implementations aren't overfitting

4. VERIFY: Test and validate
   - Run tests, check edge cases
   - Use separate Claude instance to review code

5. COMMIT: Document and finalize
   - Write clear commit messages
   - Update documentation
```

### Test-Driven Development with Claude

```python
# 1. Write tests first based on input/output pairs
def test_user_authentication_logged_out():
    """Test that logged-out users receive 401 error"""
    response = api.get('/protected', auth=None)
    assert response.status_code == 401
    assert "authentication required" in response.json()['error']

# 2. Confirm tests fail without implementation
# 3. Code iteratively until tests pass
# 4. Use subagents to verify no overfitting
```

### Environment Customization

#### CLAUDE.md Files
Create project-specific context files:

```markdown
# Project: AI Coding Agent

## Build Commands
- `npm run build` - Build TypeScript
- `npm test` - Run Jest tests
- `npm run lint` - ESLint with auto-fix

## Code Style
- Use async/await (not .then())
- Prefer functional programming patterns
- Maximum line length: 100 characters
- Use descriptive variable names

## Testing Requirements
- All new features must have tests
- Aim for >80% coverage
- Use Jest mocks for external APIs
- Test edge cases explicitly

## Workflow
- Create feature branch from main
- Run tests before committing
- Write conventional commit messages
- Squash commits before merging
```

Place at:
- Repository root: `./CLAUDE.md`
- Home folder: `~/.claude/CLAUDE.md`
- Parent/child directories for context inheritance

### Tool Allowlists

Configure safe tool usage:
```json
{
  "permissions": {
    "bash": {
      "allowedCommands": ["npm", "git", "pytest", "docker"],
      "requireApproval": ["rm", "sudo", "curl"]
    },
    "fileWrite": {
      "allowedPaths": ["src/", "tests/"],
      "blockedPaths": [".env", "credentials.json"]
    }
  }
}
```

### Multi-Claude Workflows

**Separation of Concerns**:
```bash
# Terminal 1: Implementation
claude --context "Implement user authentication"

# Terminal 2: Code Review
claude --context "Review the authentication implementation for security issues"

# Terminal 3: Testing
claude --context "Write comprehensive tests for authentication"
```

**Parallel Execution**:
```bash
# Use git worktrees for isolated concurrent work
git worktree add ../project-feature-a feature-a
git worktree add ../project-feature-b feature-b

# Run separate Claude sessions without conflicts
```

---

## Tool Design & Integration

### Agent-Computer Interface (ACI) Principles

Design tools with the same care as human interfaces:

#### Good Tool Design
```python
{
  "name": "search_codebase",
  "description": "Search for code patterns across the repository. Returns file paths and line numbers.",
  "parameters": {
    "pattern": {
      "type": "string",
      "description": "Regex pattern to search for. Example: 'async\\s+def\\s+\\w+' for async functions"
    },
    "file_types": {
      "type": "array",
      "description": "File extensions to search. Example: ['py', 'js']",
      "default": ["*"]
    },
    "max_results": {
      "type": "integer",
      "description": "Maximum results to return (1-100)",
      "default": 20
    }
  }
}
```

#### Tool Design Checklist
- ✅ Clear, descriptive tool names
- ✅ Comprehensive parameter descriptions with examples
- ✅ Sensible defaults to minimize required parameters
- ✅ Input validation with helpful error messages
- ✅ Structured output formats (JSON preferred)
- ✅ Idempotent operations when possible
- ✅ Appropriate granularity (not too fine, not too coarse)

### MCP (Model Context Protocol) Integration

```json
// .mcp.json - Checked into repository
{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

Troubleshooting: Use `--mcp-debug` flag

---

## Production Considerations

### Three Foundational Principles

1. **Simplicity** - Start with the simplest solution; add complexity only when it demonstrably improves outcomes
2. **Transparency** - Explicitly display agent's planning and reasoning steps
3. **Documentation & Testing** - Thoroughly craft and test agent-computer interfaces

### Security & Safety

```python
# Sandbox environment for agent testing
class SafeAgentEnvironment:
    def __init__(self):
        self.allowed_operations = ['read', 'write_to_temp', 'api_call']
        self.blocked_operations = ['system_modification', 'network_unrestricted']

    def validate_operation(self, operation, context):
        """Validate before execution"""
        if operation in self.blocked_operations:
            raise SecurityError(f"Operation {operation} not allowed")

        if operation == 'api_call':
            if not self.is_whitelisted_domain(context['url']):
                raise SecurityError(f"Domain {context['url']} not whitelisted")

        return True
```

**Security Checklist**:
- ✅ Extensive testing in sandboxed environments
- ✅ Appropriate guardrails for autonomous behavior
- ✅ Cost monitoring and limits
- ✅ Error handling and recovery mechanisms
- ✅ Audit logging for agent actions
- ✅ Human oversight for critical operations
- ✅ Rate limiting to prevent runaway costs

### Performance Optimization

**Context Management**:
- Tool descriptions are prominent in context window
- Keep tool count reasonable (10-20 well-designed tools > 100 narrow tools)
- Use prompt chaining for multi-stage tasks to reset context
- Clear context between unrelated tasks

**Cost Optimization**:
```python
# Use appropriate model tiers
orchestrator = Claude(model="claude-sonnet-4-5")  # Complex reasoning
workers = [Claude(model="claude-haiku-4-5")]      # Simple execution tasks
evaluator = Claude(model="claude-sonnet-4-5")     # Quality checks
```

### Monitoring & Observability

```python
import logging
from datetime import datetime

class AgentLogger:
    def log_agent_action(self, agent_id, action, context, result):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "agent_id": agent_id,
            "action": action,
            "context": context,
            "result": result,
            "tokens_used": result.get('usage', {}),
            "cost_estimate": self.calculate_cost(result)
        }
        logging.info(f"Agent action: {log_entry}")
        return log_entry
```

### Error Handling Patterns

```python
class AgentWithRetry:
    def execute_with_retry(self, task, max_attempts=3):
        for attempt in range(max_attempts):
            try:
                result = self.agent.execute(task)

                # Validate result quality
                if self.is_valid_result(result):
                    return result

                # If invalid, provide feedback for next attempt
                task = self.refine_task_with_feedback(task, result)

            except Exception as e:
                if attempt == max_attempts - 1:
                    raise

                # Log and retry with adjusted parameters
                logging.warning(f"Attempt {attempt + 1} failed: {e}")
                time.sleep(2 ** attempt)  # Exponential backoff

        raise MaxRetriesExceeded("Agent failed after maximum attempts")
```

---

## Quick Reference Card

### When to Use Each Pattern

| Use Case | Pattern | Complexity |
|----------|---------|------------|
| Single query with tools | Augmented LLM | Low |
| Fixed multi-step pipeline | Prompt Chaining | Low |
| Multiple specialized workflows | Routing | Medium |
| Independent parallel tasks | Parallelization | Medium |
| Complex dynamic coding tasks | Orchestrator-Workers | High |
| Quality-critical iteration | Evaluator-Optimizer | Medium |

### Prompt Engineering Checklist

- ✅ Clear success criteria defined
- ✅ Specific, unambiguous instructions
- ✅ 3-5 examples provided (if applicable)
- ✅ Chain of thought enabled for complex tasks
- ✅ Appropriate system prompt for context
- ✅ Structured format (XML or clear sections)
- ✅ Empirical testing against criteria

### Coding Agent Checklist

- ✅ CLAUDE.md created with project context
- ✅ Tool allowlists configured
- ✅ Explore → Plan → Implement → Verify workflow
- ✅ Subagents used for verification
- ✅ Tests written before implementation
- ✅ Context cleared between unrelated tasks
- ✅ Git integration for version control

---

## Additional Resources

- **Official Docs**: https://docs.anthropic.com
- **Claude Code Best Practices**: https://www.anthropic.com/engineering/claude-code-best-practices
- **Building Effective Agents**: https://www.anthropic.com/research/building-effective-agents
- **Prompt Engineering Guide**: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview
- **Agent SDK**: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk

---

*Last Updated: November 2025*
*Based on Claude Sonnet 4.5 capabilities*
