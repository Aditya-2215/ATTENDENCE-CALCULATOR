// Generate floating particles with enhanced animation
const bgAnimation = document.getElementById('bgAnimation');
for (let i = 0; i < 20; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.animationDelay = Math.random() * 15 + 's';
  particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
  particle.style.width = (Math.random() * 6 + 4) + 'px';
  particle.style.height = particle.style.width;
  bgAnimation.appendChild(particle);
}

// Navbar scroll effect with smooth transition
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  const currentScroll = window.scrollY;
  
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Input validation and formatting
function validateInput(input) {
  const value = parseInt(input.value);
  if (value < 0 || isNaN(value)) {
    input.value = 0;
  }
  return parseInt(input.value) || 0;
}

// Enhanced calculate function with your college's formula
function calculate() {
  const absentInput = document.getElementById('absent');
  const oaaInput = document.getElementById('oaa');
  const lectureInput = document.getElementById('lecture');
  const resultDisplay = document.getElementById('resultDisplay');

  // Validate and get values
  const absent = validateInput(absentInput);
  const oaa = validateInput(oaaInput);
  const lecture = validateInput(lectureInput);

  // Initial validation
  if (lecture === 0) {
    showError(resultDisplay, '⚠️ Please enter the total number of lectures conducted.');
    return;
  }

  if (absent > lecture) {
    showError(resultDisplay, '❌ Absents cannot be more than total lectures!');
    return;
  }

  if (oaa > lecture) {
    showError(resultDisplay, '⚠️ OAA credits cannot exceed total lectures!');
    return;
  }

  // Calculate attendance using college formula: 100 - (((Total Absent - Total OAA) / Total Lecture) * 100)
  const effectiveAbsent = absent - oaa;
  const attendancePercent = 100 - ((effectiveAbsent / lecture) * 100);

  // Cap attendance at 100%
  const finalAttendance = Math.min(Math.max(attendancePercent, 0), 100);

  // Determine status and message
  const statusData = getStatusData(finalAttendance);

  // Calculate reward information
  const rewardInfo = calculateReward(finalAttendance);

  // Calculate fine and remedial information
  const fineData = calculateFine(finalAttendance, absent, oaa, lecture);

  // Calculate skip allowance
  const skipData = calculateSkipAllowance(finalAttendance, absent, oaa, lecture);

  // Generate attendance insights
  const insights = generateInsights(finalAttendance, absent, oaa, lecture);

  // Display results with animation
  displayResults(resultDisplay, {
    attendance: finalAttendance,
    status: statusData,
    reward: rewardInfo,
    fine: fineData,
    skip: skipData,
    insights: insights,
    breakdown: { lecture, absent, oaa, effectiveAbsent }
  });
}

// Show error message
function showError(resultDisplay, message) {
  resultDisplay.innerHTML = `
    <div class="result-content" style="animation: shake 0.5s;">
      <div class="result-message" style="color: #d63031; font-size: 1.1rem; padding: 1.5rem;">
        ${message}
      </div>
    </div>
  `;
  resultDisplay.classList.add('show');
}

// Get status data based on attendance
function getStatusData(attendance) {
  if (attendance >= 99) {
    return {
      class: 'good',
      icon: '🌟',
      message: '🏆 Outstanding! Platinum Achievement - You\'re a star student!',
      color: '#00b894'
    };
  } else if (attendance >= 97) {
    return {
      class: 'good',
      icon: '⭐',
      message: '⭐ Excellent! Gold Achievement - Keep up the great work!',
      color: '#00b894'
    };
  } else if (attendance >= 95) {
    return {
      class: 'good',
      icon: '✅',
      message: '✨ Great! You\'re well above the requirement!',
      color: '#00b894'
    };
  } else if (attendance >= 90) {
    return {
      class: 'warning',
      icon: '⚠️',
      message: '⚡ Safe, but close to the limit. Be careful!',
      color: '#fdcb6e'
    };
  } else {
    return {
      class: 'danger',
      icon: '🚨',
      message: '⚠️ Critical: Below 90% - Fine applicable & CT/Pre-University detention risk!',
      color: '#d63031'
    };
  }
}

// Calculate reward tiers
function calculateReward(attendance) {
  if (attendance >= 99) {
    return {
      amount: 5000,
      tier: 'Platinum',
      icon: '🏆',
      color: '#9b59b6',
      range: '99% - 100%',
      nextTier: null
    };
  } else if (attendance >= 97) {
    const gap = 99 - attendance;
    return {
      amount: 3000,
      tier: 'Gold',
      icon: '⭐',
      color: '#f39c12',
      range: '97% - 98.9%',
      nextTier: {
        name: 'Platinum',
        amount: 5000,
        gap: gap.toFixed(2)
      }
    };
  }
  return null;
}

// Calculate fine details
function calculateFine(attendance, absent, oaa, lecture) {
  if (attendance >= 90) return null;

  const percentageBelow = 90 - attendance;
  const fineAmount = Math.ceil(percentageBelow);
  const totalFine = fineAmount * 400;

  // Calculate classes needed to reach 90%
  // Formula: 90 = 100 - (((absent - oaa) / lecture) * 100)
  // Rearranged: We need to attend X more classes
  // New total lectures = lecture + X
  // New absents stays same, so: 90 = 100 - (((absent - oaa) / (lecture + X)) * 100)
  // Solving: X = ((absent - oaa) / 0.10) - lecture
  const classesNeeded = Math.max(0, Math.ceil(((absent - oaa) / 0.10) - lecture));

  return {
    percentageBelow: percentageBelow.toFixed(2),
    fineUnits: fineAmount,
    totalFine: totalFine,
    classesNeeded: classesNeeded
  };
}

// Calculate how many classes can be skipped
function calculateSkipAllowance(attendance, absent, oaa, lecture) {
  if (attendance < 90) return null;

  // Formula: How many more absents allowed to stay at 90%?
  // 90 = 100 - (((absent + X - oaa) / lecture) * 100)
  // Solving for X: X = oaa - absent + (lecture * 0.10)
  const maxAbsentsAllowed = Math.floor(lecture * 0.10) + oaa;
  const classesCanSkip = Math.max(0, maxAbsentsAllowed - absent);

  if (classesCanSkip > 0) {
    const futureAbsent = absent + classesCanSkip;
    const futureAttendance = 100 - (((futureAbsent - oaa) / lecture) * 100);

    return {
      canSkip: classesCanSkip,
      futureAttendance: futureAttendance.toFixed(2),
      maxAbsentsAllowed: maxAbsentsAllowed
    };
  }

  return { canSkip: 0 };
}

// Generate insights and tips
function generateInsights(attendance, absent, oaa, lecture) {
  const insights = [];

  // Attendance trend insight
  if (attendance >= 95) {
    insights.push({
      icon: '🎯',
      text: 'Excellent attendance record! You\'re setting a great example.',
      type: 'positive'
    });
  }

  // OAA utilization
  if (oaa > 0) {
    insights.push({
      icon: '🎖️',
      text: `You've earned ${oaa} OAA credit${oaa > 1 ? 's' : ''} - great participation in extra activities!`,
      type: 'positive'
    });
  }

  // Absent count
  if (absent > lecture * 0.15) {
    insights.push({
      icon: '📉',
      text: 'You have significant absents. Try to improve attendance to avoid penalties.',
      type: 'warning'
    });
  }

  // Critical zone warning
  if (attendance < 92 && attendance >= 90) {
    insights.push({
      icon: '⚡',
      text: 'You\'re in the buffer zone. Missing even one class could be risky!',
      type: 'warning'
    });
  }

  return insights;
}

// Display results with enhanced UI
function displayResults(resultDisplay, data) {
  const { attendance, status, reward, fine, skip, insights, breakdown } = data;

  let rewardHTML = '';
  if (reward) {
    const nextTierHTML = reward.nextTier ? `
      <div style="text-align: center; margin-top: 0.8rem; font-size: 0.85rem; color: #ff6b35; font-weight: 600;">
        💡 Just ${reward.nextTier.gap}% away from ${reward.nextTier.name} Reward (₹${reward.nextTier.amount.toLocaleString('en-IN')})!
      </div>
    ` : '';

    rewardHTML = `
      <div class="reward-display" style="background: linear-gradient(135deg, ${reward.color}15 0%, ${reward.color}25 100%); border-color: ${reward.color};">
        <div class="reward-header">
          <div class="reward-display-icon">${reward.icon}</div>
          <div class="reward-display-title">${reward.tier} Reward Earned!</div>
        </div>
        <div class="reward-message">
          Congratulations! Your exceptional attendance has earned you:
        </div>
        <div class="reward-amount-display">
          ₹${reward.amount.toLocaleString('en-IN')}
        </div>
        <div style="text-align: center; margin-top: 1rem; font-size: 0.9rem; color: rgba(45, 52, 54, 0.7);">
          🎓 ${reward.tier} Tier Achievement (${reward.range})
        </div>
        ${nextTierHTML}
      </div>
    `;
  }

  let fineHTML = '';
  if (fine) {
    fineHTML = `
      <div class="fine-section">
        <div class="fine-header">
          <div class="fine-icon">💸</div>
          <div class="fine-title">Fine Breakdown</div>
        </div>
        <div class="fine-breakdown">
          <div class="fine-item">
            <span>Percentage Below 90%:</span>
            <span style="color: #d63031; font-weight: 800;">${fine.percentageBelow}%</span>
          </div>
          <div class="fine-item">
            <span>Fine Rate:</span>
            <span style="color: #d63031; font-weight: 800;">₹400 per 1%</span>
          </div>
          <div class="fine-item">
            <span>Calculated Fine Units:</span>
            <span style="color: #d63031; font-weight: 800;">${fine.fineUnits} units</span>
          </div>
        </div>
        <div class="fine-total">
          Total Fine: ₹${fine.totalFine.toLocaleString('en-IN')}
        </div>
        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid rgba(214, 48, 49, 0.3);">
          <div style="color: #d63031; font-weight: 700; margin-bottom: 1rem; font-size: 1.1rem;">
            🔴 You are ${fine.percentageBelow}% below the required 90%
          </div>
          <div style="margin-bottom: 0.8rem; font-size: 1.05rem;">
            📚 <strong>Classes Needed:</strong> <span style="color: #ff6b35; font-weight: 800;">${fine.classesNeeded} consecutive classes</span> to reach 90%
          </div>
          <div style="margin-top: 1rem; padding: 1rem; background: rgba(214, 48, 49, 0.1); border-radius: 12px; font-size: 0.95rem; color: #d63031; font-weight: 600;">
            ⚠️ Warning: Risk of detention from Pre-University exams and CT (Class Tests)
          </div>
        </div>
      </div>
    `;
  }

  let skipHTML = '';
  if (skip) {
    if (skip.canSkip > 0) {
      skipHTML = `
        <div class="skip-calculator-section">
          <div class="skip-header">
            <div class="skip-icon">🎯</div>
            <div class="skip-title">SAFE ZONE</div>
          </div>
          <div class="skip-content">
            <div class="skip-main-stat">
              <div class="skip-number">${skip.canSkip}</div>
              <div class="skip-label">${skip.canSkip === 1 ? 'Lecture' : 'Lectures'} You Can Skip</div>
            </div>
            <div class="skip-details">
              <div class="skip-detail-item">
                <span class="skip-detail-label">Current Attendance:</span>
                <span class="skip-detail-value">${attendance.toFixed(2)}%</span>
              </div>
              <div class="skip-detail-item">
                <span class="skip-detail-label">After Skipping ${skip.canSkip}:</span>
                <span class="skip-detail-value" style="color: ${parseFloat(skip.futureAttendance) >= 90 ? '#00b894' : '#d63031'};">${skip.futureAttendance}%</span>
              </div>
              <div class="skip-detail-item">
                <span class="skip-detail-label">Max Absents Allowed:</span>
                <span class="skip-detail-value">${skip.maxAbsentsAllowed}</span>
              </div>
            </div>
            <div class="skip-warning">
              ⚠️ This calculation is based on current lecture count. Stay vigilant!
            </div>
          </div>
        </div>
      `;
    } else {
      skipHTML = `
        <div class="skip-calculator-section" style="background: linear-gradient(135deg, rgba(255, 202, 87, 0.15) 0%, rgba(255, 154, 86, 0.15) 100%); border-color: rgba(255, 202, 87, 0.4);">
          <div class="skip-header">
            <div class="skip-icon">⚠️</div>
            <div class="skip-title">Skip Calculator</div>
          </div>
          <div class="skip-content">
            <div class="skip-main-stat">
              <div class="skip-number" style="color: #fdcb6e;">0</div>
              <div class="skip-label">Lectures You Can Skip</div>
            </div>
            <div class="skip-warning" style="background: rgba(253, 203, 110, 0.2); border-left-color: #fdcb6e;">
              ⚠️ You're at exactly 90% or very close. Cannot afford to miss any classes!
            </div>
          </div>
        </div>
      `;
    }
  }

  let insightsHTML = '';
  if (insights.length > 0) {
    const insightItems = insights.map(insight => `
      <div class="insight-item ${insight.type}">
        <span class="insight-icon">${insight.icon}</span>
        <span class="insight-text">${insight.text}</span>
      </div>
    `).join('');

    insightsHTML = `
      <div class="insights-section">
        <div class="insights-header">
          <div class="insights-icon">💡</div>
          <div class="insights-title">Insights & Tips</div>
        </div>
        <div class="insights-content">
          ${insightItems}
        </div>
      </div>
    `;
  }

  resultDisplay.innerHTML = `
    <div class="result-content">
      <div class="attendance-percent ${status.class}">
        ${status.icon} ${attendance.toFixed(2)}%
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${Math.min(attendance, 100)}%; background: ${status.color};"></div>
      </div>
      <div class="result-message" style="margin-top: 1rem; color: ${status.color};">
        ${status.message}
      </div>
      <div class="result-details">
        <div style="background: rgba(108, 92, 231, 0.1); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem;">
          <strong style="color: #6c5ce7; font-size: 1.05rem;">📊 Breakdown:</strong><br>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; margin-top: 0.8rem;">
            <div><strong>Total Lectures:</strong> ${breakdown.lecture}</div>
            <div><strong>Total Absents:</strong> ${breakdown.absent}</div>
            <div><strong>OAA Credits:</strong> ${breakdown.oaa}</div>
            <div><strong>Effective Absents:</strong> ${breakdown.effectiveAbsent}</div>
          </div>
        </div>
        ${fineHTML}
        ${rewardHTML}
        ${skipHTML}
        ${insightsHTML}
      </div>
    </div>
  `;
  resultDisplay.classList.add('show');

  // Smooth scroll to results
  setTimeout(() => {
    resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

// Reset calculator
function resetCalculator() {
  document.getElementById('absent').value = '';
  document.getElementById('oaa').value = '';
  document.getElementById('lecture').value = '';
  document.getElementById('resultDisplay').classList.remove('show');
  document.getElementById('resultDisplay').innerHTML = '';
}

// Allow Enter key to calculate
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    calculate();
  }
});

// Add input animations and live validation
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
  input.addEventListener('input', (e) => {
    // Animate on input
    if (e.target.value) {
      e.target.style.transform = 'scale(1.02)';
      setTimeout(() => {
        e.target.style.transform = 'scale(1)';
      }, 200);
    }

    // Validate non-negative
    if (parseInt(e.target.value) < 0) {
      e.target.value = 0;
    }
  });

  // Add focus effects
  input.addEventListener('focus', (e) => {
    e.target.style.borderColor = '#6c5ce7';
    e.target.style.boxShadow = '0 0 0 3px rgba(108, 92, 231, 0.1)';
  });

  input.addEventListener('blur', (e) => {
    e.target.style.borderColor = 'rgba(108, 92, 231, 0.3)';
    e.target.style.boxShadow = 'none';
  });
});

// Add keyboard shortcuts info
console.log('%c⌨️ Keyboard Shortcuts', 'color: #6c5ce7; font-size: 14px; font-weight: bold;');
console.log('Enter - Calculate attendance');
console.log('Made with ❤️ for students');