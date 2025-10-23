// Calculate attendance
function calculate() {
  const absent = parseInt(document.getElementById('absent').value) || 0;
  const oaa = parseInt(document.getElementById('oaa').value) || 0;
  const lecture = parseInt(document.getElementById('lecture').value) || 0;
  const resultDisplay = document.getElementById('resultDisplay');

  if (lecture === 0) {
    resultDisplay.innerHTML = `
      <div class="result-content">
        <div class="result-message" style="color: #d63031;">
          ⚠️ Please enter the total number of lectures conducted.
        </div>
      </div>`;
    resultDisplay.classList.add('show');
    return;
  }

  if (absent > lecture) {
    resultDisplay.innerHTML = `
      <div class="result-content">
        <div class="result-message" style="color: #d63031;">
          ❌ Absents cannot be more than total lectures!
        </div>
      </div>`;
    resultDisplay.classList.add('show');
    return;
  }

  const attended = lecture - absent + oaa;
  const totalClasses = lecture + oaa;
  const attendancePercent = (attended / totalClasses) * 100;

  let statusClass = 'good';
  let statusMessage = '🎉 Excellent! You meet the requirement!';
  let statusIcon = '✅';

  if (attendancePercent < 90) {
    statusClass = 'danger';
    statusMessage = '⚠️ Below 90% — Fine applicable & risk of detention!';
    statusIcon = '🚨';
  } else if (attendancePercent < 95) {
    statusClass = 'warning';
    statusMessage = '⚡ Safe but close to the 90% limit.';
    statusIcon = '⚠️';
  }

  // ✅ New Feature: Safe Leave Counter
  const safeLeaves = Math.floor((attended / 0.9) - totalClasses);
  let safeLeaveInfo = '';
  if (safeLeaves > 0) {
    safeLeaveInfo = `
      <div style="margin-top: 1.2rem; padding: 1rem; background: rgba(0, 184, 148, 0.1); border-radius: 12px; color: #00b894; font-weight: 600;">
        🌿 You can take <strong>${safeLeaves}</strong> more ${safeLeaves === 1 ? 'leave' : 'leaves'} safely and still maintain 90% attendance.
      </div>
    `;
  } else if (attendancePercent >= 90 && safeLeaves <= 0) {
    safeLeaveInfo = `
      <div style="margin-top: 1.2rem; padding: 1rem; background: rgba(255, 195, 0, 0.1); border-radius: 12px; color: #ff6b35; font-weight: 600;">
        ⚠️ You are exactly at the 90% mark — avoid taking more leaves!
      </div>
    `;
  }

  // Fine and classes needed (existing logic)
  let fineInfo = '';
  let additionalInfo = '';

  if (attendancePercent < 90) {
    const percentageBelow = 90 - attendancePercent;
    const fineAmount = Math.ceil(percentageBelow);
    const totalFine = fineAmount * 400;
    const classesNeeded = Math.ceil((0.9 * totalClasses - attended) / 0.1);

    fineInfo = `
      <div class="fine-section">
        <div class="fine-header">
          <div class="fine-icon">💸</div>
          <div class="fine-title">Fine Breakdown</div>
        </div>
        <div class="fine-breakdown">
          <div class="fine-item">
            <span>Percentage Below 90%:</span>
            <span style="color: #d63031; font-weight: 800;">${percentageBelow.toFixed(2)}%</span>
          </div>
          <div class="fine-item">
            <span>Fine Rate:</span>
            <span style="color: #d63031; font-weight: 800;">₹400 per 1%</span>
          </div>
          <div class="fine-item">
            <span>Fine Units:</span>
            <span style="color: #d63031; font-weight: 800;">${fineAmount}</span>
          </div>
        </div>
        <div class="fine-total">
          Total Fine: ₹${totalFine.toLocaleString('en-IN')}
        </div>
      </div>`;

    additionalInfo = `
      <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid rgba(255, 107, 53, 0.3);">
        <div style="color: #d63031; font-weight: 700; margin-bottom: 1rem; font-size: 1.1rem;">
          🔴 You are ${percentageBelow.toFixed(2)}% below the required 90%
        </div>
        <div style="margin-bottom: 0.8rem; font-size: 1.05rem;">
          📚 <strong>Classes Needed:</strong> <span style="color: #ff6b35; font-weight: 800;">${classesNeeded}</span> consecutive classes to reach 90%
        </div>
      </div>`;
  }

  resultDisplay.innerHTML = `
    <div class="result-content">
      <div class="attendance-percent ${statusClass}">
        ${statusIcon} ${attendancePercent.toFixed(2)}%
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min(attendancePercent, 100)}%"></div>
      </div>
      <div class="result-message" style="margin-top: 1rem;">
        ${statusMessage}
      </div>
      <div class="result-details">
        <strong>📊 Breakdown:</strong><br>
        Attended: <strong>${attended}</strong> | Total: <strong>${totalClasses}</strong> | Absents: <strong>${absent}</strong> | OAA: <strong>${oaa}</strong>
        ${fineInfo}
        ${safeLeaveInfo}
        ${additionalInfo}
      </div>
    </div>
  `;
  resultDisplay.classList.add('show');
}
