const SECTIONS = [
  { id: "overview", label: "Platform Overview" },
  { id: "data-flow", label: "Understanding the Data Flow" },
  { id: "capabilities", label: "Platform Capabilities" },
  { id: "getting-started", label: "Getting Started" },
  { id: "core-functions", label: "Core Functions" },
  { id: "data-management", label: "Data Management" },
  { id: "collaboration", label: "Collaboration Features" },
  { id: "reporting", label: "Reporting and Analytics" },
  { id: "admin", label: "Project Administration" },
  { id: "best-practices", label: "Best Practices" },
  { id: "support", label: "Support Resources" },
];

function StepNumber({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white text-sm font-bold shrink-0">
      {n}
    </span>
  );
}

function VideoEmbed({ src, title }: { src: string; title: string }) {
  return (
    <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
      <iframe
        src={src}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

export default function TutorialsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white">OECS MERL Tutorial</h1>
          <p className="mt-2 text-purple-100 text-lg">
            Learn how to work with the platform through guided steps and videos.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Tutorial Outline
            </p>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block px-3 py-1.5 text-sm text-gray-600 rounded-md hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-16">
          {/* Platform Overview */}
          <section id="overview" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h2>
            <VideoEmbed
              src="https://www.youtube.com/embed/wlW79U2m1Ys"
              title="Introduction to the OECS MERL"
            />
            <p className="text-gray-600 leading-relaxed mt-4">
              The OECS MERL Platform is an EMIS for OECS PEARL. It streamlines data collection, validation, analysis, and reporting.
            </p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Flexible design adaptable to Member State needs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Education-focused and results-oriented (PEARL Results Framework)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Collaboration between Member States and OECS
              </li>
            </ul>
          </section>

          {/* Data Flow */}
          <section id="data-flow" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Understanding the Data Flow</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <StepNumber n={1} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Data Collection by Member States</h4>
                  <p className="text-sm text-gray-600 mt-1">National/local data gathering with multiple stakeholders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <StepNumber n={2} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Data Input into Platform</h4>
                  <p className="text-sm text-gray-600 mt-1">Direct entry with real-time updates and validation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <StepNumber n={3} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Data Aggregation by OECS EDMU</h4>
                  <p className="text-sm text-gray-600 mt-1">Aggregation, organization, and QA/validation within the platform</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <StepNumber n={4} />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Report Generation</h4>
                  <p className="text-sm text-gray-600 mt-1">Evidence-based reporting and sharing with Member States, OECS, partners</p>
                </div>
              </div>
            </div>
          </section>

          {/* Capabilities */}
          <section id="capabilities" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Capabilities</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Direct data input with real-time forms
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Built-in data validation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Reports with indicator-level and disaggregated views
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Excel data export for deeper analysis
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Multi-device access (laptops/desktops/tablets)
              </li>
            </ul>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <StepNumber n={1} />
                <p className="text-sm text-gray-600">Obtain login credentials and confirm permissions</p>
              </div>
              <div className="flex items-start gap-3">
                <StepNumber n={2} />
                <p className="text-sm text-gray-600">Sign in to the MERL URL with your username and password</p>
              </div>
              <div className="flex items-start gap-3">
                <StepNumber n={3} />
                <p className="text-sm text-gray-600">Review the dashboard and the OECS PEARL project</p>
              </div>
            </div>
          </section>

          {/* Core Functions */}
          <section id="core-functions" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Functions</h2>

            <h3 className="text-base font-medium text-gray-800 mb-3">Accessing Your Project</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <StepNumber n={1} />
                <p className="text-sm text-gray-600">Click the project title (e.g., &quot;OECS PEARL Results Framework&quot;)</p>
              </div>
              <div className="flex items-start gap-3">
                <StepNumber n={2} />
                <p className="text-sm text-gray-600">Review indicators and year/quarter controls</p>
              </div>
            </div>

            <h3 className="text-base font-medium text-gray-800 mb-3">Basic Operations</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Save frequently: Save or Save Draft
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Export Data: download Excel from top-right
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Notes: capture context and methods
              </li>
            </ul>
          </section>

          {/* Data Management */}
          <section id="data-management" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>

            <h3 className="text-base font-medium text-gray-800 mb-3">Working with MERL (Videos)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <VideoEmbed
                src="https://www.youtube.com/embed/KjcvTd_iy-E"
                title="Inputting data 1"
              />
              <VideoEmbed
                src="https://www.youtube.com/embed/qE0p7x1hod0"
                title="Inputting data 2"
              />
              <VideoEmbed
                src="https://www.youtube.com/embed/XkzNrceg3nk"
                title="Inputting data 3"
              />
            </div>

            <h3 className="text-base font-medium text-gray-800 mb-3">Data Types</h3>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>Baseline:</strong> pre-project state</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>Target:</strong> planned goals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>Reporting:</strong> actual progress during implementation</span>
              </li>
            </ul>

            <h3 className="text-base font-medium text-gray-800 mb-3">Step-by-Step</h3>

            <h4 className="text-sm font-semibold text-gray-700 mb-2">Baseline</h4>
            <ol className="space-y-1 text-sm text-gray-600 mb-4 list-decimal list-inside">
              <li>Projects &rarr; &#8943; &rarr; Edit Baseline</li>
              <li>Use the performance results framework to copy values</li>
              <li>Enter values (type or arrows), Tab to navigate</li>
              <li>Save Draft often; complete all fields for final Save</li>
              <li>Add Notes for context; visible to collaborators</li>
            </ol>

            <h4 className="text-sm font-semibold text-gray-700 mb-2">Targets</h4>
            <ol className="space-y-1 text-sm text-gray-600 mb-4 list-decimal list-inside">
              <li>Projects &rarr; &#8943; &rarr; Edit Targets</li>
              <li>Use the orange target column in the framework</li>
              <li>Same input and save flow as baseline</li>
            </ol>

            <h4 className="text-sm font-semibold text-gray-700 mb-2">Reporting</h4>
            <ol className="space-y-1 text-sm text-gray-600 list-decimal list-inside">
              <li>Click project name to open reporting form</li>
              <li>Choose correct year and quarter</li>
              <li>Unlock a question &rarr; input values &rarr; select Means of Verification &rarr; lock again</li>
              <li>Save Draft/Save; Export if needed; add Notes</li>
            </ol>
          </section>

          {/* Collaboration */}
          <section id="collaboration" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Collaboration Features</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Lock per-question to prevent conflicts; unlocking saves
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Communicate who edits what; keep sessions short
              </li>
            </ul>
          </section>

          {/* Reporting and Analytics */}
          <section id="reporting" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reporting and Analytics</h2>

            <h3 className="text-base font-medium text-gray-800 mb-3">Reporting Video</h3>
            <VideoEmbed
              src="https://www.youtube.com/embed/Jze203TU2b0"
              title="Reporting"
            />

            <h3 className="text-base font-medium text-gray-800 mt-6 mb-3">Excel Export</h3>
            <ol className="space-y-1 text-sm text-gray-600 mb-6 list-decimal list-inside">
              <li>Projects page &rarr; &#8943; &rarr; Export Data &rarr; Excel downloads automatically</li>
              <li>Project page &rarr; Export Data (top-right)</li>
            </ol>

            <h3 className="text-base font-medium text-gray-800 mb-3">Data Dashboard</h3>
            <VideoEmbed
              src="https://www.youtube.com/embed/OXCIbOgKemQ"
              title="Viewing Data Reports"
            />
            <ol className="space-y-1 text-sm text-gray-600 mt-4 list-decimal list-inside">
              <li>Projects &rarr; &#8943; &rarr; View Dashboard</li>
              <li>Use filters (Year, Quarter, Country, OECS; plus additional disaggregations when available)</li>
              <li>Interpret visuals: Targets (light purple) vs Reporting (dark purple), trend lines, hover tooltips</li>
            </ol>
          </section>

          {/* Project Administration */}
          <section id="admin" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Administration</h2>
            <ol className="space-y-1 text-sm text-gray-600 list-decimal list-inside">
              <li>Project page &rarr; Edit Project</li>
              <li>Update donor, budget, dates, reporting period, fiscal year</li>
              <li>Save changes; maintain accurate records and audit trails</li>
            </ol>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Best Practices</h2>

            <h3 className="text-base font-medium text-gray-800 mb-3">Data Quality</h3>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>Before:</strong> verify sources, understand indicator definitions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>During:</strong> double-check entries, consistent units, notes, frequent saves</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>After:</strong> review via dashboard, export for QA checks</span>
              </li>
            </ul>

            <h3 className="text-base font-medium text-gray-800 mb-3">Collaboration & Efficiency</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Bookmark URL; use keyboard shortcuts; avoid conflicting tabs
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                Define roles/schedules; document decisions; report issues quickly
              </li>
            </ul>
          </section>

          {/* Support Resources */}
          <section id="support" className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Support Resources</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>Training:</strong> Intro, Baseline/Target, Reporting, Dashboard, Excel Export</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>Docs:</strong> user manuals, technical specs, troubleshooting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">&#8226;</span>
                <span><strong>Help:</strong> contact your system admin; request training; engage with peers</span>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
