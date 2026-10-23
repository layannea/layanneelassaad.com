export type Figure = {
  src: string;
  alt: string;
  caption?: string;
  label?: string;
  kind?: "image" | "video";
  wide?: boolean;
};

export type Section = {
  heading: string;
  body: string[];
  figure?: Figure;
  after?: string[];
  note?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  lead: string;
  tag: string;
  stack: string[];
  featured: boolean;
  github?: string;
  site?: string;
  paper?: string;
  role?: string;
  collaborators?: string;
  pull?: string;
  pullAfter?: number;
  sections: Section[];
};

export const projects: Project[] = [
  {
    slug: "scout",
    title: "Scout",
    summary:
      "Scout is a macOS platform for running and managing AI agents locally. Agents run in a sandbox, act only through permissions the user grants, and share a local knowledge graph of the user's files and email. All user data stays on device.",
    lead:
      "A macOS platform for installing, running and managing AI agents locally.",
    tag: "Agent infrastructure",
    stack: ["Swift", "Python", "FastAPI", "NetworkX", "FAISS"],
    featured: true,
    github: "https://github.com/layannea/scout-app",
    site: "https://scout.store",
    pull:
      "An agent never acts on the system directly. Scout performs each action only under a permission the user has granted.",
    sections: [
      {
        heading: "Problem",
        body: [
          "Agents that work with private files have two common deployment models.",
          "- Hosted agents require uploading that data to a third party.\n- Self-hosted agents require the user to write connectors, configure permissions and trust each agent with broad access to the system.",
          "Local models have made hosted inference optional, but most of the integration and permission problems are still unsolved. I cofounded Scout so that users can download, run and manage permissions for agents in one local platform.",
        ],
      },
      {
        heading: "Permissioned execution",
        body: [
          "Scout is a native macOS app with an embedded Python backend. Agents are distributed through the **Agent Store**, an app store for agents where every listing declares the permissions it requires.",
          "An agent runs in a sandbox and cannot touch the file system or network itself. It sends each action it wants to perform to Scout, and Scout carries it out only if the user has granted the matching permission.",
        ],
        figure: {
          src: "/projects/scout-demo-web.mp4",
          alt: "Scout demo",
          label: "Demo",
          kind: "video",
        },
      },
      {
        heading: "Knowledge graph",
        body: [
          "Every agent needs context about the user's files and the applications it works with. When each agent maintains its own connector and index, the same data is parsed many times, every agent sees a different slice of it, and the user manages access agent by agent.",
          "I built **Scout's local knowledge graph** over the folders and mailboxes the user approves, and every agent on the platform reads from it. Documents and emails are embedded for semantic search, and a language model extracts the entities they mention and the relations between them into a linked graph. As a result, an agent can follow connections across files, email and applications without a connector of its own.",
          "Scout's first two agents are built on this graph: a **Search Agent** that retrieves files and facts from the indexed data in response to natural-language queries, and a **Report Generator** that compiles a report on a given topic from the user's email and documents.",
        ],
      },
      {
        heading: "SDK",
        body: [
          "Agents do not get direct access to the graph. Through **Scout's SDK**, a developer describes what the agent needs in a YAML query language, and Scout compiles the query, checks the agent's permissions and runs it. A single query can combine graph relationships, metadata filters and semantic search, which covers most of what an agent needs to know about a user's data.",
          "The result is that developers build agents without writing connectors or running a backend, and users see and control what every agent can access from one place.",
        ],
      },
    ],
  },

  {
    slug: "esmfold-h100",
    title: "Profiling ESMFold",
    summary:
      "ESMFold predicts protein structure from a single sequence, but its forward pass grows quadratically with sequence length. This project profiles it on an H100 to find which stages dominate on long proteins and how much graph compilation recovers.",
    lead:
      "A kernel-level profile of ESMFold inference on an H100.",
    tag: "Inference performance",
    stack: ["PyTorch", "torch.compile", "CUDA", "Weights and Biases"],
    featured: true,
    github: "https://github.com/layannea/ESMFoldHPML",
    paper: "/papers/esmfold-h100.pdf",
    sections: [
      {
        heading: "Problem",
        body: [
          "ESMFold predicts a protein's 3D structure from a single amino acid sequence. It replaces the evolutionary database search that AlphaFold relies on with a protein language model. That makes structure prediction cheap enough to run across whole proteomes.",
          "The cost of the alignment is replaced by a cost inside the model. To keep its predictions geometrically consistent, ESMFold maintains a **pairwise representation** of every residue pair and updates it with triangular attention and triangular multiplication, so memory and compute grow quadratically with sequence length.",
          "I wanted to measure which of the model's stages pays that cost as proteins get longer, and whether standard inference optimizations reduce it.",
        ],
      },
      {
        heading: "Profiling",
        body: [
          "I profiled the forward pass on an H100 across the 33 CASP14 targets (74 to 922 residues) and attributed every kernel to one of five stages (input embedding, bias and MLP, triangular multiplication, triangular attention, structure module). The chart shows how runtime splits between those stages for each target, ordered by sequence length.",
        ],
        figure: {
          src: "/figures/esmfold-runtime-breakdown.png",
          wide: true,
          alt: "Stacked share of forward-pass runtime by stage for each CASP14 protein, sorted by sequence length",
        },
        after: [
          "The GPU and the CPU were limited by different stages:",
          "- On the GPU, **triangular attention** takes over as proteins get longer, from about a third of runtime on short sequences to 70% near 1,000 residues. That is the quadratic term appearing exactly where the architecture predicts it.\n- On the CPU, time went to **triangular multiplication**. This stage updates each residue pair from its neighboring pairs through thousands of small elementwise kernels per pass, whereas attention runs as a single fused flash-attention kernel.",
          "Short proteins are therefore bound by kernel launch overhead on the CPU, and long proteins by attention compute on the GPU.",
        ],
      },
      {
        heading: "Compiling the model",
        body: [
          "Graph compilation fuses sequences of small kernels into one, which targets the launch overhead that limits short proteins. The effect varied widely between targets:",
          "- On several short targets it cut the forward pass by about 40%.\n- On others the compiled model was slower than the original, by up to 57%.",
          "The traces explained the slowdowns. The folding trunk updates the pairwise representation over several recycling passes and loops over a Python dictionary on each one. The compiler cannot trace that loop, so the graph breaks at that point, control returns to the Python interpreter, and the kernels on either side run unfused. Repeated on every recycling pass, that overhead exceeds what fusion saves, and the compiled model ends up slower than the uncompiled one.",
          "Long proteins barely changed either way, because almost all of their runtime is a single attention kernel that fusion cannot improve. **Microbatching** the folding trunk in 128-residue chunks did help them. It reduced peak memory enough for a 900-residue protein to fit on a single GPU.",
        ],
      },
      {
        heading: "Takeaway",
        body: [
          "The profile points to three changes, at three different levels:",
          "- **Serving:** bucket sequences by length, so that short proteins share a batch and amortize their launch overhead while long proteins run alone.\n- **Kernels:** on long proteins the time is inside one attention kernel doing arithmetic, so running the triangular blocks in lower precision (FP8 on H100) is the most direct way to speed them up, provided structure quality holds.\n- **Model:** the pairwise representation gives ESMFold its accuracy, and it is also the reason the targets that matter most in drug discovery (long multi-domain proteins and protein complexes) are the most expensive to predict.",
          "ESMFold has already moved one of AlphaFold's components, the evolutionary search, out of inference and into pretraining. Geometric consistency is the other, and it is still computed at inference time for every residue pair on every pass. In a drug discovery screen that cost recurs for every target, whereas anything learned in training is paid for once.",
          "Geometric consistency could plausibly make the same transition, in one of two ways. Through the loss, by training on distances and angles until the embeddings themselves encode a consistent geometry that a small decoder can turn into coordinates. Or through the vocabulary, by representing local structure as tokens the language model predicts alongside amino acids, so that consistency is learned like grammar: which structural tokens can follow one another. Either way, pairwise computation would be needed only to refine the hardest long-range contacts. The cost of structure prediction would stop growing with the square of protein length, and long targets would become routine at proteome scale.",
        ],
      },
    ],
  },

  {
    slug: "escaper",
    title: "ESCAPER",
    summary:
      "LLM agents in a team have no principled way to decide how much to trust each other, so one unreliable agent's misinformation spreads through shared context. ESCAPER is an escape-room environment for studying trust calibration under partial observability, where agent teams solve rooms together while a hidden malicious teammate feeds them misinformation.",
    lead:
      "An escape-room platform for studying trust calibration in LLM agent teams.",
    tag: "Multi-agent systems",
    stack: ["Python", "LLM agents", "Jinja"],
    featured: true,
    github: "https://github.com/layannea/ESCAPER",
    paper: "/papers/escaper.pdf",
    sections: [
      {
        heading: "Problem",
        body: [
          "Multi-agent LLM systems typically operate under partial observability. Each agent observes a subset of the state and relies on natural-language reports from its teammates for the rest, so the team's shared context is only as reliable as its least reliable member. Without trust calibration, agents weight every report equally. A wrong or adversarial claim cascades through shared memory, wasting actions and producing wrong decisions.",
          "Prior work mostly handles this with a global trust parameter or a reputation score shared by the whole team. A shared score spreads one agent's early misjudgment to everyone, and in both cases trust is never tied to the specific action a message caused.",
          "ESCAPER tests whether **fully decentralized private reputation**, where each agent independently tracks its teammates' reliability from outcomes it has verified, improves robustness against a hidden malicious teammate, and whether private **gossip** between agents speeds up identifying and avoiding that teammate.",
        ],
      },
      {
        heading: "The platform",
        body: [
          "I built ESCAPER, a text-based escape-room simulator for LLM teams. A room is a JSON file of objects, clues and coded doors. Agents inspect objects privately, share what they find in a team chat, and try codes on locks.",
          "At each step an agent's prompt is assembled from two views:",
          "- A **public view**, identical for all agents: the room state and the team chat.\n- A **private view**, unique to each agent: its own inspections, its reputation table and any private messages it has received.",
          "Since every claim can be checked against a tool call, the platform produces auditable logs that tie each message to the actions and outcomes it led to. The run viewer below shows one episode from agent B's side.",
        ],
        figure: {
          src: "/figures/escaper-room.jpg",
          alt: "The run viewer: room map with agent positions, team chat with a private gossip message, and agent B's private view with inspections, reputation table and failed codes",
        },
      },
      {
        heading: "Experiment",
        body: [
          "Each team has four personas. The cooperative team is Alice, Bob, Charlie and Daniela. In adversarial conditions, Malerie takes Daniela's place and sabotages the team with hints that look credible but are wrong*. She might post a door code with one digit changed, or agree with a teammate's partial clue when it does not actually match.",
          "I ran four ablations on three rooms of increasing difficulty, with 10 seeds each:",
          "- A cooperative baseline with no adversary.\n- Malerie present, with no trust mechanism.\n- Malerie present, with **private reputation**: each agent lowers a teammate's score only when that teammate's claim is contradicted by the agent's own inspection or leads to a failed action.\n- Private reputation plus **gossip**, a one-to-one private channel for sharing evidence.",
        ],
        note: "* Two versions of Malerie were used. When Malerie was always wrong, she accumulated contradictions quickly and was ignored within a few steps. When she mixed true statements with false ones, her score stayed high for much longer, because every correct claim offset the evidence against her.",
      },
      {
        heading: "Results",
        body: [
          "In the hard room, Malerie nearly tripled the steps to escape, from 6.7 to 18.9. The failure pattern was always the same, with Malerie posting a wrong code, teammates trying it, and the chat filling with discussion of why it failed instead of returning to exploration.",
          "The chart below compares mean steps to escape across the four ablations.",
        ],
        figure: {
          src: "/figures/escaper-results.svg",
          wide: true,
          alt: "Mean steps to escape in the hard room across four conditions",
        },
        after: [
          "- **Private reputation** brought steps back to 12.2 and cut wrong attempts from 3.8 to 2.8. The agents' behavior changed as well. Instead of acting on a claim immediately, they re-inspected the object or asked where the code came from, and once Malerie's reputation score fell her messages rarely impacted the team's next action.\n- **Gossip** pushed Malerie's final reputation from 0.62 to 0.40 while her teammates stayed near 1.0. Without gossip, an agent only lowered her score after one of her claims failed on them directly. With gossip, an agent who had caught a contradiction could warn another privately, and the second agent discounted her without wasting an attempt. The cost was coordination. Agents sometimes spent steps on private exchanges instead of sharing their clues publicly, which delayed the moment when the team put the clues together and tried the door.",
        ],
      },
      {
        heading: "Takeaway",
        body: [
          "In these experiments, private reputation was enough to separate a hidden malicious teammate from cooperative ones, with no shared trust state. Each agent reached that conclusion from its own verified outcomes, and the public chat gave the agents enough common evidence to reach it independently. Gossip speeds that up by passing evidence privately, but it can pull agents away from the public coordination the task needs, so there is a tradeoff between isolating the adversary quickly and converging efficiently on the solution.",
          "The rooms in this study were simple enough that a failed action almost always meant a false claim. In harder rooms, where agents can misread a clue or draw a wrong inference in good faith, scoring personas on outcomes would misattribute blame. The next step is credit assignment per claim, tracking which message led to which action and outcome.",
          "Beyond this experiment, ESCAPER is a reusable testbed for multi-agent research. Rooms and personas are plain JSON and every run is replayable. With enough curated rooms, it can serve as a benchmark for comparing LLMs on social reasoning and collaboration.",
        ],
      },
    ],
  },

  {
    slug: "pipeline-parallelism",
    title: "Pipeline parallelism schedules",
    summary:
      "A benchmark of the three main pipeline parallelism schedules, GPipe, 1F1B and interleaved 1F1B, across model shapes and process counts. It measures throughput, scaling efficiency and activation memory for each, and shows where one schedule overtakes another.",
    lead:
      "A benchmark of GPipe, 1F1B and interleaved 1F1B pipeline schedules.",
    tag: "Distributed training",
    stack: ["PyTorch", "torch.distributed", "torchrun", "Docker"],
    featured: true,
    github: "https://github.com/layannea/pipeline-parallelism",
    sections: [
      {
        heading: "Background",
        body: [
          "Pipeline parallelism splits a model's layers into $K$ sequential stages, assigns each stage to its own process, and streams microbatches through them, so that a model whose parameters and activations exceed a single device's memory can still be trained. The cost is the **pipeline bubble**. At the start of every batch, downstream stages sit idle until the first microbatch reaches them, and at the end, upstream stages sit idle until the last gradients come back. These two phases are the pipeline fill and drain, and together they cost on the order of $K$ ticks per batch. The schedule decides how much of that time is recovered and at what cost in memory and communication.",
          "The three standard schedules make different trades:",
          "- **GPipe** runs all $M$ forward passes, then all $M$ backward passes. The bubble shrinks relative to useful work as $M$ grows, but every stage must keep the activations of all $M$ microbatches until their backward passes arrive, so activation memory grows with $M$.\n- **1F1B** alternates one forward and one backward pass after a short warm-up. Backward passes start before all forward passes have finished, which removes the long idle gap between the two phases. A stage never holds more than $K$ microbatches of activations, so memory is bounded by pipeline depth rather than by $M$.\n- **Interleaved 1F1B** splits each stage into $v$ smaller virtual stages. Fill and drain shorten by roughly a factor of $v$, in exchange for $v$ times more hand-offs between processes.",
          "The diagram below shows the first two on four stages and four microbatches. The bubble is the same size in both; what differs is how long activations stay resident.",
        ],
        figure: {
          src: "/figures/pipeline-schedules.svg",
          wide: true,
          alt: "GPipe and 1F1B schedules for four stages and four microbatches, with idle time hatched",
        },
      },
      {
        heading: "Benchmark",
        body: [
          "I built a runner on PyTorch's pipelining API that sweeps schedule, model depth and width, process count, microbatch count and interleaving factor, records tokens per second for each configuration, and plots speedup over GPipe and scaling efficiency.",
          "The runs use **CPU processes with the gloo backend**. Without GPU kernels or NCCL involved, the measurement isolates the schedules' own overheads, and it puts them in a setting where communication is expensive relative to compute, so their differences are easy to see. The chart below reports throughput for each schedule on a 4-layer transformer at two widths (4 and 8 attention heads) and at two and four processes.",
        ],
        figure: {
          src: "/figures/pipeline-throughput.svg",
          wide: true,
          alt: "Throughput in tokens per second for GPipe, 1F1B and interleaved 1F1B on two model shapes at two and four processes",
        },
        after: [
          "- On the narrower model at two processes, 1F1B reached 1.20x GPipe's throughput and interleaving reached 1.13x. Stages are cheap, so removing the **middle bubble** pays off and the extra coordination costs little.\n- On the wider model at two processes the order flipped: interleaving edged ahead at 1.03x and 1F1B fell slightly below GPipe. With more compute per stage, **fill and drain** become a larger share of each step, and interleaving is the schedule that shortens them.\n- At four processes all three schedules finished within a few percent of each other, and scaling efficiency dropped from 50 to 60% to about 25%. **Synchronization overhead** from barriers, context switches and tensor hand-offs grew faster than useful work per stage. GPipe makes the fewest of them, so it was competitive or best.",
        ],
      },
      {
        heading: "Takeaway",
        body: [
          "Which schedule is fastest depends on the **ratio of compute per stage to communication cost**. Overlapping schedules recover idle time but add synchronization, and when communication dominates, as it does on CPU at four processes, the added synchronization costs more than the bubble it removes. On GPUs the ratio is reversed. NCCL makes communication cheap and each stage carries far more compute, so the overlapping schedules come out ahead in most configurations. That is the setting they were designed for.",
          "The memory result does not depend on hardware. 1F1B's activation footprint is **set by pipeline depth**, not by the number of microbatches in flight, so a deep pipeline can run enough microbatches to hide its bubble without running out of memory. This is why 1F1B is the standard schedule in large-scale training frameworks, whatever throughput margin it shows on a particular machine.",
        ],
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
