const fs = require('fs');
const file = 'src/pages/OperationsPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldTabsAndContent = `        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1 mb-6 inline-flex flex-wrap max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={\`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 flex-grow sm:flex-grow-0 justify-center \${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }\`}
              >
                <Icon className={\`w-4 h-4 \${isActive ? 'text-blue-600' : 'text-slate-400'}\`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[500px]">
          {renderContent()}
        </div>`;

const newUnifiedLayout = `        {/* Unified Operations Dashboard Layout */}
        <div className="space-y-8 mt-8">
          
          <FadeIn>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <EmergencyPriority />
              <WeatherForecast />
            </div>
          </FadeIn>

          <FadeIn>
            <DistrictRiskTable />
          </FadeIn>

          <FadeIn>
            <RoadStatusBoard />
          </FadeIn>

          <FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
              <div className="flex flex-col gap-4 overflow-hidden h-full">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 shrink-0">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Incoming Field Reports (Live)
                  </h3>
                  <p className="text-sm text-slate-600">Review and verify incident reports submitted by citizens and field officers across the NER region.</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <ReportReviewQueue reports={reportsQueue} setReports={setReportsQueue} />
                </div>
              </div>
              <div className="flex flex-col h-full overflow-hidden">
                <FieldReportForm onSubmit={handleAddReport} />
              </div>
            </div>
          </FadeIn>
        </div>`;

content = content.replace(oldTabsAndContent, newUnifiedLayout);
fs.writeFileSync(file, content);
