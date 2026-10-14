export const questions = {
  behavioral: [
    {
      text: "Tell me about a time you had a conflict with a teammate. How did you resolve it?",
      difficulty: "medium",
      tags: ["teamwork", "conflict-resolution"],
      keywords: ["situation", "task", "action", "result", "communication", "compromise", "listen", "perspective", "resolution", "collaboration"]
    },
    {
      text: "Describe a project where you had to learn a new technology quickly. How did you approach it?",
      difficulty: "medium",
      tags: ["learning", "adaptability"],
      keywords: ["situation", "task", "action", "result", "research", "documentation", "practice", "mentor", "deadline", "delivery"]
    },
    {
      text: "Tell me about a time you made a significant mistake. What did you do?",
      difficulty: "hard",
      tags: ["ownership", "growth"],
      keywords: ["situation", "task", "action", "result", "ownership", "accountability", "fix", "postmortem", "prevent", "learned"]
    },
    {
      text: "Describe a time you had to influence a decision without direct authority.",
      difficulty: "hard",
      tags: ["influence", "leadership"],
      keywords: ["situation", "task", "action", "result", "data", "stakeholders", "persuasion", "consensus", "evidence", "outcome"]
    },
    {
      text: "Tell me about a time you disagreed with your manager. How did you handle it?",
      difficulty: "medium",
      tags: ["communication", "disagreement"],
      keywords: ["situation", "task", "action", "result", "respectful", "data", "perspective", "compromise", "alignment", "relationship"]
    },
    {
      text: "Describe a situation where you had to deliver bad news to a stakeholder.",
      difficulty: "medium",
      tags: ["communication", "stakeholder-management"],
      keywords: ["situation", "task", "action", "result", "transparency", "empathy", "plan", "mitigation", "follow-up", "trust"]
    },
    {
      text: "Tell me about a time you improved a process or system.",
      difficulty: "easy",
      tags: ["initiative", "optimization"],
      keywords: ["situation", "task", "action", "result", "identify", "analyze", "implement", "measure", "automation", "efficiency"]
    },
    {
      text: "Describe a time you worked with a difficult stakeholder.",
      difficulty: "medium",
      tags: ["stakeholder-management", "communication"],
      keywords: ["situation", "task", "action", "result", "listen", "empathy", "boundaries", "expectations", "delivery", "relationship"]
    },
    {
      text: "Tell me about a time you had to make a decision with incomplete information.",
      difficulty: "hard",
      tags: ["decision-making", "ambiguity"],
      keywords: ["situation", "task", "action", "result", "assumptions", "risk", "mitigation", "iterate", "feedback", "outcome"]
    },
    {
      text: "Describe a time you mentored or helped a junior team member grow.",
      difficulty: "easy",
      tags: ["mentorship", "team-growth"],
      keywords: ["situation", "task", "action", "result", "guidance", "feedback", "growth", "autonomy", "confidence", "promotion"]
    },
    {
      text: "Tell me about a project that failed. What did you learn?",
      difficulty: "hard",
      tags: ["failure", "learning"],
      keywords: ["situation", "task", "action", "result", "root-cause", "retrospective", "process", "culture", "improvement", "resilience"]
    },
    {
      text: "Describe a time you had to balance multiple competing priorities.",
      difficulty: "medium",
      tags: ["prioritization", "time-management"],
      keywords: ["situation", "task", "action", "result", "prioritize", "stakeholders", "trade-offs", "communicate", "delivery", "balance"]
    },
    {
      text: "Tell me about a time you received critical feedback. How did you respond?",
      difficulty: "easy",
      tags: ["feedback", "growth"],
      keywords: ["situation", "task", "action", "result", "listen", "reflect", "improve", "follow-up", "growth", "gratitude"]
    },
    {
      text: "Describe a time you advocated for a user or customer need.",
      difficulty: "medium",
      tags: ["customer-obsession", "advocacy"],
      keywords: ["situation", "task", "action", "result", "research", "data", "advocacy", "prioritization", "impact", "satisfaction"]
    }
  ],

  "system-design": [
    {
      text: "Design a URL shortener like bit.ly. Handle scale, analytics, and custom aliases.",
      difficulty: "medium",
      tags: ["scalability", "database", "caching"],
      keywords: ["hash", "base62", "database", "cache", "redis", "analytics", "clicks", "expiration", "custom", "sharding"]
    },
    {
      text: "Design a rate limiter for an API. Support different algorithms and distributed systems.",
      difficulty: "hard",
      tags: ["rate-limiting", "distributed-systems"],
      keywords: ["token-bucket", "sliding-window", "redis", "lua", "distributed", "consistency", "latency", "algorithms", "burst", "quota"]
    },
    {
      text: "Design a notification system supporting push, email, SMS with delivery guarantees.",
      difficulty: "hard",
      tags: ["messaging", "reliability"],
      keywords: ["queue", "kafka", "retry", "dead-letter", "idempotency", "deduplication", "preferences", "batch", "priority", "monitoring"]
    },
    {
      text: "Design a distributed cache with consistency and eviction policies.",
      difficulty: "hard",
      tags: ["caching", "distributed-systems"],
      keywords: ["consistent-hashing", "replication", "lru", "lfu", "ttl", "invalidation", "write-through", "write-back", "cluster", "failover"]
    },
    {
      text: "Design a chat application like WhatsApp with real-time messaging.",
      difficulty: "medium",
      tags: ["websockets", "real-time"],
      keywords: ["websocket", "presence", "message-order", "delivery-receipt", "encryption", "groups", "offline", "sync", "push", "scaling"]
    },
    {
      text: "Design a search autocomplete system for millions of queries.",
      difficulty: "medium",
      tags: ["search", "trie", "ranking"],
      keywords: ["trie", "prefix", "ranking", "frequency", "redis", "cache", "ml", "personalization", "latency", "fuzzy"]
    },
    {
      text: "Design a file storage system like Google Drive with versioning and sharing.",
      difficulty: "hard",
      tags: ["storage", "versioning", "permissions"],
      keywords: ["chunking", "deduplication", "versioning", "permissions", "acl", "metadata", "cdn", "sync", "conflict", "encryption"]
    },
    {
      text: "Design a content delivery network (CDN) for global video streaming.",
      difficulty: "hard",
      tags: ["cdn", "video", "edge"],
      keywords: ["edge", "cache", "origin", "manifest", "hls", "dash", "adaptive", "bitrate", "purge", "analytics"]
    },
    {
      text: "Design a distributed job scheduler like Airflow or cron at scale.",
      difficulty: "medium",
      tags: ["scheduling", "workflow"],
      keywords: ["dag", "dependency", "retry", "backfill", "sla", "monitoring", "idempotency", "parallelism", "queue", "deadlock"]
    },
    {
      text: "Design a feature flag system for gradual rollouts and A/B testing.",
      difficulty: "medium",
      tags: ["feature-flags", "ab-testing"],
      keywords: ["targeting", "percentage", "rollout", "experiment", "analytics", "kill-switch", "latency", "consistency", "audit", "segmentation"]
    },
    {
      text: "Design a logging and observability platform for microservices.",
      difficulty: "hard",
      tags: ["observability", "logging", "tracing"],
      keywords: ["structured-logging", "correlation-id", "distributed-tracing", "metrics", "alerting", "sampling", "retention", "query", "visualization", "cost"]
    },
    {
      text: "Design a real-time collaborative editor like Google Docs.",
      difficulty: "hard",
      tags: ["crdt", "operational-transform", "real-time"],
      keywords: ["crdt", "operational-transform", "conflict-resolution", "offline", "sync", "presence", "cursor", "history", "permissions", "scale"]
    }
  ],

  coding: [
    {
      text: "Given an array of integers, find two numbers that add up to a target. Return indices.",
      difficulty: "easy",
      tags: ["array", "hash-map", "two-pointers"],
      keywords: ["hash-map", "complement", "indices", "o-n", "space", "two-pass", "one-pass", "constraints", "duplicates", "sorted"]
    },
    {
      text: "Merge k sorted linked lists into one sorted list.",
      difficulty: "hard",
      tags: ["linked-list", "heap", "divide-conquer"],
      keywords: ["min-heap", "priority-queue", "divide-conquer", "merge-two", "o-nlogk", "dummy-head", "pointers", "null-check", "complexity", "space"]
    },
    {
      text: "Find the longest substring without repeating characters.",
      difficulty: "medium",
      tags: ["string", "sliding-window", "hash-set"],
      keywords: ["sliding-window", "hash-set", "two-pointers", "max-length", "start-end", "o-n", "ascii", "unicode", "edge-cases", "empty"]
    },
    {
      text: "Implement LRU Cache with O(1) get and put operations.",
      difficulty: "hard",
      tags: ["design", "hash-map", "doubly-linked-list"],
      keywords: ["hash-map", "doubly-linked-list", "head-tail", "move-to-front", "evict", "capacity", "get", "put", "o-1", "dummy-nodes"]
    },
    {
      text: "Given a binary tree, find the maximum path sum.",
      difficulty: "hard",
      tags: ["tree", "dfs", "recursion"],
      keywords: ["dfs", "post-order", "max-gain", "global-max", "negative", "path", "node", "left-right", "recursion", "base-case"]
    },
    {
      text: "Find the median of two sorted arrays in O(log(min(m,n))) time.",
      difficulty: "hard",
      tags: ["binary-search", "array", "median"],
      keywords: ["binary-search", "partition", "left-max", "right-min", "odd-even", "log-time", "edge-cases", "empty", "boundaries", "comparison"]
    },
    {
      text: "Implement a Trie (Prefix Tree) with insert, search, and startsWith.",
      difficulty: "medium",
      tags: ["trie", "tree", "prefix"],
      keywords: ["trie-node", "children", "end-of-word", "insert", "search", "prefix", "array-map", "26", "traversal", "autocomplete"]
    },
    {
      text: "Given a matrix, set entire row and column to 0 if an element is 0. Do it in place.",
      difficulty: "medium",
      tags: ["matrix", "in-place", "space-optimization"],
      keywords: ["first-row", "first-col", "markers", "o-1-space", "two-pass", "flags", "edges", "overwrite", "scan", "restore"]
    },
    {
      text: "Find all valid combinations of k numbers that sum to n (1-9, each used once).",
      difficulty: "medium",
      tags: ["backtracking", "combination", "recursion"],
      keywords: ["backtracking", "combination", "sum", "start", "pruning", "base-case", "path", "result", "duplicate", "constraints"]
    },
    {
      text: "Design a stack that supports push, pop, top, and retrieving minimum in O(1).",
      difficulty: "medium",
      tags: ["stack", "design", "auxiliary"],
      keywords: ["min-stack", "auxiliary-stack", "push-pop", "top", "get-min", "o-1", "duplicate-mins", "sync", "space", "trade-off"]
    },
    {
      text: "Given a string, find the length of the longest valid parentheses substring.",
      difficulty: "hard",
      tags: ["string", "stack", "dp"],
      keywords: ["stack", "dp", "index", "valid-length", "push-pop", "base", "max", "scan", "open-close", "reset"]
    },
    {
      text: "Implement pow(x, n) efficiently handling negative exponents.",
      difficulty: "medium",
      tags: ["math", "binary-exponentiation", "recursion"],
      keywords: ["fast-power", "binary-exponentiation", "recursive", "iterative", "negative", "overflow", "long", "bitwise", "log-n", "base-case"]
    },
    {
      text: "Find the kth largest element in an unsorted array.",
      difficulty: "medium",
      tags: ["heap", "quickselect", "selection"],
      keywords: ["min-heap", "size-k", "quickselect", "partition", "pivot", "average-o-n", "worst-o-n2", "randomized", "nth-element", "sorting"]
    },
    {
      text: "Given intervals, merge all overlapping intervals.",
      difficulty: "medium",
      tags: ["interval", "sorting", "greedy"],
      keywords: ["sort", "start-time", "overlap", "merge", "max-end", "result", "push", "compare", "edge-cases", "empty"]
    },
    {
      text: "Design a data structure that supports insert, delete, getRandom in O(1).",
      difficulty: "hard",
      tags: ["design", "hash-map", "array", "random"],
      keywords: ["hash-map", "array", "swap-delete", "index", "getRandom", "o-1", "duplicate", "last-element", "update-map", "uniform"]
    },
    {
      text: "Find the shortest path in a weighted graph (Dijkstra's algorithm).",
      difficulty: "hard",
      tags: ["graph", "dijkstra", "priority-queue"],
      keywords: ["priority-queue", "distance", "visited", "relaxation", "neighbors", "min-heap", "o-elogv", "negative-weights", "path-reconstruction", "adjacency-list"]
    }
  ],

  leadership: [
    {
      text: "How do you handle a team member who is consistently underperforming?",
      difficulty: "medium",
      tags: ["performance-management", "coaching"],
      keywords: ["feedback", "pip", "coaching", "root-cause", "support", "documentation", "hr", "timeline", "improvement", "decision"]
    },
    {
      text: "Describe how you prioritize technical debt vs new features.",
      difficulty: "hard",
      tags: ["technical-debt", "prioritization", "strategy"],
      keywords: ["business-impact", "risk", "interest", "roadmap", "allocation", "stakeholders", "metrics", "refactor", "velocity", "balance"]
    },
    {
      text: "How do you make decisions when stakeholders disagree on priority?",
      difficulty: "hard",
      tags: ["decision-making", "stakeholder-management"],
      keywords: ["data", "framework", "rtc", "disagree-commit", "escalation", "trade-offs", "alignment", "communication", "documentation", "outcome"]
    },
    {
      text: "Tell me about a time you had to deliver a project with unrealistic deadlines.",
      difficulty: "medium",
      tags: ["scope-management", "negotiation"],
      keywords: ["scope", "negotiation", "mvp", "phased", "risk", "communication", "stakeholders", "quality", "burnout", "delivery"]
    },
    {
      text: "How do you build psychological safety in your team?",
      difficulty: "medium",
      tags: ["culture", "psychological-safety", "team-building"],
      keywords: ["vulnerability", "blameless", "retrospective", "inclusion", "voice", "mistakes", "learning", "trust", "feedback", "celebration"]
    },
    {
      text: "Describe your approach to hiring and building diverse teams.",
      difficulty: "medium",
      tags: ["hiring", "diversity", "team-building"],
      keywords: ["structured", "rubric", "bias", "pipeline", "inclusive", "panel", "bar-raiser", "calibration", "onboarding", "retention"]
    },
    {
      text: "How do you handle a situation where your team disagrees with your technical decision?",
      difficulty: "hard",
      tags: ["technical-leadership", "disagreement", "consensus"],
      keywords: ["listen", "data", "discussion", "disagree-commit", "experiment", "reversible", "authority", "trust", "outcome", "learning"]
    },
    {
      text: "Tell me about a time you had to let someone go. How did you handle it?",
      difficulty: "hard",
      tags: ["termination", "empathy", "process"],
      keywords: ["documentation", "pip", "hr", "compassion", "clarity", "transition", "team", "morale", "legal", "respect"]
    },
    {
      text: "How do you measure and improve engineering productivity?",
      difficulty: "hard",
      tags: ["metrics", "productivity", "developer-experience"],
      keywords: ["dora", "lead-time", "deployment-frequency", "mttr", "change-failure", "flow", "surveys", "toil", "automation", "investment"]
    },
    {
      text: "Describe how you handle technical strategy for a multi-year roadmap.",
      difficulty: "hard",
      tags: ["strategy", "roadmap", "architecture"],
      keywords: ["vision", "principles", "trade-offs", "investment", "platform", "leverage", "alignment", "review", "adaptation", "communication"]
    }
  ],

  domain: [
    {
      text: "Explain the Critical Rendering Path and how to optimize it.",
      difficulty: "medium",
      tags: ["frontend", "performance", "browser"],
      keywords: ["dom", "cssom", "render-tree", "layout", "paint", "blocking", "critical-css", "async", "defer", "preload"]
    },
    {
      text: "How does React's reconciliation algorithm (Fiber) work?",
      difficulty: "hard",
      tags: ["react", "fiber", "reconciliation"],
      keywords: ["fiber", "work-loop", "priorities", "lanes", "suspense", "concurrent", "commit", "phase", "bailout", "memo"]
    },
    {
      text: "Design a RESTful API for a complex resource with nested relationships.",
      difficulty: "medium",
      tags: ["api-design", "rest", "backend"],
      keywords: ["resource", "nested", "query-params", "pagination", "filtering", "sorting", "versioning", "hateoas", "errors", "rate-limiting"]
    },
    {
      text: "Explain database indexing strategies and when to use each type.",
      difficulty: "medium",
      tags: ["database", "indexing", "performance"],
      keywords: ["b-tree", "hash", "gin", "gist", "partial", "composite", "covering", "selectivity", "write-cost", "query-plan"]
    },
    {
      text: "How would you design a CI/CD pipeline for microservices with monorepo?",
      difficulty: "hard",
      tags: ["ci-cd", "microservices", "monorepo", "devops"],
      keywords: ["pipeline", "monorepo", "affected", "nx", "turborepo", "caching", "parallel", "deploy", "rollback", "canary"]
    },
    {
      text: "Explain the CAP theorem and how it applies to distributed databases.",
      difficulty: "medium",
      tags: ["distributed-systems", "cap", "database"],
      keywords: ["consistency", "availability", "partition-tolerance", "cp", "ap", "eventual", "strong", "quorum", "raft", "paxos"]
    },
    {
      text: "Design a GraphQL schema for a social media feed with real-time updates.",
      difficulty: "hard",
      tags: ["graphql", "schema", "subscriptions", "real-time"],
      keywords: ["type", "query", "mutation", "subscription", "fragment", "dataloader", "n+1", "pagination", "cursor", "auth"]
    },
    {
      text: "How do you handle authentication and authorization in a microservices architecture?",
      difficulty: "hard",
      tags: ["auth", "microservices", "security", "oauth"],
      keywords: ["jwt", "oauth2", "oidc", "gateway", "service-mesh", "rbac", "abac", "token-exchange", "revocation", "audit"]
    },
    {
      text: "Explain how you would implement feature flags for a mobile app with offline support.",
      difficulty: "medium",
      tags: ["feature-flags", "mobile", "offline"],
      keywords: ["local-storage", "sync", "background", "cache", "rollout", "kill-switch", "targeting", "analytics", "conflict", "versioning"]
    },
    {
      text: "Design a system for processing 1TB of daily logs with sub-second query latency.",
      difficulty: "hard",
      tags: ["big-data", "logs", "analytics", "clickhouse"],
      keywords: ["columnar", "compression", "partitioning", "sharding", "materialized-views", "sampling", "retention", "tiered-storage", "query-engine", "cost"]
    },
    {
      text: "How do you optimize Webpack bundle size for a large React application?",
      difficulty: "medium",
      tags: ["webpack", "bundling", "performance", "frontend"],
      keywords: ["code-splitting", "tree-shaking", "dynamic-import", "chunk-split", "compression", "analysis", "vendor", "cache", "preload", "module-federation"]
    },
    {
      text: "Explain Kubernetes resources: Deployment, Service, Ingress, ConfigMap, Secret.",
      difficulty: "easy",
      tags: ["kubernetes", "devops", "container-orchestration"],
      keywords: ["deployment", "replicaset", "pod", "service", "clusterip", "nodeport", "loadbalancer", "ingress", "configmap", "secret"]
    },
    {
      text: "Design a real-time fraud detection system for payment processing.",
      difficulty: "hard",
      tags: ["ml", "fraud", "real-time", "streaming"],
      keywords: ["stream-processing", "flink", "kafka", "features", "model", "inference", "latency", "false-positive", "rules", "feedback-loop"]
    },
    {
      text: "How do you implement end-to-end encryption in a messaging app?",
      difficulty: "hard",
      tags: ["security", "encryption", "e2e", "signal-protocol"],
      keywords: ["signal-protocol", "double-ratchet", "x3dh", "prekeys", "identity", "session", "forward-secrecy", "post-compromise", "verification", "key-management"]
    },
    {
      text: "Explain the differences between SQL and NoSQL and when to choose each.",
      difficulty: "easy",
      tags: ["database", "sql", "nosql", "architecture"],
      keywords: ["acid", "base", "schema", "flexible", "joins", "transactions", "scaling", "horizontal", "vertical", "consistency", "use-cases"]
    }
  ]
};

export const categories = Object.keys(questions).map(key => ({
  id: key,
  name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
  count: questions[key].length
}));