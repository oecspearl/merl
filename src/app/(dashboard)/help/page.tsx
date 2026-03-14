import { Collapsible } from "@/components/ui/collapsible";

const SECTIONS = [
  { id: "getting-started", label: "Getting Started" },
  { id: "projects-reporting", label: "Projects and Reporting" },
  { id: "data-entry-locks", label: "Data Entry and Locks" },
  { id: "charts-dashboards", label: "Charts and Dashboards" },
  { id: "notes-collaboration", label: "Notes and Collaboration" },
  { id: "exporting-reports", label: "Exporting Reports" },
  { id: "administration", label: "Administration" },
  { id: "faq", label: "FAQ" },
];

const FAQ_ITEMS = [
  {
    question: "How do I reset my password?",
    answer:
      "Click the 'Forgot Password' link on the login page. You will receive an email with instructions to reset your password.",
  },
  {
    question: "Who can create projects?",
    answer:
      "Only Super Administrators can create new projects. Regular users can view and contribute to projects they have been assigned to.",
  },
  {
    question: "How do data locks work?",
    answer:
      "Data locks prevent further edits to submitted data for a specific question, year, and quarter. Once a lock is applied, the data becomes read-only. Only Super Administrators can remove locks.",
  },
  {
    question: "Can I export data for a single component?",
    answer:
      "The export feature generates a report for the entire project. You can filter the exported data using your preferred spreadsheet application after downloading.",
  },
  {
    question: "What file format is the export?",
    answer:
      "Reports are exported as CSV files, which can be opened in Microsoft Excel, Google Sheets, or any other spreadsheet application.",
  },
  {
    question: "How are charts generated?",
    answer:
      "Charts are automatically generated from submitted performance indicator data. Use the dashboard filters to narrow down the data displayed by year, quarter, or country.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Help Center</h1>
          <p className="mt-2 text-purple-100 text-lg">
            Everything you need to know about using the OECS MERL Reporting
            platform.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              On this page
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
        <main className="flex-1 min-w-0 space-y-12">
          {/* Getting Started */}
          <section id="getting-started">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Getting Started
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to the OECS MERL Reporting platform. This system helps you
              track and report on project performance indicators across multiple
              countries and reporting periods.
            </p>
            <p className="text-gray-600 leading-relaxed">
              To begin, log in with the credentials provided by your
              administrator. Once logged in, you will see your project dashboard
              showing all projects you have access to.
            </p>
          </section>

          {/* Projects and Reporting */}
          <section id="projects-reporting">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Projects and Reporting
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Each project is organized into components, and each component
              contains questions with performance indicators. Projects can be
              configured for yearly or quarterly reporting periods.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Components</strong> represent major areas of a project.
              </li>
              <li>
                <strong>Questions</strong> define what data needs to be
                collected.
              </li>
              <li>
                <strong>Baselines</strong> establish starting values for
                comparison.
              </li>
              <li>
                <strong>Targets</strong> set expected outcomes per year.
              </li>
              <li>
                <strong>Performance Indicators</strong> capture actual reported
                values.
              </li>
            </ul>
          </section>

          {/* Data Entry and Locks */}
          <section id="data-entry-locks">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Data Entry and Locks
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Data can be entered as drafts and later submitted. Once submitted,
              a lock can be applied to prevent further changes. Locks ensure data
              integrity for finalized reports.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Draft entries are indicated with a yellow badge, while submitted
              entries show a green badge. Locked entries display a lock icon and
              cannot be edited until the lock is removed by an administrator.
            </p>
          </section>

          {/* Charts and Dashboards */}
          <section id="charts-dashboards">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Charts and Dashboards
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The project dashboard provides visual representations of your
              performance indicator data through bar charts. Use the filter
              controls to focus on specific years, quarters, or countries.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Charts are organized by component, matching the structure of your
              project. Each question with submitted data will display a chart
              showing values across reporting periods.
            </p>
          </section>

          {/* Notes and Collaboration */}
          <section id="notes-collaboration">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notes and Collaboration
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Use the notes panel to communicate with team members about a
              project. Notes are visible to all users with access to the
              project.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Click the Notes button on any project page to open the side panel.
              You can view existing notes and add new ones. Each note shows the
              author and date for reference.
            </p>
          </section>

          {/* Exporting Reports */}
          <section id="exporting-reports">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Exporting Reports
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Export project data as CSV files for offline analysis or sharing.
              The export includes all baselines, targets, and performance
              indicators organized by component and question.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Navigate to a project and click the Export button to generate and
              download your report.
            </p>
          </section>

          {/* Administration */}
          <section id="administration">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Administration
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Super Administrators have access to additional features including
              user management, project creation, and bulk user imports via CSV.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Create and manage projects, components, and questions.</li>
              <li>Import users in bulk using CSV files.</li>
              <li>Manage data locks across all projects.</li>
              <li>Assign countries and regions to projects.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, index) => (
                <Collapsible
                  key={index}
                  title={item.question}
                  defaultOpen={false}
                >
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </Collapsible>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
