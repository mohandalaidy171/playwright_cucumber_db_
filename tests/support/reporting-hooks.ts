import { After, Before, Status } from '@cucumber/cucumber';
import * as fs from 'fs';
import * as path from 'path';

const testResults: any[] = [];

Before(function() {
    this.scenarioInfo = {
        name: this.pickle.name,
        startTime: new Date(),
        tags: this.pickle.tags.map((tag: any) => tag.name),
        steps: []
    };
});

After(async function(scenario) {
    const endTime = new Date();
    const duration = endTime.getTime() - this.scenarioInfo.startTime.getTime();
    
    const result = {
        ...this.scenarioInfo,
        endTime,
        duration: duration / 1000, // Convert to seconds
        status: scenario.result?.status || Status.UNDEFINED,
        error: scenario.result?.message
    };
    
    testResults.push(result);
    generateDetailedReport();
});

function generateDetailedReport() {
    const reportDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }
    
    const totalScenarios = testResults.length;
    const passed = testResults.filter(r => r.status === Status.PASSED).length;
    const failed = testResults.filter(r => r.status === Status.FAILED).length;
    const skipped = testResults.filter(r => r.status === Status.SKIPPED).length;
    
    const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cucumber Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 2rem; text-align: center; border-radius: 10px; margin-bottom: 2rem; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .summary-card { background: white; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .summary-card.passed { border-left: 4px solid #27ae60; }
        .summary-card.failed { border-left: 4px solid #e74c3c; }
        .summary-card.skipped { border-left: 4px solid #f39c12; }
        .summary-card.total { border-left: 4px solid #3498db; }
        .count { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
        .scenarios { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .scenario { border: 1px solid #ddd; margin: 1rem 0; padding: 1rem; border-radius: 6px; }
        .scenario.passed { background: #d5f4e6; border-color: #27ae60; }
        .scenario.failed { background: #fadbd8; border-color: #e74c3c; }
        .scenario.skipped { background: #fdebd0; border-color: #f39c12; }
        .scenario-header { display: flex; justify-content: between; align-items: center; margin-bottom: 0.5rem; }
        .scenario-name { font-weight: bold; font-size: 1.1rem; }
        .scenario-status { padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; color: white; }
        .status-passed { background: #27ae60; }
        .status-failed { background: #e74c3c; }
        .status-skipped { background: #f39c12; }
        .scenario-duration { color: #666; font-size: 0.9rem; }
        .scenario-tags { margin: 0.5rem 0; }
        .tag { display: inline-block; background: #3498db; color: white; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; margin-right: 0.3rem; }
        .error { background: #e74c3c; color: white; padding: 1rem; border-radius: 6px; margin-top: 0.5rem; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🪒 Cucumber Test Report</h1>
            <p>Automated Test Execution Summary</p>
        </div>
        
        <div class="summary">
            <div class="summary-card total">
                <div class="count">${totalScenarios}</div>
                <div>Total Scenarios</div>
            </div>
            <div class="summary-card passed">
                <div class="count">${passed}</div>
                <div>Passed</div>
            </div>
            <div class="summary-card failed">
                <div class="count">${failed}</div>
                <div>Failed</div>
            </div>
            <div class="summary-card skipped">
                <div class="count">${skipped}</div>
                <div>Skipped</div>
            </div>
        </div>
        
        <div class="scenarios">
            <h2>Test Scenarios</h2>
            ${testResults.map(result => `
                <div class="scenario ${result.status === 'PASSED' ? 'passed' : result.status === 'FAILED' ? 'failed' : 'skipped'}">
                    <div class="scenario-header">
                        <div class="scenario-name">${result.name}</div>
                        <div class="scenario-status status-${result.status === 'PASSED' ? 'passed' : result.status === 'FAILED' ? 'failed' : 'skipped'}">
                            ${result.status}
                        </div>
                    </div>
                    <div class="scenario-duration">
                        ⏱️ Duration: ${result.duration.toFixed(2)}s
                    </div>
                    <div class="scenario-tags">
                        ${result.tags.map((tag: string) => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ${result.error ? `<div class="error">${result.error}</div>` : ''}
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(reportDir, 'detailed-report.html'), htmlReport);
    console.log('📊 Detailed HTML report generated: reports/detailed-report.html');
}