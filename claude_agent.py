"""
Claude Coding Agent - Production-Ready Implementation

This module implements an orchestrator-worker pattern for building
intelligent coding agents with Claude AI.

Based on Anthropic's best practices for building effective agents.
"""

import json
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Callable
from enum import Enum
from dataclasses import dataclass, field
import time


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AgentPattern(Enum):
    """Agent architecture patterns"""
    AUGMENTED_LLM = "augmented_llm"
    PROMPT_CHAINING = "prompt_chaining"
    ROUTING = "routing"
    PARALLELIZATION = "parallelization"
    ORCHESTRATOR_WORKERS = "orchestrator_workers"
    EVALUATOR_OPTIMIZER = "evaluator_optimizer"


class ThinkingMode(Enum):
    """Extended thinking modes for Claude"""
    NORMAL = "think"
    HARD = "think hard"
    HARDER = "think harder"
    ULTRA = "ultrathink"


@dataclass
class Tool:
    """
    Represents a tool available to the agent.
    Follows Agent-Computer Interface (ACI) best practices.
    """
    name: str
    description: str
    parameters: Dict[str, Any]
    function: Callable
    requires_approval: bool = False

    def to_anthropic_format(self) -> Dict[str, Any]:
        """Convert to Anthropic API tool format"""
        return {
            "name": self.name,
            "description": self.description,
            "input_schema": {
                "type": "object",
                "properties": self.parameters,
                "required": [
                    k for k, v in self.parameters.items()
                    if v.get("required", False)
                ]
            }
        }

    def execute(self, **kwargs) -> Any:
        """Execute the tool function with validation"""
        try:
            logger.info(f"Executing tool: {self.name} with args: {kwargs}")
            result = self.function(**kwargs)
            logger.info(f"Tool {self.name} completed successfully")
            return result
        except Exception as e:
            logger.error(f"Tool {self.name} failed: {str(e)}")
            raise


@dataclass
class AgentTask:
    """Represents a task for the agent"""
    task_id: str
    description: str
    context: Dict[str, Any] = field(default_factory=dict)
    thinking_mode: ThinkingMode = ThinkingMode.NORMAL
    max_iterations: int = 5
    require_verification: bool = True


@dataclass
class AgentResult:
    """Result from agent execution"""
    task_id: str
    success: bool
    output: Any
    iterations: int
    tokens_used: int
    cost_estimate: float
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


class ClaudeAgent:
    """
    Base Claude Agent implementation with best practices.

    This class provides core functionality for interacting with Claude
    following Anthropic's recommended patterns.
    """

    def __init__(
        self,
        model: str = "claude-sonnet-4-5",
        api_key: Optional[str] = None,
        system_prompt: Optional[str] = None,
        max_tokens: int = 4096
    ):
        self.model = model
        self.api_key = api_key
        self.system_prompt = system_prompt
        self.max_tokens = max_tokens
        self.conversation_history: List[Dict] = []
        self.tools: Dict[str, Tool] = {}

    def add_tool(self, tool: Tool) -> None:
        """Register a tool with the agent"""
        self.tools[tool.name] = tool
        logger.info(f"Registered tool: {tool.name}")

    def clear_context(self) -> None:
        """Clear conversation history to reset context window"""
        logger.info("Clearing conversation context")
        self.conversation_history = []

    def _build_prompt(
        self,
        task: str,
        thinking_mode: ThinkingMode = ThinkingMode.NORMAL,
        examples: Optional[List[Dict]] = None,
        use_xml: bool = True
    ) -> str:
        """
        Build an effective prompt following best practices.

        Args:
            task: The task description
            thinking_mode: Level of reasoning depth
            examples: Optional few-shot examples
            use_xml: Whether to use XML tags for structure
        """
        if use_xml:
            prompt = f"<task>\n{task}\n</task>\n\n"

            if examples:
                prompt += "<examples>\n"
                for i, example in enumerate(examples, 1):
                    prompt += f"<example_{i}>\n"
                    prompt += f"Input: {example['input']}\n"
                    prompt += f"Output: {example['output']}\n"
                    prompt += f"</example_{i}>\n"
                prompt += "</examples>\n\n"

            prompt += f"<instructions>\n{thinking_mode.value} about this step-by-step.\n"
            prompt += "Break down the problem, consider edge cases, and provide a clear solution.\n"
            prompt += "</instructions>"
        else:
            prompt = f"# Task\n{task}\n\n"

            if examples:
                prompt += "# Examples\n"
                for i, example in enumerate(examples, 1):
                    prompt += f"\n## Example {i}\n"
                    prompt += f"Input: {example['input']}\n"
                    prompt += f"Output: {example['output']}\n"

            prompt += f"\n# Instructions\n{thinking_mode.value} about this step-by-step.\n"
            prompt += "Break down the problem, consider edge cases, and provide a clear solution.\n"

        return prompt

    def execute(
        self,
        task: AgentTask,
        tools: Optional[List[str]] = None
    ) -> AgentResult:
        """
        Execute a task with the agent.

        This is a mock implementation. In production, this would call
        the Anthropic API.
        """
        logger.info(f"Executing task: {task.task_id}")
        logger.info(f"Description: {task.description}")

        # Mock implementation
        result = AgentResult(
            task_id=task.task_id,
            success=True,
            output=f"Completed: {task.description}",
            iterations=1,
            tokens_used=1000,
            cost_estimate=0.003,
            metadata={
                "thinking_mode": task.thinking_mode.value,
                "tools_available": list(self.tools.keys())
            }
        )

        logger.info(f"Task {task.task_id} completed successfully")
        return result


class OrchestratorAgent(ClaudeAgent):
    """
    Orchestrator agent that delegates work to specialized workers.

    Implements the Orchestrator-Workers pattern recommended by Anthropic
    for complex, dynamic coding tasks.
    """

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.workers: Dict[str, ClaudeAgent] = {}
        self.task_queue: List[AgentTask] = []
        self.results: Dict[str, AgentResult] = {}

    def add_worker(self, name: str, worker: ClaudeAgent) -> None:
        """Register a specialized worker agent"""
        self.workers[name] = worker
        logger.info(f"Registered worker: {name}")

    def plan(self, task: AgentTask) -> List[Dict[str, Any]]:
        """
        Create an execution plan for the task.

        Returns a list of subtasks with assigned workers.
        """
        logger.info(f"Planning task: {task.task_id}")

        # In production, this would use Claude to create a dynamic plan
        # Mock plan for demonstration
        plan = [
            {
                "subtask_id": f"{task.task_id}_1",
                "description": "Analyze requirements",
                "worker": "analyzer",
                "dependencies": []
            },
            {
                "subtask_id": f"{task.task_id}_2",
                "description": "Design solution",
                "worker": "designer",
                "dependencies": [f"{task.task_id}_1"]
            },
            {
                "subtask_id": f"{task.task_id}_3",
                "description": "Implement code",
                "worker": "coder",
                "dependencies": [f"{task.task_id}_2"]
            },
            {
                "subtask_id": f"{task.task_id}_4",
                "description": "Write tests",
                "worker": "tester",
                "dependencies": [f"{task.task_id}_3"]
            }
        ]

        logger.info(f"Created plan with {len(plan)} subtasks")
        return plan

    def delegate(self, subtask: Dict[str, Any]) -> AgentResult:
        """Delegate a subtask to the appropriate worker"""
        worker_name = subtask["worker"]

        if worker_name not in self.workers:
            logger.warning(f"Worker {worker_name} not found, using default")
            worker = self

        else:
            worker = self.workers[worker_name]

        task = AgentTask(
            task_id=subtask["subtask_id"],
            description=subtask["description"]
        )

        return worker.execute(task)

    def synthesize(self, results: List[AgentResult]) -> AgentResult:
        """
        Synthesize results from multiple workers into final output.

        Uses Claude to combine and validate worker outputs.
        """
        logger.info(f"Synthesizing {len(results)} worker results")

        # Mock synthesis
        combined_output = "\n\n".join([r.output for r in results if r.success])
        total_tokens = sum(r.tokens_used for r in results)
        total_cost = sum(r.cost_estimate for r in results)

        return AgentResult(
            task_id="synthesis",
            success=all(r.success for r in results),
            output=combined_output,
            iterations=len(results),
            tokens_used=total_tokens,
            cost_estimate=total_cost,
            metadata={
                "worker_results": len(results),
                "success_rate": sum(r.success for r in results) / len(results)
            }
        )

    def execute(
        self,
        task: AgentTask,
        tools: Optional[List[str]] = None
    ) -> AgentResult:
        """
        Execute a complex task using orchestrator-worker pattern.

        Workflow:
        1. Plan: Break task into subtasks
        2. Delegate: Assign subtasks to workers
        3. Synthesize: Combine worker results
        4. Verify: Check quality (if required)
        """
        logger.info(f"Orchestrator executing task: {task.task_id}")

        # Step 1: Plan
        plan = self.plan(task)

        # Step 2: Delegate (with dependency resolution)
        results = []
        completed = set()

        while len(completed) < len(plan):
            for subtask in plan:
                subtask_id = subtask["subtask_id"]

                if subtask_id in completed:
                    continue

                # Check if dependencies are met
                deps_met = all(dep in completed for dep in subtask["dependencies"])

                if deps_met:
                    result = self.delegate(subtask)
                    results.append(result)
                    completed.add(subtask_id)

        # Step 3: Synthesize
        final_result = self.synthesize(results)
        final_result.task_id = task.task_id

        # Step 4: Verify (if required)
        if task.require_verification:
            logger.info("Verification required, running quality check")
            # In production, use separate evaluator agent
            final_result.metadata["verified"] = True

        return final_result


class EvaluatorOptimizer:
    """
    Implements the Evaluator-Optimizer pattern for iterative refinement.

    Uses two agents: Generator creates output, Evaluator provides feedback.
    """

    def __init__(
        self,
        generator: ClaudeAgent,
        evaluator: ClaudeAgent,
        quality_threshold: float = 0.8
    ):
        self.generator = generator
        self.evaluator = evaluator
        self.quality_threshold = quality_threshold

    def evaluate(self, output: str, criteria: List[str]) -> Dict[str, Any]:
        """
        Evaluate output against quality criteria.

        Returns quality score and feedback for improvement.
        """
        logger.info("Evaluating output quality")

        # Mock evaluation
        evaluation = {
            "score": 0.85,
            "passed": True,
            "feedback": {
                "strengths": ["Clear code structure", "Good error handling"],
                "improvements": ["Add more comments", "Consider edge cases"]
            },
            "criteria_met": {criterion: True for criterion in criteria}
        }

        return evaluation

    def refine(self, task: AgentTask, feedback: Dict[str, Any]) -> AgentTask:
        """Create refined task based on evaluator feedback"""
        refined_description = f"{task.description}\n\nPrevious feedback:\n"
        for improvement in feedback["feedback"]["improvements"]:
            refined_description += f"- {improvement}\n"

        return AgentTask(
            task_id=f"{task.task_id}_refined",
            description=refined_description,
            context=task.context,
            thinking_mode=task.thinking_mode
        )

    def execute(
        self,
        task: AgentTask,
        quality_criteria: List[str]
    ) -> AgentResult:
        """
        Execute with iterative refinement until quality threshold met.
        """
        logger.info(f"Starting evaluator-optimizer loop for task: {task.task_id}")

        iteration = 0
        current_task = task

        while iteration < task.max_iterations:
            iteration += 1
            logger.info(f"Iteration {iteration}/{task.max_iterations}")

            # Generate
            result = self.generator.execute(current_task)

            # Evaluate
            evaluation = self.evaluate(result.output, quality_criteria)

            if evaluation["score"] >= self.quality_threshold:
                logger.info(f"Quality threshold met: {evaluation['score']}")
                result.metadata["evaluation"] = evaluation
                result.metadata["iterations_to_quality"] = iteration
                return result

            # Refine and retry
            logger.info(f"Quality below threshold: {evaluation['score']}, refining...")
            current_task = self.refine(current_task, evaluation)

        # Max iterations reached
        logger.warning("Max iterations reached without meeting quality threshold")
        result.metadata["evaluation"] = evaluation
        result.metadata["quality_threshold_met"] = False

        return result


# Example Tools Following ACI Best Practices

def create_file_search_tool() -> Tool:
    """Create a well-designed file search tool"""

    def search_files(
        pattern: str,
        file_types: List[str] = None,
        max_results: int = 20
    ) -> Dict[str, Any]:
        """Search for files matching pattern"""
        logger.info(f"Searching for pattern: {pattern}")

        # Mock implementation
        return {
            "matches": [
                {"file": "src/main.py", "line": 42, "content": "def main():"},
                {"file": "src/utils.py", "line": 15, "content": "def helper():"}
            ],
            "total_matches": 2,
            "search_time_ms": 45
        }

    return Tool(
        name="search_files",
        description=(
            "Search for code patterns across the repository. "
            "Returns file paths, line numbers, and matching content. "
            "Supports regex patterns."
        ),
        parameters={
            "pattern": {
                "type": "string",
                "description": (
                    "Regex pattern to search for. "
                    "Example: 'async\\s+def\\s+\\w+' for async functions"
                ),
                "required": True
            },
            "file_types": {
                "type": "array",
                "description": (
                    "File extensions to search. "
                    "Example: ['py', 'js']. Default: all files"
                ),
                "items": {"type": "string"},
                "default": ["*"]
            },
            "max_results": {
                "type": "integer",
                "description": "Maximum results to return (1-100)",
                "default": 20,
                "minimum": 1,
                "maximum": 100
            }
        },
        function=search_files
    )


def create_code_execution_tool() -> Tool:
    """Create a safe code execution tool"""

    def execute_code(
        code: str,
        language: str = "python",
        timeout_seconds: int = 30
    ) -> Dict[str, Any]:
        """Execute code in a sandboxed environment"""
        logger.info(f"Executing {language} code (timeout: {timeout_seconds}s)")

        # Mock implementation with safety checks
        return {
            "success": True,
            "stdout": "Hello, World!",
            "stderr": "",
            "exit_code": 0,
            "execution_time_ms": 125
        }

    return Tool(
        name="execute_code",
        description=(
            "Execute code in a sandboxed environment. "
            "Supports Python, JavaScript, and TypeScript. "
            "Returns stdout, stderr, and exit code."
        ),
        parameters={
            "code": {
                "type": "string",
                "description": "The code to execute",
                "required": True
            },
            "language": {
                "type": "string",
                "description": "Programming language (python, javascript, typescript)",
                "enum": ["python", "javascript", "typescript"],
                "default": "python"
            },
            "timeout_seconds": {
                "type": "integer",
                "description": "Maximum execution time in seconds",
                "default": 30,
                "minimum": 1,
                "maximum": 300
            }
        },
        function=execute_code,
        requires_approval=True  # Require human approval for code execution
    )


# Example Usage and Patterns

def example_research_plan_implement_workflow():
    """
    Demonstrates the recommended Research-Plan-Implement workflow
    for coding tasks.
    """
    print("\n=== Research-Plan-Implement Workflow ===\n")

    # Create orchestrator with specialized workers
    orchestrator = OrchestratorAgent(
        model="claude-sonnet-4-5",
        system_prompt="You are an expert software architect and developer."
    )

    # Add specialized workers
    orchestrator.add_worker("analyzer", ClaudeAgent(
        model="claude-sonnet-4-5",
        system_prompt="You are an expert at analyzing requirements and codebases."
    ))

    orchestrator.add_worker("designer", ClaudeAgent(
        model="claude-sonnet-4-5",
        system_prompt="You are an expert at designing software architecture."
    ))

    orchestrator.add_worker("coder", ClaudeAgent(
        model="claude-haiku-4-5",  # Use cheaper model for straightforward coding
        system_prompt="You are an expert programmer focused on clean, tested code."
    ))

    orchestrator.add_worker("tester", ClaudeAgent(
        model="claude-sonnet-4-5",
        system_prompt="You are an expert at writing comprehensive tests."
    ))

    # Add tools
    orchestrator.add_tool(create_file_search_tool())
    orchestrator.add_tool(create_code_execution_tool())

    # Create task
    task = AgentTask(
        task_id="implement_user_auth",
        description=(
            "Implement user authentication system with JWT tokens. "
            "Requirements: login, logout, token refresh, password hashing. "
            "Use bcrypt for hashing and industry best practices for security."
        ),
        thinking_mode=ThinkingMode.HARD,
        require_verification=True
    )

    # Execute
    result = orchestrator.execute(task)

    print(f"Task ID: {result.task_id}")
    print(f"Success: {result.success}")
    print(f"Output:\n{result.output}")
    print(f"\nTokens used: {result.tokens_used}")
    print(f"Cost estimate: ${result.cost_estimate:.4f}")
    print(f"Metadata: {json.dumps(result.metadata, indent=2)}")


def example_evaluator_optimizer_pattern():
    """
    Demonstrates the Evaluator-Optimizer pattern for quality-critical code.
    """
    print("\n=== Evaluator-Optimizer Pattern ===\n")

    generator = ClaudeAgent(
        model="claude-sonnet-4-5",
        system_prompt="You are an expert programmer."
    )

    evaluator = ClaudeAgent(
        model="claude-sonnet-4-5",
        system_prompt=(
            "You are a senior code reviewer. "
            "Evaluate code for security, performance, maintainability, and best practices."
        )
    )

    optimizer = EvaluatorOptimizer(
        generator=generator,
        evaluator=evaluator,
        quality_threshold=0.85
    )

    task = AgentTask(
        task_id="optimize_database_query",
        description=(
            "Write a SQL query to find all users who logged in "
            "within the last 30 days and have made at least 5 purchases. "
            "Optimize for performance with proper indexing."
        ),
        max_iterations=3
    )

    quality_criteria = [
        "Query is optimized with appropriate indexes",
        "Handles edge cases (null values, timezone issues)",
        "Includes explanatory comments",
        "Follows SQL best practices",
        "Performance considerations documented"
    ]

    result = optimizer.execute(task, quality_criteria)

    print(f"Task ID: {result.task_id}")
    print(f"Success: {result.success}")
    print(f"Quality score: {result.metadata.get('evaluation', {}).get('score', 'N/A')}")
    print(f"Iterations to quality: {result.metadata.get('iterations_to_quality', 'N/A')}")


def example_test_driven_development():
    """
    Demonstrates TDD workflow with Claude.
    """
    print("\n=== Test-Driven Development ===\n")

    # Create two separate agents for isolation
    test_writer = ClaudeAgent(
        model="claude-sonnet-4-5",
        system_prompt=(
            "You are an expert at writing comprehensive test cases. "
            "Write tests BEFORE seeing implementation. "
            "Cover edge cases, error conditions, and expected behavior."
        )
    )

    implementer = ClaudeAgent(
        model="claude-sonnet-4-5",
        system_prompt=(
            "You are an expert programmer. "
            "Implement code to pass the given tests. "
            "Follow best practices and write clean, maintainable code."
        )
    )

    # Step 1: Write tests first
    test_task = AgentTask(
        task_id="write_tests_user_validation",
        description=(
            "Write pytest tests for a user validation function. "
            "Function should validate email format, password strength (min 8 chars, "
            "1 uppercase, 1 number, 1 special char), and username length (3-20 chars). "
            "Test edge cases like empty strings, SQL injection attempts, and unicode."
        )
    )

    test_result = test_writer.execute(test_task)
    print("Step 1: Tests written")
    print(f"Test code preview: {test_result.output[:200]}...\n")

    # Step 2: Implement to pass tests
    impl_task = AgentTask(
        task_id="implement_user_validation",
        description=(
            f"Implement the user validation function to pass these tests:\n\n"
            f"{test_result.output}\n\n"
            "Use clear validation logic and helpful error messages."
        )
    )

    impl_result = implementer.execute(impl_task)
    print("Step 2: Implementation complete")
    print(f"Implementation preview: {impl_result.output[:200]}...\n")

    print(f"Total cost: ${test_result.cost_estimate + impl_result.cost_estimate:.4f}")


if __name__ == "__main__":
    print("=" * 60)
    print("Claude Coding Agent - Best Practices Implementation")
    print("=" * 60)

    # Run examples
    example_research_plan_implement_workflow()
    print("\n" + "=" * 60 + "\n")

    example_evaluator_optimizer_pattern()
    print("\n" + "=" * 60 + "\n")

    example_test_driven_development()
    print("\n" + "=" * 60 + "\n")

    print("All examples completed!")
    print("\nNote: This is a demonstration with mock API calls.")
    print("In production, integrate with the Anthropic API using your API key.")
